import { useEffect, useState } from "react"
import { matchesCatalogue, type CatalogueSelection } from "../data/catalogue.ts"

type Option = { id: string; name: string }
const empty: CatalogueSelection = { purpose: "", platform: "", maturity: "" }

/** Enhance the existing HTML cards; project content never crosses the island boundary. */
export function CatalogueFilters({ options, total }: { options: string; total: string }) {
  const choices = JSON.parse(options) as Record<keyof CatalogueSelection, Option[]>
  const [ready, setReady] = useState(false)
  const [selection, setSelection] = useState(empty)
  const [count, setCount] = useState(Number(total))
  useEffect(() => { setReady(true) }, [])
  useEffect(() => {
    const root = document.getElementById("products")
    if (!root) return
    let visible = 0
    for (const card of root.querySelectorAll<HTMLElement>("[data-catalogue-card]")) {
      const show = matchesCatalogue({ lines: card.dataset.lines!.split(" "), platforms: card.dataset.platforms!.split(" "), maturity: card.dataset.maturity! }, selection)
      card.hidden = !show
      if (show) visible++
    }
    for (const group of root.querySelectorAll<HTMLElement>("[data-catalogue-group]")) {
      group.hidden = !group.querySelector("[data-catalogue-card]:not([hidden])")
    }
    setCount(visible)
  }, [selection])

  return (
    <div hidden={!ready} className="mb-6" data-catalogue-controls>
      <fieldset className="m-0 mb-3 grid gap-3 border-0 p-0 sm:grid-cols-3">
        <legend className="mb-3 font-semibold">Find a product</legend>
        {(["purpose", "platform", "maturity"] as const).map((key) => (
          <div key={key} className="flex min-w-0 flex-col gap-2 text-sm font-semibold">
            <label htmlFor={`catalogue-${key}`}>{{ purpose: "Purpose", platform: "Operating system", maturity: "Maturity" }[key]}</label>
            <select id={`catalogue-${key}`} className="w-full rounded-[var(--vg-radius-control)] border border-border bg-card p-3 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vg-brand)]" value={selection[key]} onChange={(e) => setSelection((current) => ({ ...current, [key]: e.target.value }))}>
              <option value="">All</option>
              {choices[key].map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
            </select>
          </div>
        ))}
      </fieldset>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p role="status" aria-live="polite" aria-atomic="true" className="m-0 text-sm text-muted-foreground">{count} {count === 1 ? "product" : "products"} found.{count === 0 ? " Try another combination or clear the filters." : ""}</p>
        <button type="button" className="vg-site-btn vg-site-btn-ghost" onClick={() => setSelection({ ...empty })}>Clear filters</button>
      </div>
    </div>
  )
}
