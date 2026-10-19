# Roadmap (active backlog)

## Block A — A catalogue crawlers can read

- 📋 **AG1** (deps: —) **Google Analytics loads on every page without consent while the hero badge says no tracking** — Commit 0fc6105 made the badge false, and viglet.org already loads the same tag only after the visitor consents. → §AG1
- 📋 **AG2** (deps: viglet-design-system: VDS213, viglet-design-system: VDS214, viglet-design-system: VDS215) **The hub is one inline-styled page, off the stack and design system its product sites share** — Every component is redrawn by hand here, and a second page means copying the whole stylesheet again. → §AG2
- 📋 **AG3** (deps: AG2) **The project grid and footer are built by JavaScript, so crawlers and LLMs read an empty catalogue** — sponsor.json already keeps the sponsor static for this reason, and visibility flags product pages Google has not indexed. → §AG3
- 📋 **AG4** (deps: AG3) **Projects are grouped by format, which says nothing about whom each one is for** — The tools form two product lines and a lab, and visibility makes claude-tray the flagship until December 2026. → §AG4
- 📋 **AG5** (deps: AG3) **No page on the hub describes a single product, so each one exists only as a card** — A visitor comparing tools needs one address per product, and a search engine needs a page to rank. → §AG5
- 📋 **AG6** (deps: AG5) **The sitemap is written by hand and there is no llms.txt, so new pages wait to be found** — viglet.org generates both from its data, and a hand-kept sitemap misses every page added after it was written. → §AG6
- 📋 **AG7** (deps: viglet-design-system: VDS214, viglet-design-system: VDS216) **sync-sponsor.mjs writes markup into every site, and each one styles the sponsor block again** — The sponsor is the one block every site already shares, and today it shares only its HTML. → §AG7

## Block B — Proof from the projects' own records

- 📋 **AG8** (deps: AG2) **Nothing shows what the projects shipped, though each one keeps a roadkeep changelog** — A vendor's activity is its best evidence, and the ledgers already exist in a shape a build can read. → §AG8
- 📋 **AG9** (deps: AG5) **A product page cannot say what comes next, though each roadmap already holds it** — A public roadmap is rare among vendors and fits the claim that the software shows its work. → §AG9
- 📋 **AG10** (deps: AG5) **Product pages show no public numbers: stars, latest release, downloads** — The numbers are public and visibility already collects them, but the site never shows one. → §AG10
- 📋 **AG11** (deps: AG4) **No page explains the method the Agent Workbench tools add up to** — Each tool is easier to adopt once the workflow it belongs to is visible, and the Lab already holds the evidence. → §AG11

## Block C — A vendor's reach

- 📋 **AG12** (deps: AG6) **The hub and every product site live under github.io instead of a domain of their own** — A custom domain on the user site moves every project site with it, and the move costs less before rankings accrue. → §AG12
- 📋 **AG13** (deps: AG5) **Claude Code plugins are installed one repository at a time, with no place listing them** — roadkeep, polyweave and Piano already ship as plugins, and one marketplace makes them a catalogue. → §AG13
- 📋 **AG14** (deps: AG2) **The site has no search, and the sponsor's search product is not shown working** — viglet.org searches itself with @viglet/turing-sdk, which is also a working demo of the sponsor's product. → §AG14

## Non-goals
