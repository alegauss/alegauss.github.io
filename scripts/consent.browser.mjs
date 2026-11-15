// Run after build:site: npm run test:browser. Uses an isolated browser and a stubbed GA script.
// Install Chromium once with: npx playwright install chromium
import { test } from "node:test"
import assert from "node:assert/strict"
import { createServer } from "node:http"
import { readFile } from "node:fs/promises"
import { resolve, extname, sep } from "node:path"
import { chromium } from "playwright"

const root = resolve("dist")
const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".woff2": "font/woff2" }

test("AG1, AG30, AG33: consent on the built site", async (t) => {
  await readFile(resolve(root, "index.html"))
  const server = createServer(async (req, res) => {
    try {
      let path = new URL(req.url, "http://localhost").pathname
      if (path.endsWith("/")) path += "index.html"
      const file = resolve(root, `.${decodeURIComponent(path)}`)
      if (!file.startsWith(root + sep)) throw new Error("outside preview")
      const bytes = await readFile(file)
      res.writeHead(200, { "content-type": mime[extname(file)] ?? "application/octet-stream" })
      res.end(bytes)
    } catch { res.writeHead(404); res.end() }
  })
  await new Promise((done) => server.listen(0, "127.0.0.1", done))
  let browser
  t.after(async () => {
    await browser?.close()
    server.closeAllConnections()
    await new Promise((done) => server.close(done))
  })
  const origin = `http://127.0.0.1:${server.address().port}`
  browser = await chromium.launch({ headless: true })

  await t.test("the latest grant overrides revocation without loading a second script", async () => {
    const page = await browser.newPage()
    const requests = []
    page.on("request", (request) => { if (request.url().includes("googletagmanager.com")) requests.push(request.url()) })
    await page.route("https://www.googletagmanager.com/**", (route) => route.fulfill({ status: 200, contentType: "text/javascript", body: "" }))
    await page.goto(origin)
    const notice = page.getByRole("region", { name: "Analytics consent" })
    await notice.waitFor()
    assert.equal(requests.length, 0)
    await notice.getByRole("button", { name: "Decline", exact: true }).focus()
    await page.keyboard.press("Enter")
    assert.equal(await page.evaluate(() => localStorage.getItem("alegauss-consent")), "denied")
    await page.reload()
    await page.locator("[data-catalogue-controls]").waitFor({ state: "visible" })
    assert.equal(await notice.count(), 0)
    assert.equal(requests.length, 0)

    const settings = page.getByRole("button", { name: "Analytics settings", exact: true })
    await settings.click()
    const firstScript = page.waitForRequest((request) => request.url().includes("googletagmanager.com"))
    await notice.getByRole("button", { name: "Allow analytics", exact: true }).click()
    const script = await firstScript
    const measurement = new URL(script.url()).searchParams.get("id")
    assert.ok(measurement)
    assert.equal(requests.length, 1)
    await settings.click()
    await notice.getByRole("button", { name: "Decline", exact: true }).click()
    assert.equal(await page.evaluate((id) => window[`ga-disable-${id}`], measurement), true)
    await settings.click()
    await notice.getByRole("button", { name: "Allow analytics", exact: true }).click()
    assert.equal(await page.evaluate(() => localStorage.getItem("alegauss-consent")), "granted")
    assert.equal(await page.evaluate((id) => window[`ga-disable-${id}`], measurement), false)
    assert.equal(await page.locator('script[src*="googletagmanager.com"]').count(), 1)
    assert.equal(requests.length, 1)
    await settings.click()
    await notice.getByRole("button", { name: "Decline", exact: true }).click()
    await page.reload()
    await page.locator("[data-catalogue-controls]").waitFor({ state: "visible" })
    assert.equal(requests.length, 1)
    assert.equal(await page.locator('script[src*="googletagmanager.com"]').count(), 0)
    await page.close()
  })

  await t.test("mobile choices stay equal, compact and usable at 200 percent text size", async () => {
    for (const width of [320, 360, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 844 } })
      await page.goto(origin)
      const notice = page.getByRole("region", { name: "Analytics consent" })
      await notice.waitFor()
      if (width > 320) assert.ok((await notice.boundingBox()).height < 189.3125)
      const buttons = notice.getByRole("button")
      const styles = await buttons.evaluateAll((items) => items.map((button) => ({ background: getComputedStyle(button).backgroundColor, color: getComputedStyle(button).color })))
      assert.deepEqual(styles[0], styles[1])
      await page.addStyleTag({ content: "html { font-size: 200% }" })
      assert.equal(await notice.evaluate((element) => element.scrollWidth <= element.clientWidth), true)
      for (const button of await buttons.all()) assert.ok((await button.boundingBox()).height >= 44)
      await page.close()
    }
  })
})
