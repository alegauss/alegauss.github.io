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
