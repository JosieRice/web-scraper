// @ts-check
const puppeteer = require("puppeteer");

async function buzzFeed(input) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url =
    "https://www.buzzfeed.com/pierceabernathy/bacon-avocado-brussels-sprout-salad-with-lemon-vinaigrette?utm_term=.oaavdq2mM#.sbezB7ndD";
  await page.goto(url);

  const title = await page.evaluate(() =>
    Array.from(document.querySelectorAll("h1")).map(title => title.innerText)
  );

  const ingredients = await page.evaluate(() =>
    Array.from(document.getElementById("mod-subbuzz-text-1").children).map(title => title.innerText)
  );

  const instructions = await page.evaluate(() =>
    Array.from(document.getElementById("mod-subbuzz-text-2").children).map(title => title.innerText)
  );

  let jsonRecipe = {
    'title': title,
    'ingredients': ingredients,
    'instructions': instructions
  }

  await browser.close();
  console.log('jsonRecipe', jsonRecipe)
  return jsonRecipe
};

module.exports = {
  buzzFeed
}