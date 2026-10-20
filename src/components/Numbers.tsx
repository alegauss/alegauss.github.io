import type { ProductNumbers } from "../data/records.ts"

const fmt = (n: number) => n.toLocaleString("en-US")

/** The public numbers as stats (AG10). A number the build could not read is absent, not zero. */
type NumberItem = { label: string; value: string; note?: string; href?: string; download?: true }

export function numberItems(n: ProductNumbers): NumberItem[] {
  const items: NumberItem[] = []
  if (n.stars !== undefined) items.push({ label: "GitHub stars", value: fmt(n.stars) })
  if (n.release) {
    items.push({ label: "Latest release", value: n.release.tag, note: n.release.date ? `released ${n.release.date}` : undefined, href: n.release.url })
    if (n.release.downloads !== undefined) items.push({ label: "Release downloads", value: fmt(n.release.downloads), note: n.release.tag, download: true })
  }
  if (n.pypiLastMonth !== undefined) items.push({ label: "PyPI downloads", value: fmt(n.pypiLastMonth), note: "last 30 days", download: true })
  return items
}

/** The "as of" date belongs to a download count; a release tag alone carries its own date. */
const dated = (items: NumberItem[]) => items.some((i) => i.download)

export function NumberLine({ numbers, asOf, tags }: { numbers: ProductNumbers; asOf: string; tags: string[] }) {
  const items = numberItems(numbers)
  return (
    <ul className="hub-meta m-0 list-none p-0">
      {tags.map((t) => (
        <li key={t}>{t}</li>
      ))}
      {items.map((i) => (
        <li key={i.label}>
          {i.value} {i.label.toLowerCase()}
        </li>
      ))}
      {dated(items) ? <li>as of {asOf}</li> : null}
    </ul>
  )
}

export function NumberStats({ numbers, asOf }: { numbers: ProductNumbers; asOf: string }) {
  const items = numberItems(numbers)
  if (!items.length) return null
  return (
    <section className="mb-14" aria-labelledby="numbers">
      <h2 id="numbers" className="sr-only">
        Public numbers
      </h2>
      <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-3">
        {items.map((i) => (
          <div key={i.label} className="hub-stat">
            <dt>{i.label}</dt>
            <dd>{i.href ? <a href={i.href}>{i.value}</a> : i.value}</dd>
            {i.note ? <div className="text-xs text-muted-foreground">{i.note}</div> : null}
          </div>
        ))}
      </dl>
      {dated(items) ? (
        <p className="m-0 mt-3 text-xs text-muted-foreground">Public numbers from GitHub and PyPI, as of {asOf}. The site is rebuilt daily.</p>
      ) : null}
    </section>
  )
}
