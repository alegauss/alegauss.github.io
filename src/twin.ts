/* The Markdown twin of every page (index.md beside index.html) and llms.txt (AG6).
   Written from the same data as the pages rather than scraped from their HTML, so an
   agent reading the twin gets every fact the page states and none of its chrome. */

import { SITE } from "./data/site.ts"
import { LINES } from "./data/lines.ts"
import { PROJECTS, type Project } from "./data/projects.ts"
import { absolute, asset, linePath, productPath, productSite } from "./data/links.ts"
import { NUMBERS_AS_OF, numbersOf, recordsOf, shipsOf, shipTitle, type DatedShip } from "./data/records.ts"
import { LAB_FIGURES } from "./data/lab.ts"
import { MARKETPLACE, marketplaceAdd, pluginFor, pluginInstall } from "./data/plugins.ts"
import { ROUTES, routeFor } from "./routes.tsx"
import { changelogShips } from "./pages/Changelog.tsx"
import { METHOD_STEPS } from "./pages/Method.tsx"

const link = (text: string, href: string) => `[${text}](${/^https?:/.test(href) ? href : absolute(href)})`
const item = (p: Project) => `- ${link(p.name, productPath(p))} — ${p.kind}. ${p.blurb}`
const ship = (s: DatedShip, product = true) => `- ${s.date ?? "undated"}${product ? ` · ${s.project.name}` : ""} · ${s.id}: ${shipTitle(s)}`

function product(p: Project): string {
  const r = recordsOf(p)
  const n = numbersOf(p)
  const plugin = pluginFor(p.id)
  const site = productSite(p)
  const out = [
    `# ${p.name}`,
    "",
    `${p.kind} · ${p.lines.map((id) => LINES.find((l) => l.id === id)!.name).join(" · ")}`,
    "",
    p.pitch,
    "",
    `- Platform: ${p.platform}`,
    `- Licence: ${p.licence}`,
    ...(site ? [`- Product site: ${absolute(site)}`] : []),
    ...(p.docs ? [`- Documentation: ${/^https?:/.test(p.docs) ? p.docs : absolute(asset(p.docs))}`] : []),
    ...(p.download ? [`- Download: ${p.download}`] : []),
    `- Source: ${p.repo}`,
  ]
  const stats = [
    ...(n.stars !== undefined ? [`${n.stars} GitHub stars`] : []),
    ...(n.release ? [`latest release ${n.release.tag}${n.release.date ? ` (${n.release.date})` : ""}${n.release.downloads !== undefined ? `, ${n.release.downloads} downloads` : ""}`] : []),
    ...(n.pypiLastMonth !== undefined ? [`${n.pypiLastMonth} PyPI downloads in the last 30 days`] : []),
  ]
  if (stats.length) out.push("", `Public numbers as of ${NUMBERS_AS_OF}: ${stats.join("; ")}.`)
  const steps = [...(plugin ? [{ label: "Claude Code plugin", command: `${marketplaceAdd}\n${pluginInstall(plugin.name)}` }] : []), ...p.install]
  if (steps.length) {
    out.push("", "## Install")
    for (const s of steps) out.push("", `${s.label}:`, "", "```", s.command, "```")
  }
  out.push("", "## What comes next", "", `From ${r.roadmapFile} at ${r.sha.slice(0, 7)}.`)
  const open = r.blocks.filter((b) => b.open.length)
  if (!open.length) out.push("", "Nothing is open on this product's roadmap right now.")
  for (const b of open) out.push("", `### Block ${b.label} — ${b.title}`, "", ...b.open.map((l) => `- ${l.status} ${l.symptom}`))
  const ships = shipsOf([p]).slice(0, 8)
  if (ships.length) out.push("", "## Recently shipped", "", ...ships.map((s) => ship(s, false)), "", `All entries: ${absolute(`/changelog/${p.id}/`)}`)
  return out.join("\n")
}

