import { commitUrl, shipBody, shipTitle, type DatedShip } from "../data/records.ts"
import { productPath } from "../data/links.ts"
import { Inline } from "./Inline.tsx"
import { accentStyle } from "./ProjectTile.tsx"

/** Ledger entries as the changelog, the home page and a product page show them. */
export function ShipList({ ships, showProduct = true }: { ships: DatedShip[]; showProduct?: boolean }) {
  return (
    <ol className="m-0 list-none p-0">
      {ships.map((s) => (
        <li key={`${s.project.id}:${s.id}`} className="hub-entry flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-border py-4">
          <time className="w-24 flex-none font-mono text-xs text-muted-foreground" dateTime={s.date ?? undefined}>
            {s.date ?? "undated"}
          </time>
          {showProduct ? (
            <a className="hub-chip hub-accent" style={accentStyle(s.project)} href={productPath(s.project)}>
              {s.project.name}
            </a>
          ) : null}
          <div className="min-w-0 flex-[1_1_360px]">
            <div className="font-semibold">
              <Inline text={shipTitle(s)} />
            </div>
            {shipBody(s) ? (
              <p className="m-0 mt-1 text-sm leading-relaxed text-muted-foreground">
                <Inline text={shipBody(s)} />
              </p>
            ) : null}
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            {s.id}
            {s.commit ? (
              <>
                {" · "}
                <a className="underline underline-offset-2 hover:text-foreground" href={commitUrl(s.project, s.commit)}>
                  {s.commit.slice(0, 7)}
                </a>
              </>
            ) : null}
          </span>
        </li>
      ))}
    </ol>
  )
}
