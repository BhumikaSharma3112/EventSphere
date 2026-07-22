const { Builder, By, until } = require('selenium-webdriver');

async function runTest() {
  // Create Chrome driver session
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    // 1. Open the live EventSphere login page
    await driver.get('https://eventsphere-prestige.onrender.com/login');

    // 2. Find inputs and type credentials
    await driver.findElement(By.css('input[type="email"]')).sendKeys('user@eventsphere.com');
    await driver.findElement(By.css('input[type="password"]')).sendKeys('password123');

    // 3. Click the submit button
    await driver.findElement(By.css('button[type="submit"]')).click();

    // 4. Wait until the URL changes to /dashboard (timeout in 10 seconds)
    await driver.wait(until.urlContains('/dashboard'), 10000);

    console.log('Test Passed: Successfully logged in and redirected to dashboard!');
  } catch (error) {
    console.error('Test Failed:', error);
  } finally {
    // Close browser session
    await driver.quit();
  }
}

runTest();
