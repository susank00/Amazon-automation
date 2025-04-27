const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");

(async function amazonTest() {
  let options = new chrome.Options();
  options.addArguments(
    "--disable-blink-features=AutomationControlled",
    "--start-maximized",
    "--disable-infobars",
    "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
    "--disable-dev-shm-usage"
  );

  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    // Open Amazon
    await driver.get("https://www.amazon.com");
    await driver.sleep(Math.random() * 1000 + 1000);

    // Check for CAPTCHA
    try {
      let captcha = await driver.findElement(By.css("div#captchacharacters"));
      if (captcha) {
        console.log("CAPTCHA detected! Please solve manually.");
        await driver.sleep(40000); // Wait for manual solving
      }
    } catch (err) {
      console.log("No CAPTCHA detected, proceeding...");
    }

    // Update Delivery Location
    try {
      let locationLink = await driver.wait(
        until.elementLocated(By.id("nav-global-location-popover-link")),
        10000,
        "Delivery location link not found within 10 seconds"
      );
      await locationLink.click();
      console.log("✅ Clicked delivery location link");

      let zipInput = await driver.wait(
        until.elementLocated(By.id("GLUXZipUpdateInput")),
        10000,
        "ZIP code input field not found within 10 seconds"
      );
      await zipInput.clear();
      await zipInput.sendKeys("36925");
      console.log("✅ Entered ZIP code: 36925");

      let applyButton = await driver.wait(
        until.elementLocated(By.id("GLUXZipUpdate")),
        10000,
        "Apply button not found within 10 seconds"
      );
      await applyButton.click();
      console.log("✅ Clicked Apply button");

      let doneButton = await driver.wait(
        until.elementLocated(By.className("a-button-close a-declarative")),
        10000,
        "Done button not found within 10 seconds"
      );
      await doneButton.click();
      console.log("✅ Clicked Done button");
    } catch (err) {
      console.error("Error updating delivery location:", err);
    }

    // Simulate scrolling
    await driver.executeScript("window.scrollBy(0, 500);");
    await driver.sleep(Math.random() * 500 + 500);

    // Find search box
    let searchBox = await driver.wait(
      until.elementLocated(By.id("twotabsearchtextbox")),
      10000,
      "Search box not found within 10 seconds"
    );
    const searchKeyword = "gaming mouse";
    for (const char of searchKeyword) {
      await searchBox.sendKeys(char);
      await driver.sleep(Math.random() * 100 + 100);
    }
    await searchBox.sendKeys(Key.RETURN);

    // Wait for results (skip sponsored ads)
    await driver.wait(
      until.elementLocated(
        By.xpath(
          '(//h2[@class="a-size-medium a-spacing-none a-color-base a-text-normal" and not(ancestor::div[contains(@class, "s-sponsored")])])[1]'
        )
      ),
      10000
    );

    // Get first non-sponsored product
    let firstProduct = await driver.findElement(
      By.xpath(
        '(//h2[@class="a-size-medium a-spacing-none a-color-base a-text-normal" and not(ancestor::div[contains(@class, "s-sponsored")])])[1]'
      )
    );
    let abrasivesProductName = await firstProduct.getText();
    console.log("Selected Product:", abrasivesProductName);

    // Scroll to product and ensure it's clickable
    await driver.executeScript(
      "arguments[0].scrollIntoView({block: 'center', inline: 'center'});",
      firstProduct
    );
    await driver.sleep(1000); // Wait for page to stabilize

    // Attempt regular click, fall back to JavaScript click
    try {
      await firstProduct.click();
    } catch (clickErr) {
      console.log("Regular click failed, attempting JavaScript click...");
      await driver.executeScript("arguments[0].click();", firstProduct);
    }

    // Switch to new tab if opened
    let tabs = await driver.getAllWindowHandles();
    if (tabs.length > 1) {
      await driver.switchTo().window(tabs[1]);
    }

    // Wait for Add to Cart button
    await driver.wait(
      until.elementLocated(By.id("add-to-cart-button")),
      10000,
      "Add to Cart button not found within 10 seconds"
    );

    // Click Add to Cart button
    let addToCartButton = await driver.findElement(By.id("add-to-cart-button"));
    await addToCartButton.click();
    console.log("✅ Clicked Add to Cart");

    // Go to cart via UI
    await driver.sleep(Math.random() * 1000 + 1000);
    let cartIcon = await driver.findElement(By.id("nav-cart-count"));
    await cartIcon.click();
    await driver.sleep(Math.random() * 1000 + 2000);

    // Wait for cart product
    await driver.wait(
      until.elementLocated(By.css("span.a-truncate-cut")),
      10000
    );

    // Get cart product name
    let cartProductName = await driver
      .findElement(By.css("span.a-truncate-cut"))
      .getText();
    console.log("Cart Product:", cartProductName);

    // Validate
    if (
      cartProductName
        .toLowerCase()
        .includes(abrasivesProductName.toLowerCase().slice(0, 5))
    ) {
      console.log("✅ Test Passed: Correct product added to cart!");
    } else {
      console.log("❌ Test Failed: Product mismatch!");
    }
  } catch (err) {
    console.error("Test Error:", err);
    throw err;
  } finally {
    await driver.quit();
  }
})();
