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

## Block E — Visual hierarchy and first-visit confidence

### §AG27 A visual showcase that represents the AI focus

AG24 already moved application examples and The Method before the catalogue. AG25
supplied authentic photo-to-mesh and denoising demonstrations on the individual product
pages. Do not recreate those tasks: the remaining gap is that the first product panel
still leads with Claude Code Tray, while the homepage's application examples show icons
and text rather than results.

Use the existing demonstration data and reviewed assets to bring a compact, meaningful
AI result close to the hero. Represent Modelado and Revelei alongside the agent
development tools, with a clear editorial hierarchy and direct links to the relevant
product pages. Keep SITE.flagship configurable; avoid replacing it with hardcoded
assumptions about the first project in an array. The layout may balance or reposition
its panel without changing which product the field names.

Reuse the existing source credits and alternative text, adapting captions to the smaller
context without changing what the examples prove. No fabricated app screenshots,
performance claims or client testimonials. Preserve distinct product identities and
shared design tokens.

Check loading cost, reserved image dimensions, narrow-screen reading order and
light/dark themes. Keep full catalogue entries unique and the text-only page
understandable.

### §AG28 Distinct treatment for highlights and the complete catalogue

AG21 already removed implementation-heavy tags from cards, and AG19 groups entries by
availability. Keep those gains. This task concerns visual hierarchy and repetition, not
another metadata or taxonomy rewrite.

Differentiate the small editorial showcase from the complete product directory through
scale, spacing, image use and information density within the established design system.
Make the full catalogue more compact to scan while keeping name, concrete outcome,
purpose, platform, maturity and product link understandable. Review whether every
repeated card needs the same border, padding and metadata prominence. Preserve product
logos and accent colours; do not invent an unrelated visual style for each item.

Retain the filters and their counts, empty state, reset and keyboard behaviour from
AG20. All products must still appear once in the prerendered main catalogue with
JavaScript disabled; highlighting a product elsewhere must not create a second
filterable entry. Maintain meaningful availability group headings and the existing
product URLs.

Compare before/after desktop and mobile captures, including long product names and both
themes. Use existing data and shared components rather than maintaining a separate list
of catalogue content.

### §AG29 Evidence available at the right reading level

AG19, AG22, AG23 and AG25 added reviewed availability, documented development
relationships and authentic examples. These facts are credibility assets; this task
changes their visual presentation without weakening or deleting them.

On Product.tsx, Availability.tsx, ProductRelations.tsx and the relevant Method sections,
establish a clear reading order: benefit and outcome, authentic example, appropriate
next action, then supporting evidence. Consolidate repeated review dates and source
labels where that helps scanning. Consider native details/summary or another accessible
secondary treatment for lengthy provenance and build-method explanations. Keep labels
such as repository evidence and owner-confirmed practice attached to the claims they
qualify, including inside any disclosure.

Do not hide information needed to decide whether to install, such as maturity, essential
platform requirements, relevant warnings or licence restrictions. Preserve sources,
dates, photo credits and image provenance. Expanded evidence must remain reachable by
keyboard, usable without JavaScript and present in the prerendered HTML and Markdown
twin.

Verify default and expanded presentations on mobile and desktop, including focus,
heading structure and both colour themes. Preserve product links and avoid presenting
development tools as runtime requirements.

### §AG30 Compact mobile analytics consent

The mobile capture in this conversation showed the consent panel covering a substantial
portion of the product-discovery screen. Consent.tsx currently combines the analytics
choice with a separate claim about product telemetry and uses the standard large button
treatment. AG1 already prevents Google Analytics from loading before consent; preserve
that behaviour.

Keep the initial notice focused on the actual decision: optional Google Analytics is off
until allowed. Move supplementary explanation to an accessible details treatment or the
existing settings path when useful. Reduce padding and excess text on narrow screens
while keeping decline and allow choices equally legible and easy to reach. Do not reduce
text to an unreadable size, favour acceptance through visual hierarchy, auto-dismiss the
panel or load tracking before a decision.

Preserve the stored preference, the footer's Analytics settings entry point and the
ability to change the choice. Reuse design-system tokens and shared button conventions
where compatible with a compact layout.

Compare banner height at the same 360- and 390-pixel widths before and after. Verify
320-pixel width, text zoom and keyboard access without clipping or horizontal overflow.
Keep touch targets at least 44 CSS pixels, and confirm no analytics request before
consent or after a stored refusal.
