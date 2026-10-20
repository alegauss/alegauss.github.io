import { LINES, type Line } from "../data/lines.ts"
import { PROJECTS, type Project } from "../data/projects.ts"
import { productPath } from "../data/links.ts"
import { fileUrl, recordsOf, shipsOf } from "../data/records.ts"
import { ShipList } from "../components/ShipList.tsx"

/** The cross-product feed shows this many; a product's own page shows its whole ledger. */
export const CHANGELOG_LATEST = 150

export type ChangelogScope = { kind: "all" } | { kind: "line"; line: Line } | { kind: "product"; project: Project }

export function changelogShips(scope: ChangelogScope) {
  if (scope.kind === "product") return shipsOf([scope.project])
  const projects = scope.kind === "line" ? PROJECTS.filter((p) => p.lines.includes(scope.line.id)) : PROJECTS
  return shipsOf(projects).slice(0, CHANGELOG_LATEST)
}

export function Changelog({ scope }: { scope: ChangelogScope }) {
  const ships = changelogShips(scope)
  const heading =
    scope.kind === "product" ? `What ${scope.project.name} shipped.` : scope.kind === "line" ? `What ${scope.line.name} shipped.` : "What every product shipped."

  return (
    <>
      <header className="vg-site-wrap flex flex-wrap items-end justify-between gap-5 pt-16! pb-8!">
        <div className="min-w-0 flex-[1_1_520px]">
          <div className="vg-site-eyebrow">Changelog</div>
          <h1 className="m-0 mb-3 text-5xl font-black tracking-tight">{heading}</h1>
          <p className="m-0 max-w-[62ch] text-lg leading-relaxed text-muted-foreground">
            {scope.kind === "product" ? (
              <>
                Every entry in{" "}
                <a className="underline underline-offset-2" href={fileUrl(scope.project, recordsOf(scope.project).ledgerFile)}>
                  {recordsOf(scope.project).ledgerFile}
                </a>
                , read at <code className="font-mono">{recordsOf(scope.project).sha.slice(0, 7)}</code> and dated by the commit that wrote it.
              </>
            ) : (
              <>
                The latest {CHANGELOG_LATEST} entries, read at build time from each product's roadkeep ledger in its public
                repository and dated by the commit that wrote them. Newest first.
              </>
            )}
          </p>
        </div>
        <a className="vg-site-btn vg-site-btn-ghost" href="/changelog/feed.xml">
          Atom feed
        </a>
      </header>

      <nav aria-label="Filter the changelog" className="vg-site-wrap flex flex-col gap-3 border-b border-border pb-6!">
        <div className="flex flex-wrap gap-2">
          <a className="hub-chip" href="/changelog/" aria-current={scope.kind === "all" ? "page" : undefined}>
            All lines
          </a>
          {LINES.map((l) => (
            <a key={l.id} className="hub-chip" href={`/changelog/lines/${l.slug}/`} aria-current={scope.kind === "line" && scope.line.id === l.id ? "page" : undefined}>
              {l.name}
            </a>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {PROJECTS.filter((p) => recordsOf(p).ledger.length).map((p) => (
            <a key={p.id} className="hub-chip" href={`/changelog/${p.id}/`} aria-current={scope.kind === "product" && scope.project.id === p.id ? "page" : undefined}>
              {p.name}
            </a>
          ))}
        </div>
      </nav>

      <section className="vg-site-wrap pb-16!">
        {ships.length ? (
          <ShipList ships={ships} showProduct={scope.kind !== "product"} />
        ) : (
          <p className="py-6 text-muted-foreground">Nothing has shipped through this ledger yet.</p>
        )}
        {scope.kind === "product" ? (
          <p className="mt-6">
            <a className="font-semibold underline underline-offset-2" href={productPath(scope.project)}>
              ← {scope.project.name}'s product page
            </a>
          </p>
        ) : null}
      </section>
    </>
  )
}
