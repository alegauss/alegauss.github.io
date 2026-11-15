import type { Project } from "../data/projects.ts"
import { productPath } from "../data/links.ts"
import { ProjectTile, accentStyle } from "./ProjectTile.tsx"
import { AvailabilityBadge } from "./Availability.tsx"

/** A directory entry: the depth lives on the product page it links to. */
export function ProjectCard({ project, note }: { project: Project; note?: string }) {
  return (
    <article className="hub-card hub-accent" style={accentStyle(project)} data-catalogue-card={project.id} data-lines={project.lines.join(" ")} data-platforms={project.platforms.join(" ")} data-maturity={project.availability.state}>
      <div className="flex items-center gap-3">
        <ProjectTile project={project} />
        <div className="min-w-0">
          <div className="hub-kind">{project.kind}</div>
          <h3 className="m-0 text-lg font-extrabold tracking-tight">
            <a className="hub-stretch" href={productPath(project)}>
              {project.name}
            </a>
          </h3>
        </div>
      </div>
      <p className="m-0 text-[0.93rem] leading-relaxed text-muted-foreground">{project.blurb}</p>
      <AvailabilityBadge project={project} />
      <ul className="hub-meta m-0 list-none p-0">
        {project.tags.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-3 text-sm font-semibold">
        <span style={{ color: "var(--a-fg)" }}>Product page →</span>
        {note ? <span className="text-muted-foreground font-medium">{note}</span> : null}
      </div>
    </article>
  )
}
