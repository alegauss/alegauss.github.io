import type { Project } from "../data/projects.ts"
import { developmentRelations } from "../data/relationships.ts"
import { productPath } from "../data/links.ts"

export function ProductRelations({ project }: { project: Project }) {
  const relations = developmentRelations(project.id)
  if (!relations.length) return null
  return (
    <details className="mb-10 border-y border-border py-3" data-development-evidence>
      <summary className="min-h-11 cursor-pointer py-3 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vg-brand)]">{relations.some((r) => r.type === "built-with") ? `How we build ${project.name}` : `Projects built with ${project.name}`}</summary>
      <div className="mt-4">
      <p className="mb-5 text-muted-foreground">These links describe <a className="underline underline-offset-2" href="/method/">how we build</a>. The applications run independently; users do not need these development tools.</p>
      {(["built-with", "used-to-build"] as const).map((type) => {
        const entries = relations.filter((relation) => relation.type === type)
        return entries.length ? <div key={type} className="mb-6">
          <h3 className="mb-3 text-lg font-bold">{type === "built-with" ? `How we build ${project.name}` : "Used to build"}</h3>
          <ul className="m-0 grid list-none gap-3 p-0">{entries.map((relation) => <li key={relation.related.id} className="hub-card text-sm">
            <a className="text-base font-bold underline underline-offset-2" href={productPath(relation.related)}>{relation.related.name}</a>
            <p className="m-0 text-muted-foreground">{relation.role}</p>
            <a className="underline underline-offset-2" href={relation.source}>{relation.basis} · reviewed {relation.reviewed}</a>
          </li>)}</ul>
        </div> : null
      })}
      </div>
    </details>
  )
}
