import { test } from "node:test"
import assert from "node:assert/strict"
import { matchesCatalogue } from "../src/data/catalogue.ts"

const app = { lines: ["applications"], platforms: ["windows"], maturity: "available" }
const tool = { lines: ["workbench", "utilities"], platforms: ["windows", "macos", "linux"], maturity: "beta" }
const all = { purpose: "", platform: "", maturity: "" }
test("AG20: unfiltered catalogue and clearing expose every entry", () => {
  for (const entry of [app, tool]) assert.equal(matchesCatalogue(entry, all), true)
})
test("AG20: filters combine across dimensions, including multiple memberships", () => {
  assert.equal(matchesCatalogue(app, { purpose: "applications", platform: "windows", maturity: "available" }), true)
  assert.equal(matchesCatalogue(app, { ...all, platform: "macos" }), false)
  assert.equal(matchesCatalogue(app, { ...all, maturity: "beta" }), false)
  assert.equal(matchesCatalogue(tool, { purpose: "utilities", platform: "linux", maturity: "beta" }), true)
  assert.equal(matchesCatalogue(tool, { purpose: "applications", platform: "linux", maturity: "beta" }), false)
})
