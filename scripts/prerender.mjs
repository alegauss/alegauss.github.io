// Writes every page of the hub, and every file built from the same data (AG3, AG6).
//
// Runs after `vite build` (dist/, holding the index.html template and the client assets)
// and `vite build --ssr src/entry-server.tsx` (dist-server/). For each route in the
// table: the prerendered page and its Markdown twin (prerenderSite, from the design
// system), an og:image card drawn from the route's own words, and the route's rows in
// sitemap.xml and llms.txt. Then the files other sites read: projects.json (generated
// from the catalogue, in the shape it has always had), sponsor.json, robots.txt and the
// changelog's Atom feed.

import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { lastAuthoredChange, ogCardSvg, prerenderSite, renderOgCard } from "@viglet/viglet-design-system/vite"
import { siteThemeScript } from "@viglet/viglet-design-system/site"
import * as app from "../dist-server/entry-server.js"

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const DIST = join(REPO, "dist")
const { SITE, ROUTES, PROJECTS } = app

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
const abs = (path) => `${SITE.origin}${path}`
const slug = (path) => app.outputDir(path).replaceAll("/", "-") || "home"

// The theme's pre-paint script goes into the template once, so every page inherits it.
const templatePath = join(DIST, "index.html")
const template = readFileSync(templatePath, "utf8")
if (!template.includes("<!--theme-script-->")) throw new Error("prerender: index.html lost its <!--theme-script--> anchor")
writeFileSync(templatePath, template.replace("<!--theme-script-->", `<script>${siteThemeScript(SITE.themeKey)}</script>`))

const written = prerenderSite({
  distDir: DIST,
  routes: app.ROUTE_META,
  render: app.render,
  canonicalUrl: app.canonicalUrl,
  outputDir: app.outputDir,
  twin: app.twin,
  manifest: { name: SITE.name, base: "/", llms: "llms.txt" },
  // the hub's sitemap also lists the product sites and robots.txt their sitemaps, which
  // the helper's route-only versions cannot say; both are written below instead
  sitemap: false,
  robots: false,
  log: (line) => console.log(line),
})

// One card per page, drawn from that page's words: a product's card is that product's.
const logo = readFileSync(join(REPO, "public", "logo.svg"), "utf8")
mkdirSync(join(DIST, "og"), { recursive: true })
for (const route of ROUTES) {
  const file = `og/${slug(route.path)}.png`
  const { eyebrow, title, titleAccent, line, accent, mark } = route.card
  await renderOgCard({ svg: ogCardSvg({ eyebrow, title, titleAccent, line, accent, mark: mark ?? logo, tone: "warm" }), out: join(DIST, file) })

  const html = join(DIST, app.outputDir(route.path), "index.html")
  const tags = [
    `<meta property="og:image" content="${esc(abs(`/${file}`))}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:image" content="${esc(abs(`/${file}`))}" />`,
    `<link rel="alternate" type="text/markdown" href="${esc(abs(`${route.path}index.md`))}" />`,
    `<link rel="alternate" type="application/atom+xml" title="alegauss changelog" href="${esc(abs("/changelog/feed.xml"))}" />`,
    ...(route.index ? [] : [`<meta name="robots" content="noindex" />`]),
  ]
  writeFileSync(html, readFileSync(html, "utf8").replace("</head>", `  ${tags.join("\n    ")}\n  </head>`))
}

// GitHub Pages serves /404.html for any path it does not have.
copyFileSync(join(DIST, "404", "index.html"), join(DIST, "404.html"))

// sitemap.xml: every hub page, then every product site. lastmod is when the content
// last changed: the authored tree's last commit, or the newest ledger entry if later.
const ships = app.shipsOf()
const authored = lastAuthoredChange(REPO, ["src", "public", "index.html", "sponsor.json", ".claude-plugin"])
const lastmod = [authored, ships[0]?.date].filter(Boolean).sort().at(-1)
const sites = PROJECTS.map((p) => app.productSite(p)).filter(Boolean)
const urls = [...ROUTES.filter((r) => r.index).map((r) => abs(r.path)), ...sites.map(abs)]
writeFileSync(
  join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url>\n    <loc>${esc(u)}</loc>${lastmod && u.startsWith(abs("/")) && !sites.some((s) => u === abs(s)) ? `\n    <lastmod>${lastmod}</lastmod>` : ""}\n  </url>`).join("\n") +
    `\n</urlset>\n`,
)

// robots.txt is only read at the host root, so each product site's sitemap has to be
// named here: a Sitemap: line inside /<project>/robots.txt is ignored by crawlers.
writeFileSync(
  join(DIST, "robots.txt"),
  [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${abs("/sitemap.xml")}`,
    ...PROJECTS.filter((p) => app.productSite(p) && !p.noSitemap).map((p) => `Sitemap: ${abs(`${app.productSite(p)}sitemap.xml`)}`),
    "",
  ].join("\n"),
)

writeFileSync(join(DIST, "llms.txt"), app.llmsTxt())

// The changelog as Atom: the newest 50 entries across every product.
const feedShips = ships.slice(0, 50)
writeFileSync(
  join(DIST, "changelog", "feed.xml"),
  `<?xml version="1.0" encoding="utf-8"?>\n<feed xmlns="http://www.w3.org/2005/Atom">\n` +
    `  <title>alegauss — what every product shipped</title>\n` +
    `  <id>${abs("/changelog/")}</id>\n` +
    `  <link rel="alternate" href="${abs("/changelog/")}"/>\n` +
    `  <link rel="self" href="${abs("/changelog/feed.xml")}"/>\n` +
    `  <updated>${feedShips[0]?.date ?? "1970-01-01"}T00:00:00Z</updated>\n` +
    `  <author><name>${esc(SITE.author)}</name></author>\n` +
    feedShips
      .map((s) => {
        const href = s.commit ? app.commitUrl(s.project, s.commit) : abs(`/changelog/${s.project.id}/`)
        const text = [app.shipTitle(s), app.shipBody(s)].filter(Boolean).join(" — ")
        return (
          `  <entry>\n` +
          `    <title>${esc(`${s.project.name} · ${s.id}: ${app.shipTitle(s)}`)}</title>\n` +
          `    <id>${esc(`${abs(`/changelog/${s.project.id}/`)}#${s.id}`)}</id>\n` +
          `    <link href="${esc(href)}"/>\n` +
          `    <updated>${s.date ?? "1970-01-01"}T00:00:00Z</updated>\n` +
          `    <summary>${esc(text)}</summary>\n` +
          `  </entry>\n`
        )
      })
      .join("") +
    `</feed>\n`,
)

// projects.json keeps the shape other sites already read; it is generated now, not kept.
const published = PROJECTS.map((p) => {
  const out = { name: p.name, group: p.group, kind: p.kind, blurb: p.blurb, pitch: p.pitch }
  if (p.shot) out.shot = p.shot
  if (p.cta) out.cta = p.cta
  Object.assign(out, { tags: p.tags, site: p.site, repo: p.repo, accent: p.accent })
  if (p.logo) out.logo = p.logo
  if (p.mark) out.mark = p.mark
  out.page = abs(app.productPath(p))
  return out
})
writeFileSync(join(DIST, "projects.json"), JSON.stringify(published, null, 2) + "\n")
copyFileSync(join(REPO, "sponsor.json"), join(DIST, "sponsor.json"))

console.log(`prerendered ${written.length} pages, ${ROUTES.length} OG cards, ${urls.length} sitemap rows`)
