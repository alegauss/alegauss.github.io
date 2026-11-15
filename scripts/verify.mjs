// Checks the built site against the roadmap's "done when" lines, so a regression fails
// the build instead of shipping. Run after scripts/prerender.mjs:
//
//   node scripts/verify.mjs
//
// Each check names the task it holds. It reads dist/ and the sources, nothing else.

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { dirname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { createHash } from "node:crypto"
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
// AG17 — the studio's positioning survives prerender and the text-only twin.
check("AG17", home.includes(html(SITE.positioning)) && home.includes(html(SITE.method)), "the home page lacks the shared development method")
check("AG17", read("index.md").includes(SITE.headline) && read("index.md").includes(SITE.method), "the Markdown twin lacks the positioning")
// AG26 — the offering comes before the supporting studio signature.
check("AG26", home.indexOf(html(SITE.heroTitle)) < home.indexOf(html(SITE.headline)) && home.includes(html(SITE.heroAccent)), "the offering is not the primary hero message")
check("AG26", home.includes('href="#products"') && home.includes('href="/method/"'), "hero lacks discovery and method actions")
check("AG26", read("index.md").indexOf(SITE.heroTitle) < read("index.md").indexOf(SITE.headline), "Markdown prioritises the motto over the offering")
check("AG24", home.indexOf('id="our-method"') < home.indexOf('id="products"') && home.indexOf('id="products"') < home.indexOf('id="recent-updates"'), "home discovery order is wrong")
check("AG24", home.includes('id="ai-examples"') && !home.includes('class="hub-entry'), "home lacks application examples or still carries detailed task entries")
check("AG24", read("index.md").indexOf("## Built with our own tools") < read("index.md").indexOf("## Recent updates"), "Markdown discovery order disagrees with HTML")
// AG27 — authentic application results precede the configurable developer flagship.
check("AG27", home.indexOf('data-home-showcase') < home.indexOf('id="flagship"'), "application outcomes still follow the flagship")
for (const id of app.SHOWCASE_IDS) {
  const demo = app.DEMONSTRATIONS[id]
  check("AG27", home.includes(`data-showcase-product="${id}"`) && home.includes(html(demo.source)), `${id} lacks a sourced showcase`)
  for (const image of demo.images) check("AG27", home.includes(`src="${image.src}"`) && home.includes(`alt="${html(image.alt)}"`), `${id} lacks an authentic accessible result`)
}
// AG31 — check rendered navigation, not the source's character spelling.
const updateLabels = [...home.matchAll(/<a[^>]*href="\/changelog\/[^"/]+\/"[^>]*>([^<]* updates[^<]*)<\/a>/g)].map((match) => match[1])
check("AG31", updateLabels.length > 0 && updateLabels.every((label) => label.endsWith(" \u2192")), "recent-update links lost their navigation arrows")
for (const name of ["Modelado", "Revelei"]) check("AG31", home.includes(`Explore ${name} \u2192`), `${name}'s Explore link lost its navigation arrow`)
check("AG31", !/\]\([^\n]+\) \? \d{4}-\d{2}-\d{2}/.test(read("index.md")), "Markdown update dates have a corrupted separator")
const published = JSON.parse(read("projects.json"))
// AG20 — all cards remain visible once in the static catalogue before enhancement.
check("AG20", (home.match(/data-catalogue-card=/g) || []).length === PROJECTS.length, "static catalogue is incomplete or duplicated")
check("AG20", home.includes('data-island="catalogue-filters"'), "catalogue filter enhancement is absent")
for (const p of PROJECTS) {
  const card = home.match(new RegExp(`<article[^>]*data-catalogue-card="${p.id}"[^>]*>[\\s\\S]*?</article>`))?.[0] || ""
  check("AG21", card.includes(html(p.blurb)) && !card.includes(".NET 10") && !card.includes("ONNX Runtime"), `${p.name}'s card does not prioritise the outcome`)
  check("AG3", home.includes(html(p.name)), `the home page HTML lacks ${p.name}`)
  check("AG3", home.includes(html(p.blurb)), `the home page HTML lacks ${p.name}'s blurb`)
  check("AG3", home.includes(`href="${app.productPath(p)}"`), `the home page HTML lacks a link to ${p.name}`)
  check("AG3", published.some((x) => x.name === p.name && x.blurb === p.blurb && x.site === p.site), `projects.json disagrees with the catalogue on ${p.name}`)
}

// AG4 — each line has its own page and the home page leads with the flagship.
for (const slug of ["agent-workbench", "windows-native", "lab"]) check("AG4", existsSync(join(DIST, "lines", slug, "index.html")), `/lines/${slug}/ is missing`)
// AG18 ? purpose families are complete and the original line addresses stay usable.
for (const line of app.LINES) {
  check("AG18", page(`/lines/${line.slug}/`).includes(html(line.name)), `${line.name} has no line page`)
  check("AG18", published.filter((p) => p.lines.includes(line.id)).length === PROJECTS.filter((p) => p.lines.includes(line.id)).length, `${line.name} has inconsistent counts`)
}
for (const p of PROJECTS) check("AG18", p.lines.length > 0 && p.lines.every((id) => app.LINES.some((l) => l.id === id)), `${p.name} has an unknown family`)
for (const id of ["modelado", "revelei"]) check("AG18", PROJECTS.find((p) => p.id === id).lines.includes("applications"), `${id} is not an AI application`)
check("AG18", !app.LINES.some((l) => l.name === "Windows Native"), "Windows remains a primary family")
const flagship = PROJECTS.find((p) => p.id === SITE.flagship)
check("AG4", home.indexOf("Flagship") !== -1 && home.indexOf("Flagship") < home.indexOf('id="lines"'), "the flagship does not come first")
check("AG4", home.includes(`id="flagship"`) && home.includes(html(flagship.name)), "the flagship panel is missing")

// AG5 — every project has a page carrying a SoftwareApplication JSON-LD block.
// AG19 — the same reviewed availability is visible on every discovery surface.
for (const p of PROJECTS) {
  const a = p.availability
  check("AG19", a.source.includes("/blob/") && /\d{4}-\d{2}-\d{2}/.test(a.reviewed) && a.evidence, `${p.name} lacks availability evidence`)
  check("AG19", page(app.productPath(p)).includes(app.MATURITY_LABELS[a.state]) && read(`${app.outputDir(app.productPath(p))}/index.md`).includes(a.source), `${p.name} has inconsistent availability`)
  check("AG19", !p.tags.includes("In development"), `${p.name} keeps an unstructured maturity tag`)
  if (app.availabilityStale(a)) console.warn(`AG19: review availability for ${p.name} (last checked ${a.reviewed})`)
}
check("AG19", app.availabilityStale({ source: "", reviewed: "" }), "missing evidence is not flagged")
check("AG19", app.availabilityStale({ source: "source", reviewed: "2020-01-01" }), "old evidence is not flagged")
// AG9 — each page lists its open blocks, or says the roadmap is empty.
for (const p of PROJECTS) {
  const path = app.productPath(p)
  check("AG5", existsSync(join(DIST, app.outputDir(path), "index.html")), `${path} is missing`)
  if (!existsSync(join(DIST, app.outputDir(path), "index.html"))) continue
  const text = page(path)
  check("AG25", text.includes(html(p.audience)) && text.includes(html(p.outcome)), `${p.name} lacks audience or outcome guidance`)
  check("AG5", /"@type":"SoftwareApplication"/.test(text), `${path} has no SoftwareApplication JSON-LD`)
  check("AG9", text.includes("What comes next"), `${path} has no "What comes next"`)
}

for (const [id, demo] of Object.entries(app.DEMONSTRATIONS)) {
  const text = page(app.productPath(id))
  const markdown = read(`${app.outputDir(app.productPath(id))}/index.md`)
  check("AG25", text.includes(html(demo.caption)) && markdown.includes(demo.caption), `${id} lacks the demonstration explanation`)
  for (const image of demo.images) {
    const file = join(DIST, image.src.replace(/^\//, ""))
    check("AG25", existsSync(file) && createHash("sha256").update(readFileSync(file)).digest("hex") === image.sha256, `${image.src} differs from the pinned example`)
    check("AG25", text.includes(`alt="${html(image.alt)}"`) && markdown.includes(image.alt), `${image.src} lacks useful alternative text`)
  }
}

// AG6 — adding a project adds it to the sitemap, llms.txt and an OG image.
// sitemap.xml is an index of the hub's own sitemap and every product site's; robots.txt
// names the index, and no sitemap written here lists a URL outside the origin.
const index = read("sitemap.xml")
const sitemap = read("sitemap-hub.xml")
const llms = read("llms.txt")
const locs = (xml) => [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1])
check("AG6", index.includes("<sitemapindex") && !index.includes("<urlset"), "sitemap.xml is not a sitemap index")
check("AG6", locs(index).includes(`${SITE.origin}/sitemap-hub.xml`), "the sitemap index lacks sitemap-hub.xml")
check("AG6", read("robots.txt").includes(`Sitemap: ${SITE.origin}/sitemap.xml`), "robots.txt does not name the sitemap index")
for (const u of [...locs(index), ...locs(sitemap)]) check("AG6", u.startsWith(`${SITE.origin}/`), `a sitemap lists ${u}, outside ${SITE.origin}`)
for (const p of PROJECTS) {
  const site = app.productSite(p)
  if (!site || p.canonicalHost) continue
  if (p.noSitemap) check("AG6", locs(sitemap).includes(`${SITE.origin}${site}`), `the hub sitemap lacks ${p.name}'s site`)
  else check("AG6", locs(index).includes(`${SITE.origin}${site}sitemap.xml`), `the sitemap index lacks ${p.name}'s sitemap`)
}
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
check("AG22", method.includes("Plan, implement, test, commit. Repeat.") && method.includes("Suggested tracks"), "method does not distinguish the real cycle and suggested combinations")
for (const use of app.METHOD_USES) {
  // AG23 — both endpoints carry the related product and the same source.
  check("AG23", use.application !== use.tool && [use.application, use.tool].every((id) => PROJECTS.some((p) => p.id === id)), "development relationship has invalid endpoints")
  for (const [from, to] of [[use.application, use.tool], [use.tool, use.application]]) {
    const path = app.productPath(from)
    check("AG23", page(path).includes(`href="${app.productPath(to)}"`) && page(path).includes(html(use.source)), `${from} lacks its development relationship to ${to}`)
    check("AG23", read(`${app.outputDir(path)}/index.md`).includes(app.productPath(to)) && read(`${app.outputDir(path)}/index.md`).includes(use.source), `${from}'s Markdown lacks relationship evidence`)
  }
  check("AG22", method.includes(html(use.source)) && read("method/index.md").includes(use.source), "method evidence is missing in HTML or Markdown")
  check("AG22", use.basis !== "Repository evidence" || /\/blob\/[a-f0-9]{40}\//.test(use.source), "repository evidence is not pinned")
}
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
