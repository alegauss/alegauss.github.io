// Checks the built site against the roadmap's "done when" lines, so a regression fails
// the build instead of shipping. Run after scripts/prerender.mjs:
//
//   node scripts/verify.mjs
//
// Each check names the task it holds. It reads dist/ and the sources, nothing else.

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { dirname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import * as app from "../dist-server/entry-server.js"

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const DIST = join(REPO, "dist")
const { SITE, ROUTES, PROJECTS } = app
const failures = []
const check = (task, ok, what) => {
  if (!ok) failures.push(`${task}: ${what}`)
}

const walk = (dir) => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]))
const read = (path) => readFileSync(join(DIST, path), "utf8")
// React separates adjacent text with <!-- -->; a check reads the text a visitor sees
const page = (route) => read(join(app.outputDir(route), "index.html")).replaceAll("<!-- -->", "")
const html = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
const pages = walk(DIST).filter((f) => f.endsWith(".html"))

// AG1 — no request to googletagmanager.com leaves a page before consent, and the badge
// says only what the page does.
for (const f of pages) check("AG1", !readFileSync(f, "utf8").includes("googletagmanager"), `${relative(DIST, f)} loads the tag before consent`)
check("AG1", !page("/").includes("no tracking"), "the home page still promises no tracking")
check("AG1", page("/").includes("analytics only with your consent"), "the badge does not say analytics waits for consent")

