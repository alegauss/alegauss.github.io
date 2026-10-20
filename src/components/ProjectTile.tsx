import type { CSSProperties } from "react"
import type { Project } from "../data/projects.ts"
import { asset } from "../data/links.ts"

/** The per-project accent, set on the element that shows it and read by .hub-accent. */
export const accentStyle = (p: Project) => ({ "--a-rgb": p.accent.rgb }) as CSSProperties

export function ProjectTile({ project, large }: { project: Project; large?: boolean }) {
  return (
    <span className={`hub-tile${large ? " hub-tile-lg" : ""}`}>
      {project.logo ? (
        <img src={asset(project.logo)} alt="" width={large ? 64 : 44} height={large ? 64 : 44} loading="lazy" decoding="async" />
      ) : (
        // the catalogue's own inline marks, authored in projects.ts — not visitor content
        <span style={{ width: "100%", height: "100%" }} dangerouslySetInnerHTML={{ __html: project.mark ?? "" }} />
      )}
    </span>
  )
}
