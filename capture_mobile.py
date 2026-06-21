from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=True,
        executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    )
    context = browser.new_context(
        viewport={"width": 390, "height": 844},
        device_scale_factor=2,
        is_mobile=True,
        has_touch=True,
        user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
    )
    page = context.new_page()
    page.goto("http://localhost:3000", wait_until="networkidle")
    page.screenshot(
        path="/Users/connor/Dev/fairlend-cms/artifacts/mobile-parity-check.png",
        full_page=True,
    )
    dims = page.evaluate(
        "() => ({ width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight })"
    )
    print("captured", dims)
    browser.close()
