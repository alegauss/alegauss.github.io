import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// The client build writes dist/ with the index.html template; `vite build --ssr`
// writes dist-server/, and scripts/prerender.mjs fills the template once per route.
// public/ carries every URL the old site answered that is not a page.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: { outDir: "dist", emptyOutDir: true },
})
