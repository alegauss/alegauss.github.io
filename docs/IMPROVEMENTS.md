# Improvements

## Block A — A catalogue crawlers can read

## Block B — Proof from the projects' own records

## Block C — A vendor's reach

### §AG12 A domain of its own

A CNAME on `alegauss.github.io` makes GitHub serve the project sites under the same
domain (`<domain>/<repo>/`) and redirect the old addresses. The cost is a Search Console
property, GA4 hostnames and visibility's `products.json` hosts updated in one move,
which is cheaper while the sites have little ranking to lose.

Choosing the domain is the owner's decision and comes first.

Done when every page answers on the new domain, every old github.io address redirects,
and visibility collects under the new hosts.

### §AG14 Site search on Turing

Once there are product, line, changelog and method pages, a visitor needs search. The
sponsor's product does that, and viglet.org already uses it on itself
(`src/lib/site-search.ts`, `@viglet/turing-sdk`).

The change is the same: index the built pages in a Turing site and search them from the
header. Anything Turing cannot do here is filed in Turing's roadmap, not worked around
on the hub.

Done when the header search returns product and changelog pages, and the page states
that search runs on Viglet Turing.

## Block D — Independent AI products, built with our own tools

### §AG23 Product relationships grounded in development use

Add explicit relationship data between products, with a type, short explanation and
evidence rather than automatically calling every product in a family related. On
Modelado and Revelei, show 'How we build' links to roadkeep, winwright and commitclerk
only where usage has been verified. On tool pages, show the corresponding 'Used to
build' projects, using the same relationship data so both directions stay consistent.

Label these as development relationships, not application dependencies, interoperability
or a requirement to install the development tools. Complementary recommendations may be
added only when their purpose is clear and must remain distinct from documented use.
Omit empty sections and invalid or self-referencing links.

Render relationships and evidence in the product HTML and Markdown twin, linking through
existing product URL helpers. Reuse the Method evidence and preserve product
independence.

### §AG24 Home page hierarchy for first-time visitors

Home.tsx currently places six raw shipped entries between the full catalogue and the
Method promotion. The Method already has a hero link, so the gap is prominence and
explanation rather than a missing route.

Reorder the home page around the revised positioning, the product families, concrete
application examples and a concise explanation that Alegauss builds with its own tools.
Give Modelado and Revelei visibility alongside the development tools without replacing
the configurable flagship mechanism or fabricating availability. Move detailed release
activity behind a compact recent-updates section and the existing full changelog link.

Retain changelog pages, Atom feeds and source attribution from AG8. The homepage should
help a visitor identify an application or development tool before reading internal task
sentences. Keep the HTML, Markdown twin and route/social descriptions consistent and
check mobile reading order.

### §AG25 Product landing pages that demonstrate what the application does

AG5 already delivered /products/<id>/ pages with pitches, links, install steps, JSON-LD
and links to each product's own site. ProjectTile and accentStyle already provide shared
styling with individual identities. Improve that foundation rather than commissioning
new sites or logos.

Review the product page template for audience, problem, concrete output, platform
requirements, documentation and the next action. For Modelado and Revelei, use authentic
before/after output or screenshots that explain the capability, with descriptive
captions and alt text; an OG image alone is not necessarily a useful demonstration. Use
existing product assets when suitable, and do not fabricate results or imply unfinished
features are available.

Keep the primary action consistent with maturity and confirmed installation or download
availability. Retain the hub-to-product-site boundary to avoid duplicating full
documentation. Generate equivalent useful text in Markdown and maintain the shared
design system, each product's own logo and accent, and stable subdirectory URLs.
