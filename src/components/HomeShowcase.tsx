import { DEMONSTRATIONS } from "../data/demonstrations.ts"
import { projectById } from "../data/projects.ts"
import { productPath } from "../data/links.ts"
import { AvailabilityBadge } from "./Availability.tsx"
import { accentStyle } from "./ProjectTile.tsx"

export const SHOWCASE_IDS = ["modelado", "revelei"] as const

/** The reviewed product examples, introduced before the developer-tool flagship. */
export function HomeShowcase() {
  return (
    <section id="ai-examples" aria-labelledby="showcase-title" className="vg-site-wrap mt-10 text-left" data-home-showcase>
      <h2 id="showcase-title" className="mb-5 text-xl font-bold">AI on your own PC. See the results.</h2>
      <div className="grid gap-5 md:grid-cols-2">
        {SHOWCASE_IDS.map((id) => {
          const p = projectById(id)
          const demo = DEMONSTRATIONS[id]
          return <article key={id} className="hub-accent min-w-0 rounded-[var(--vg-radius-panel)] border border-border bg-card p-5" style={accentStyle(p)} data-showcase-product={id}>
            <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
              <div><h3 className="m-0 text-2xl font-extrabold"><a href={productPath(p)}>{p.name}</a></h3><p className="m-0 mt-1 text-sm text-muted-foreground">{demo.title}</p></div>
              <AvailabilityBadge project={p} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {demo.images.map((image) => <figure key={image.src} className="m-0 min-w-0">
                <img className="h-40 w-full rounded-[var(--vg-radius-control)] bg-muted object-contain sm:h-48" src={image.src} alt={image.alt} width={image.width} height={image.height} decoding="async" />
                <figcaption className="mt-2 text-xs font-semibold">{image.label}</figcaption>
              </figure>)}
            </div>
            <div className="mt-4 flex flex-wrap items-baseline justify-between gap-3 text-sm">
              <a className="font-bold underline-offset-2 hover:underline" href={productPath(p)}>Explore {p.name} &rarr;</a>
              <a className="text-xs text-muted-foreground underline underline-offset-2" href={demo.source}>Example provenance</a>
            </div>
            <p className="mb-0 mt-2 text-xs leading-relaxed text-muted-foreground"><a className="underline underline-offset-2" href={demo.creditUrl}>{demo.credit}</a></p>
          </article>
        })}
      </div>
    </section>
  )
}
