import type { Project } from "../data/projects.ts"
import { DEMONSTRATIONS } from "../data/demonstrations.ts"

export function ProductDemonstration({ project }: { project: Project }) {
  const demo = DEMONSTRATIONS[project.id]
  if (!demo) return null
  return (
    <section className="min-w-0" aria-labelledby="product-demonstration" data-product-demo>
      <h2 id="product-demonstration" className="mb-4 text-2xl font-bold">{demo.title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {demo.images.map((image) => <figure key={image.src} className="m-0 min-w-0">
          <img className="w-full rounded-[var(--vg-radius-panel)] border border-border bg-card object-contain" style={{ aspectRatio: `${image.width} / ${image.height}` }} src={image.src} alt={image.alt} width={image.width} height={image.height} decoding="async" />
          <figcaption className="mt-2 text-sm font-semibold">{image.label}</figcaption>
        </figure>)}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{demo.caption}</p>
      <p className="m-0 text-xs leading-relaxed text-muted-foreground">
        <a className="underline underline-offset-2" href={demo.creditUrl}>{demo.credit}</a>{" "}
        <a className="underline underline-offset-2" href={demo.source}>Example provenance</a>. <a className="underline underline-offset-2" href="/demos/SOURCES.md">Credits and licences</a>.
      </p>
    </section>
  )
}
