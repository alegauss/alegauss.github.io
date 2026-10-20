import type { ReactNode } from "react"
import { SITE } from "./data/site.ts"
import { LINES } from "./data/lines.ts"
import { PROJECTS } from "./data/projects.ts"
import { linePath, productPath } from "./data/links.ts"
import { recordsOf } from "./data/records.ts"
import { Home } from "./pages/Home.tsx"
import { Line } from "./pages/Line.tsx"
import { Product } from "./pages/Product.tsx"
import { Changelog, type ChangelogScope } from "./pages/Changelog.tsx"
import { Method } from "./pages/Method.tsx"
import { Plugins } from "./pages/Plugins.tsx"
import { NotFound } from "./pages/NotFound.tsx"

/* The route table: every page the hub serves, built from the catalogue, so adding a
   project adds its product page, its changelog page, its sitemap row, its llms.txt line
   and its OG card with no other edit (AG6). */

export interface OgCard {
  eyebrow: string
  title: string[]
  titleAccent?: string
  line?: string
  accent?: string
  mark?: string
}

export interface Route {
  path: string
  title: string
  description: string
  card: OgCard
  /** Listed in the sitemap and llms.txt. The 404 page is a route and not a page to index. */
  index: boolean
  /** The section llms.txt files it under. */
  section: "Site" | "Product lines" | "Products" | "Changelog"
  render: () => ReactNode
}

const changelog = (scope: ChangelogScope) => () => <Changelog scope={scope} />

export const ROUTES: Route[] = [
  {
    path: "/",
    title: SITE.title,
    description: SITE.description,
    card: { eyebrow: "Alegauss", title: ["Software that shows you"], titleAccent: "what it's actually doing.", line: "Agent Workbench · Windows Native · Lab" },
    index: true,
    section: "Site",
    render: () => <Home />,
  },
  ...LINES.map<Route>((l) => ({
    path: linePath(l.id),
    title: `${l.name} — Alegauss`,
    description: `${l.promise} ${l.lead}`,
    card: { eyebrow: "Product line", title: [l.name], line: l.promise },
    index: true,
    section: "Product lines",
    render: () => <Line line={l} />,
  })),
  ...PROJECTS.map<Route>((p) => ({
    path: productPath(p),
    title: `${p.name} — ${p.kind} · Alegauss`,
    description: p.blurb,
    card: { eyebrow: p.kind, title: [p.name], line: p.blurb, accent: p.accent.bright, mark: p.mark },
    index: true,
    section: "Products",
    render: () => <Product project={p} />,
  })),
  {
    path: "/changelog/",
    title: "Changelog — every Alegauss product",
    description: "What every Alegauss product shipped, read from each product's roadkeep ledger at build time, newest first.",
    card: { eyebrow: "Changelog", title: ["What every product"], titleAccent: "shipped.", line: "Read from each product's own ledger." },
    index: true,
    section: "Changelog",
    render: changelog({ kind: "all" }),
  },
  ...LINES.map<Route>((l) => ({
    path: `/changelog/lines/${l.slug}/`,
    title: `${l.name} changelog — Alegauss`,
    description: `What the ${l.name} products shipped, read from their roadkeep ledgers, newest first.`,
    card: { eyebrow: "Changelog", title: [l.name], titleAccent: "shipped.", line: l.promise },
    index: true,
    section: "Changelog",
    render: changelog({ kind: "line", line: l }),
  })),
  ...PROJECTS.filter((p) => recordsOf(p).ledger.length).map<Route>((p) => ({
    path: `/changelog/${p.id}/`,
    title: `${p.name} changelog — Alegauss`,
    description: `Every entry in ${p.name}'s roadkeep ledger, dated by the commit that wrote it.`,
    card: { eyebrow: "Changelog", title: [p.name], titleAccent: "shipped.", accent: p.accent.bright, mark: p.mark },
    index: true,
    section: "Changelog",
    render: changelog({ kind: "product", project: p }),
  })),
  {
    path: "/method/",
    title: "The method — working with coding agents · Alegauss",
    description: "How the Agent Workbench tools add up to one way of working with coding agents, one step per tool, with figures from the Lab write-ups.",
    card: { eyebrow: "The method", title: ["Work with coding agents", "and keep the record"], titleAccent: "straight.", line: "One step per tool, figures from the Lab." },
    index: true,
    section: "Site",
    render: () => <Method />,
  },
  {
    path: "/plugins/",
    title: "Claude Code plugins — Alegauss",
    description: "Every Claude Code plugin from the Alegauss projects, installable from one marketplace with one command.",
    card: { eyebrow: "Claude Code plugins", title: ["Every plugin,"], titleAccent: "one command.", line: "One marketplace for the whole catalogue." },
    index: true,
    section: "Site",
    render: () => <Plugins />,
  },
  {
    path: "/404/",
    title: "Not found — Alegauss",
    description: "Nothing lives at this address.",
    card: { eyebrow: "Alegauss", title: ["Nothing lives"], titleAccent: "at this address." },
    index: false,
    section: "Site",
    render: () => <NotFound />,
  },
]

export const routeFor = (path: string): Route => {
  const clean = path.endsWith("/") ? path : `${path}/`
  return ROUTES.find((r) => r.path === clean) ?? ROUTES.find((r) => r.path === "/404/")!
}
