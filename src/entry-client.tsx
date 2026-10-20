import "./main.css"
import { createRoot, hydrateRoot } from "react-dom/client"
import { ISLANDS } from "./islands.tsx"
import { ConsentBanner } from "./components/Consent.tsx"

for (const el of document.querySelectorAll<HTMLElement>("[data-island]")) {
  const C = ISLANDS[el.dataset.island!]
  if (C) hydrateRoot(el, <C {...JSON.parse(el.dataset.props || "{}")} />)
}

// the banner is not in the prerendered page at all, so it mounts rather than hydrates
const consent = document.createElement("div")
document.body.appendChild(consent)
createRoot(consent).render(<ConsentBanner />)
