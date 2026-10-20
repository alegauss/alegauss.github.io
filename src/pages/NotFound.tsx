import { SiteButton, SiteHero } from "@viglet/viglet-design-system/site"

export function NotFound() {
  return (
    <SiteHero
      title="Nothing lives"
      titleAccent="at this address."
      sub="The page may have moved when the hub grew product pages. Every product is one click from the home page."
      actions={<SiteButton href="/">Go to the home page</SiteButton>}
    />
  )
}
