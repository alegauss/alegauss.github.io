/* The plugin marketplace (AG13). The manifest Claude Code reads is the one this
   page is built from, so the two cannot list different plugins. */

import manifest from "../../.claude-plugin/marketplace.json"
import { SITE } from "./site.ts"

export interface MarketplacePlugin {
  name: string
  description: string
  category?: string
  homepage?: string
}

export const MARKETPLACE = manifest as { name: string; description: string; plugins: MarketplacePlugin[] }

export const marketplaceAdd = `/plugin marketplace add ${SITE.marketplace.repo}`
export const pluginInstall = (name: string) => `/plugin install ${name}@${MARKETPLACE.name}`
export const pluginFor = (projectId: string) => MARKETPLACE.plugins.find((p) => p.name === projectId)
