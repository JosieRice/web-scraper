// @ts-check
import puppeteer from "puppeteer";

export const buzzFeed = async url => {
  // TODO: Move this to utilities to be reused
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
      req.abort();
    }
    else {
      req.continue();
    }
  });

  await page.goto(url);

  const title = await page.evaluate(() =>
    Array.from(document.querySelectorAll("h1")).map(title => title.innerText)
  );

  let ingredientsDirty = await page.evaluate(() =>
    Array.from(document.getElementById("mod-subbuzz-text-1").children).map(
      title => title.innerText
    )
  );

  const ingredients = ingredientsDirty
    .filter(Boolean)

  const instructionsDirty = await page.evaluate(() =>
    Array.from(document.getElementById("mod-subbuzz-text-2").children).map(
      title => title.innerText
    )
  );

  const instructions = instructionsDirty
    .filter(Boolean)

  let jsonRecipe = {
    title: title[0],
    ingredients: ingredients,
    instructions: instructions
  };

  await browser.close();
  return jsonRecipe;
};