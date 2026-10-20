// Renders the sponsor block into every site listed in sponsor.json.
//
// Why a generator instead of a runtime fetch: naming a sponsor is only worth doing if
// search engines and LLMs can read it, and markup injected by JavaScript after load is
// largely invisible to them. So sponsor.json is the source of truth at AUTHORING time,
// and this script writes real, static HTML into each page between the markers:
//
//   <!-- sponsor:start -->  ...generated...  <!-- sponsor:end -->
//
// Usage:
//   node scripts/sync-sponsor.mjs           rewrite every target in place
//   node scripts/sync-sponsor.mjs --check   exit 1 if any target has drifted (CI)
//
// Targets live in sponsor.json. Paths are resolved relative to the parent directory of
// this repo, so sibling repos (claude-code-usage, ...) are reachable without config.
//
// Since AG7 the hub and every React product site render the block themselves, from the
// design system's SiteSponsor fed this same JSON at build, so they are not targets: this
// script serves only the plain pages with no build. A target with "markup": "site" gets
// SiteSponsor's own markup, rendered by the component, which the design system's
// site.css styles (VDS216) and the page carries no sponsor CSS of its own; a target
// without it keeps the legacy .sponsor markup until its own migration lands.

import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { SiteSponsor } from "@viglet/viglet-design-system/site"

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = resolve(HERE, "..")
const SIBLINGS = resolve(REPO, "..")

const START = "<!-- sponsor:start"
const END = "<!-- sponsor:end -->"

const config = JSON.parse(readFileSync(join(REPO, "sponsor.json"), "utf8"))

/** Escapes the five XML entities so JSON text can never break the surrounding markup. */
function esc(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

function productById(id) {
  const found = config.products.find((p) => p.id === id)
  if (!found) throw new Error(`sponsor.json: unknown product id "${id}" in inlineProducts`)
  return found
}

/**
 * The generated block. One shape for every site — the sites share the class names and
 * style them with their own tokens, so a single generator serves all of them.
 *
 * `assetPrefix` is where that site keeps the logo files (they are copied per repo so
 * each page stays self-contained and works offline, like the rest of these sites).
 */
function renderBlock(assetPrefix) {
  const { sponsor } = config
  const inline = config.inlineProducts.map(productById)

  const products = inline
    .map(
      (p) => `        <a class="sponsor-product" href="${esc(p.url)}" target="_blank" rel="noopener">
          <img src="${esc(assetPrefix)}${esc(p.logo.split("/").pop())}" alt="${esc(p.name)} logo"
               width="28" height="28" loading="lazy" decoding="async">
          <span>
            <b>${esc(p.name)}</b>
            <small>${esc(p.inline)}</small>
          </span>
        </a>`
    )
    .join("\n")

  return `${START} — generated from alegauss.github.io/sponsor.json by
       scripts/sync-sponsor.mjs. Edit the JSON, not this block. Kept as static markup
       on purpose: a runtime fetch would keep the sponsor out of the HTML that crawlers
       and LLMs actually read. -->
  <div class="sponsor">
    <img class="sponsor-mark" src="${esc(assetPrefix)}${esc(sponsor.logo.split("/").pop())}"
         alt="${esc(sponsor.name)} logo" width="42" height="42" loading="lazy" decoding="async">
    <div class="sponsor-body">
      <span class="sponsor-label">${esc(sponsor.label)}</span>
      <a class="sponsor-name" href="${esc(sponsor.url)}" target="_blank" rel="noopener">${esc(sponsor.name)}</a>
      <p>
        ${esc(sponsor.summary)} More at
        <a href="${esc(sponsor.url)}" target="_blank" rel="noopener">${esc(sponsor.siteLabel)}</a>.
      </p>
      <div class="sponsor-products">
${products}
      </div>
    </div>
  </div>
  ${END}`
}

/** The design system's markup, from the component itself, so the plain pages and the
 *  React sites cannot drift: class for class what SiteSponsor renders. */
function renderSiteBlock(assetPrefix) {
  // each site keeps the logo files flat under its assetPrefix, as the legacy block does
  const flat = (o) => ({ ...o, logo: o.logo.split("/").pop() })
  const declaration = { ...config, sponsor: flat(config.sponsor), products: config.products.map(flat) }
  const markup = renderToStaticMarkup(createElement(SiteSponsor, { declaration, assetBase: assetPrefix, moreLabel: "More at" }))
  return `${START} — generated from alegauss.github.io/sponsor.json by
       scripts/sync-sponsor.mjs, as the design system's SiteSponsor renders it. Edit the
       JSON, not this block; site.css styles it. -->
  ${markup}
  ${END}`
}

const check = process.argv.includes("--check")
let changed = 0
let missing = 0

for (const target of config.targets) {
  // The canonical repo is this one; siblings sit next to it on disk.
  const base = target.repo === "alegauss.github.io" ? REPO : join(SIBLINGS, target.repo)
  const file = join(base, target.file)

  if (!existsSync(file)) {
    console.error(`missing: ${target.repo}/${target.file}`)
    missing++
    continue
  }

  const html = readFileSync(file, "utf8")
  const from = html.indexOf(START)
  const to = html.indexOf(END)
  if (from === -1 || to === -1 || to < from) {
    console.error(
      `no sponsor markers in ${target.repo}/${target.file} — add "${START} -->" and "${END}"`
    )
    missing++
    continue
  }

  const block = target.markup === "site" ? renderSiteBlock(target.assetPrefix) : renderBlock(target.assetPrefix)
  const next = html.slice(0, from) + block + html.slice(to + END.length)
  if (next === html) {
    console.log(`ok:      ${target.repo}/${target.file}`)
    continue
  }

  changed++
  if (check) {
    console.error(`drifted: ${target.repo}/${target.file}`)
  } else {
    writeFileSync(file, next)
    console.log(`wrote:   ${target.repo}/${target.file}`)
  }
}

if (missing > 0) process.exit(1)
if (check && changed > 0) {
  console.error(`\n${changed} file(s) out of sync — run: node scripts/sync-sponsor.mjs`)
  process.exit(1)
}
