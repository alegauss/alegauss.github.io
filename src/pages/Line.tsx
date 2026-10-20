import { SiteButton } from "@viglet/viglet-design-system/site"
import { LINES, type Line as LineT } from "../data/lines.ts"
import { PROJECTS } from "../data/projects.ts"
import { linePath } from "../data/links.ts"
import { shipsOf } from "../data/records.ts"
import { ProjectCard } from "../components/ProjectCard.tsx"
import { ShipList } from "../components/ShipList.tsx"

export function Line({ line }: { line: LineT }) {
  const projects = PROJECTS.filter((p) => p.lines.includes(line.id))
  return (
    <>
      <header className="vg-site-wrap pt-16! pb-10!">
        <nav aria-label="Product lines" className="mb-6 flex flex-wrap gap-2">
          {LINES.map((l) => (
            <a key={l.id} className="hub-chip" href={linePath(l.id)} aria-current={l.id === line.id ? "page" : undefined}>
              {l.name}
            </a>
          ))}
        </nav>
        <h1 className="m-0 mb-4 text-5xl font-black tracking-tight">{line.name}</h1>
        <p className="m-0 mb-2 text-xl font-semibold">{line.promise}</p>
        <p className="m-0 max-w-[64ch] text-lg leading-relaxed text-muted-foreground">{line.lead}</p>
        {line.id === "workbench" ? (
          <div className="mt-6">
            <SiteButton href="/method/">See how these tools add up to one way of working</SiteButton>
          </div>
        ) : null}
      </header>
      <section className="vg-site-wrap pb-14!">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(330px,100%),1fr))] gap-4">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>
      <section className="vg-site-wrap pb-16!">
        <div className="hub-band">
          <h2>Recently shipped in {line.name}</h2>
          <span>
            <a className="font-semibold text-foreground hover:underline" href={`/changelog/lines/${line.slug}/`}>
              The line's changelog →
            </a>
          </span>
        </div>
        <ShipList ships={shipsOf(projects).slice(0, 6)} />
      </section>
    </>
  )
}