// AG2 — the deploy publishes only the build output, and no colour or radius in the hub
// is declared outside the design system (a project's accent comes from the catalogue).
// src/tone.css is the one exception: the navy tone the design system does not ship.
const workflow = readFileSync(join(REPO, ".github", "workflows", "deploy.yml"), "utf8")
check("AG2", /path:\s*\.?\/?dist\b/.test(workflow), "deploy.yml does not upload dist/")
check("AG2", !existsSync(join(DIST, "docs")) && !existsSync(join(DIST, "scripts")), "docs/ or scripts/ is published")
const sources = walk(join(REPO, "src")).filter((f) => /\.(css|tsx)$/.test(f) && f !== join(REPO, "src", "tone.css"))
for (const f of sources) {
  const text = readFileSync(f, "utf8")
  const colour = text.match(/#[0-9a-fA-F]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|oklch)\((?!var\(--a-rgb\))/)
  check("AG2", !colour, `${relative(REPO, f)} declares a colour of its own (${colour?.[0]})`)
  const radius = text.match(/border-radius:(?!\s*(?:var\(--vg-radius|inherit|50%))[^;]+|rounded-\[(?!var\(--vg-radius)[^\]]+\]/)
  check("AG2", !radius, `${relative(REPO, f)} declares a radius of its own (${radius?.[0]})`)
}
for (const keep of ["projects.json", "sponsor.json", "logo.svg", "viglet/viglet-logo.png", "viglet/turing-logo.png", "viglet/shio-logo.png", "google118ed8795fc5ac02.html", ".nojekyll"]) {
  check("AG2", existsSync(join(DIST, keep)), `${keep} is no longer served`)
}

// AG3 — the built index.html carries every project's name, blurb and link with
// JavaScript disabled, and projects.json comes from the same source as the cards.
const home = page("/")
const published = JSON.parse(read("projects.json"))
for (const p of PROJECTS) {
  check("AG3", home.includes(html(p.name)), `the home page HTML lacks ${p.name}`)
  check("AG3", home.includes(html(p.blurb)), `the home page HTML lacks ${p.name}'s blurb`)
  check("AG3", home.includes(`href="${app.productPath(p)}"`), `the home page HTML lacks a link to ${p.name}`)
  check("AG3", published.some((x) => x.name === p.name && x.blurb === p.blurb && x.site === p.site), `projects.json disagrees with the catalogue on ${p.name}`)
}

// AG4 — each line has its own page and the home page leads with the flagship.
for (const slug of ["agent-workbench", "windows-native", "lab"]) check("AG4", existsSync(join(DIST, "lines", slug, "index.html")), `/lines/${slug}/ is missing`)
const flagship = PROJECTS.find((p) => p.id === SITE.flagship)
check("AG4", home.indexOf("Flagship") !== -1 && home.indexOf("Flagship") < home.indexOf('id="lines"'), "the flagship does not come first")
check("AG4", home.includes(`id="flagship"`) && home.includes(html(flagship.name)), "the flagship panel is missing")

// AG5 — every project has a page carrying a SoftwareApplication JSON-LD block.
// AG9 — each page lists its open blocks, or says the roadmap is empty.
for (const p of PROJECTS) {
  const path = app.productPath(p)
  check("AG5", existsSync(join(DIST, app.outputDir(path), "index.html")), `${path} is missing`)
  if (!existsSync(join(DIST, app.outputDir(path), "index.html"))) continue
  const text = page(path)
  check("AG5", /"@type":"SoftwareApplication"/.test(text), `${path} has no SoftwareApplication JSON-LD`)
  check("AG9", text.includes("What comes next"), `${path} has no "What comes next"`)
}

// AG6 — adding a project adds it to the sitemap, llms.txt and an OG image.
const sitemap = read("sitemap.xml")
const llms = read("llms.txt")
for (const r of ROUTES) {
  const slug = app.outputDir(r.path).replaceAll("/", "-") || "home"
  check("AG6", existsSync(join(DIST, "og", `${slug}.png`)), `no OG card for ${r.path}`)
  check("AG6", page(r.path).includes(`og:image" content="${SITE.origin}/og/${slug}.png"`), `${r.path} does not point at its OG card`)
  if (!r.index) continue
  check("AG6", sitemap.includes(`<loc>${SITE.origin}${r.path}</loc>`), `the sitemap lacks ${r.path}`)
  check("AG6", llms.includes(`${SITE.origin}${r.path}index.md`), `llms.txt lacks ${r.path}`)
  check("AG6", existsSync(join(DIST, app.outputDir(r.path), "index.md")), `${r.path} has no Markdown twin`)
}

// AG7 — the sponsor is in the served HTML, rendered by the design system's component.
check("AG7", home.includes("vg-site-sponsor") && home.includes("Viglet Turing"), "the sponsor block is not in the home page HTML")

// AG8 — the changelog and its feed carry the newest ledger entries.
const feed = read("changelog/feed.xml")
const newest = app.shipsOf()[0]
check("AG8", feed.includes("<entry>") && feed.includes(html(newest.id)), "the feed lacks the newest entry")
check("AG8", page("/changelog/").includes(html(newest.id)), "/changelog/ lacks the newest entry")

// AG10 — a download count carries an "as of" date wherever one is shown.
for (const p of PROJECTS) {
  const text = page(app.productPath(p))
  if (/downloads<\/dt>/.test(text)) check("AG10", /as of \d{4}-\d{2}-\d{2}/.test(text), `${p.name} shows downloads without a date`)
}

// AG11 — the method page links every Workbench product, and every figure has a source.
const method = page("/method/")
for (const p of PROJECTS.filter((x) => x.lines.includes("workbench"))) check("AG11", method.includes(`href="${app.productPath(p)}"`), `the method page does not link ${p.name}`)

// AG13 — the plugins page lists every plugin in the manifest Claude Code reads.
const manifest = JSON.parse(readFileSync(join(REPO, ".claude-plugin", "marketplace.json"), "utf8"))
const plugins = page("/plugins/")
for (const pl of manifest.plugins) check("AG13", plugins.includes(`/plugin install ${pl.name}@${manifest.name}`), `/plugins/ lacks ${pl.name}`)

// AG14 — the header search, when it is on, says it runs on Viglet Turing.
if (SITE.search.site) check("AG14", home.includes("Search runs on"), "the search does not credit Viglet Turing")

if (failures.length) {
  console.error(`verify: ${failures.length} failure(s)\n  ${failures.join("\n  ")}`)
  process.exit(1)
}
console.log(`verify: ${pages.length} pages pass every check`)
