import { PROJECTS } from "./projects.ts"
import { METHOD_USES } from "./method.ts"

/** One development relationship, projected from either endpoint without duplicating data. */
export function developmentRelations(id: string) {
  return METHOD_USES.filter((use) => use.application !== use.tool && use.source &&
    PROJECTS.some((p) => p.id === use.application) && PROJECTS.some((p) => p.id === use.tool) &&
    (use.application === id || use.tool === id))
    .map((use) => ({ ...use, type: use.application === id ? "built-with" as const : "used-to-build" as const, related: PROJECTS.find((p) => p.id === (use.application === id ? use.tool : use.application))! }))
}