function body(path: string): string {
  const route = routeFor(path)
  if (path === "/") {
    const flagship = PROJECTS.find((p) => p.id === SITE.flagship)!
    return [
      `# ${SITE.title}`,
      "",
      SITE.description,
      "",
      `Flagship: ${link(flagship.name, productPath(flagship))} — ${flagship.blurb}`,
      "",
      "## Product lines",
      "",
      ...LINES.map((l) => `- ${link(l.name, linePath(l.id))} — ${l.promise}`),
      "",
      "## Every product",
      "",
      ...PROJECTS.map(item),
      "",
      "## Recently shipped",
      "",
      ...shipsOf().slice(0, 6).map((s) => ship(s)),
      "",
      "## About",
      "",
      `Every product here is made by Alexandre Oliveira (alegauss), a software developer in Brazil. He also builds ${link(SITE.orgs.viglet.name, SITE.orgs.viglet.url)}, open-source enterprise search and content tools (Viglet Turing, Viglet Shio and Viglet Dumont), ${link("Cursarei", "https://cursarei.com.br/")}, an independent directory of Brazilian courses, and the ${link(SITE.orgs.japode.name, SITE.orgs.japode.url)} apps. Elsewhere: ${SITE.profiles.join(", ")}.`,
    ].join("\n")
  }
  const line = LINES.find((l) => linePath(l.id) === path)
  if (line) return [`# ${line.name}`, "", line.promise, "", line.lead, "", ...PROJECTS.filter((p) => p.lines.includes(line.id)).map(item)].join("\n")
  const p = PROJECTS.find((x) => productPath(x) === path)
  if (p) return product(p)
  if (path.startsWith("/changelog/")) {
    const id = path.split("/")[2]
    const proj = PROJECTS.find((x) => x.id === id)
    const lineOf = LINES.find((l) => path === `/changelog/lines/${l.slug}/`)
    const ships = proj
      ? changelogShips({ kind: "product", project: proj })
      : lineOf
        ? changelogShips({ kind: "line", line: lineOf })
        : changelogShips({ kind: "all" })
    return [`# ${route.title}`, "", route.description, "", ...ships.map((s) => ship(s, !proj))].join("\n")
  }
  if (path === "/method/") {
    return [
      "# The method",
      "",
      route.description,
      "",
      ...METHOD_STEPS.flatMap((s, i) => [
        `## ${i + 1}. ${s.title}`,
        "",
        s.text,
        "",
        `Tools: ${s.tools.map((id) => link(PROJECTS.find((x) => x.id === id)!.name, productPath(id))).join(", ")}`,
        "",
      ]),
      "## Measured, not claimed",
      "",
      ...LAB_FIGURES.map((f) => `- ${f.value} ${f.label} — “${f.quote}” (${f.url})`),
    ].join("\n")
  }
  if (path === "/plugins/") {
    return [
      "# Claude Code plugins",
      "",
      MARKETPLACE.description,
      "",
      "```",
      marketplaceAdd,
      "```",
      "",
      ...MARKETPLACE.plugins.map((pl) => `- ${pl.name}: \`${pluginInstall(pl.name)}\` — ${pl.description}`),
    ].join("\n")
  }
  return `# ${route.title}\n\n${route.description}`
}

export const twin = (path: string) => `${body(path)}\n`

/** llms.txt: the site's index for a language model, in the llmstxt.org shape. */
export function llmsTxt(): string {
  const sections = ["Site", "Product lines", "Products", "Changelog"] as const
  return (
    [
      `# ${SITE.name}`,
      "",
      `> ${SITE.description}`,
      "",
      "Every page has a Markdown twin: append index.md to its URL.",
      ...sections.flatMap((s) => [
        "",
        `## ${s}`,
        "",
        ...ROUTES.filter((r) => r.index && r.section === s).map((r) => `- [${r.title}](${absolute(`${r.path}index.md`)}): ${r.description}`),
      ]),
      "",
      "## Product sites",
      "",
      ...PROJECTS.filter((p) => productSite(p)).map((p) => `- [${p.name}](${absolute(productSite(p)!)}): ${p.blurb}`),
    ].join("\n") + "\n"
  )
}
