import type { Project } from "../data/projects.ts"
import { ProjectCard } from "./ProjectCard.tsx"

const GROUPS = [
  { title: "Available to use", states: ["available"] },
  { title: "Previews and experiments", states: ["beta", "development", "experimental"] },
  { title: "Published research", states: ["published"] },
]

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return <>{GROUPS.map((group) => {
    const entries = projects.filter((p) => group.states.includes(p.availability.state))
    return entries.length ? (
      <section key={group.title} data-catalogue-group className="mb-8">
        <h3 className="mb-4 text-lg font-bold">{group.title}</h3>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(330px,100%),1fr))] gap-4">
          {entries.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      </section>
    ) : null
  })}</>
}
