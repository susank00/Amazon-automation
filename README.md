# Amazon UI Automation - Selenium WebDriver

This repository contains my solution for automating various actions on the Amazon website using Selenium WebDriver in Node.js. The script is designed to interact with the homepage, update the delivery location, search for a product, add it to the cart, and verify the product in the cart.

## Features

Automated Browser Setup: Uses Chrome WebDriver with custom options to avoid detection by Amazon's automated systems.

CAPTCHA Handling: Detects CAPTCHA and waits for manual solving if required.

Delivery Location Update: Automates the process of updating the delivery location with a new ZIP code.

Search Functionality: Searches for a predefined keyword (e.g., "gaming mouse") on Amazon.

Product Selection: Selects the first non-sponsored product from the search results.

Add to Cart: Adds the selected product to the shopping cart.

Cart Verification: Verifies that the correct product is added to the cart.

## 🛠️ Tech Stack

- **Node.js**: Used for scripting and automation..
- **Selenium WebDriver**: Main tool for browser automation.
- **ChromeDriver**: Chrome browser automation with custom options to bypass detection.

- **JavaScript**: Used for scripting the interactions with Amazon's webpage

## 🚀 Getting Started

Clone the Repository:

```bash
git clone https://github.com/susank00/Amazon-automation.git
Navigate to the Project Directory:
cd amazonUIautomation
npm install
node amazonTest.js

```
