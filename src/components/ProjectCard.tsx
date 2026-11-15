import type { Project } from "../data/projects.ts"
import { productPath } from "../data/links.ts"
import { ProjectTile, accentStyle } from "./ProjectTile.tsx"
import { AvailabilityBadge } from "./Availability.tsx"
import { lineById } from "../data/lines.ts"
import { PLATFORMS } from "../data/catalogue.ts"

/** A directory entry: the depth lives on the product page it links to. */
export function ProjectCard({ project, note }: { project: Project; note?: string }) {
  return (
    <article className="hub-accent flex min-w-0 items-start gap-3 border-b border-border py-5 text-sm [&_.hub-tile]:size-9" style={accentStyle(project)} data-catalogue-card={project.id} data-lines={project.lines.join(" ")} data-platforms={project.platforms.join(" ")} data-maturity={project.availability.state}>
      <div className="pt-1">
        <ProjectTile project={project} />
      </div>
      <div className="min-w-0 flex-1">
          <h4 className="m-0 text-lg font-bold tracking-tight">
            <a className="inline-flex min-h-11 items-center gap-2 underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vg-brand)]" href={productPath(project)}>
              {project.name}<span aria-hidden="true" className="font-normal text-muted-foreground">&rarr;</span>
            </a>
          </h4>
      <p className="m-0 mb-3 leading-relaxed text-muted-foreground">{project.blurb}</p>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <AvailabilityBadge project={project} />
        <ul aria-label="Platforms" className="hub-meta m-0 list-none p-0">
        {project.platforms.map((id) => (
          <li key={id}>{PLATFORMS[id]}</li>
        ))}
        </ul>
      </div>
      <p className="mb-0 mt-2 text-xs text-muted-foreground">{project.lines.map((id) => lineById(id).name).join(" · ")}</p>
      {note ? <p className="mb-0 mt-2 text-muted-foreground">{note}</p> : null}
      </div>
    </article>
  )
}
