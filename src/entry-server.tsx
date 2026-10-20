import { renderToString } from "react-dom/server"
import { Layout } from "./components/Layout.tsx"
import { ROUTES, routeFor } from "./routes.tsx"
import { absolute } from "./data/links.ts"

export { ROUTES } from "./routes.tsx"
export { twin, llmsTxt } from "./twin.ts"
export { PROJECTS } from "./data/projects.ts"
export { SITE } from "./data/site.ts"
export { shipsOf, shipTitle, shipBody, commitUrl } from "./data/records.ts"
export { productPath, productSite } from "./data/links.ts"

export const render = (path: string) => renderToString(<Layout>{routeFor(path).render()}</Layout>)
export const canonicalUrl = (path: string) => absolute(path)
export const outputDir = (path: string) => path.replace(/^\/|\/$/g, "")
export const ROUTE_META = ROUTES.map(({ path, title, description }) => ({ path, title, description }))
