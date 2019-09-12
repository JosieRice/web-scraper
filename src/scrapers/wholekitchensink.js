//  @ts-check
import puppeteer from "puppeteer";

export const wholekitchensink = async url => {
  console.log("WHOLEKITCHENSINK")
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
    Array.from(document.querySelectorAll('[itemprop="headline"]')).map(title => title.innerText)
  );

  const prepTime = await page.evaluate(() =>
    Array.from(document.getElementsByClassName("tasty-recipes-prep-time")).map(title => title.innerText)
  );

  const cookTime = await page.evaluate(() =>
    Array.from(document.getElementsByClassName("tasty-recipes-total-time")).map(title => title.innerText)
  );

  const ingredientsDirty = await page.evaluate(() =>
    Array.from(document.getElementsByClassName("tasty-recipe-ingredients")).map(title => title.innerText)
  );

  const ingredients = ingredientsDirty[0]
    .replace("Ingredients\n", "")

  const instructionsDirty = await page.evaluate(() =>
    Array.from(document.getElementsByClassName("tasty-recipe-instructions")).map(title => title.innerText)
  );

  const instructions = instructionsDirty[0]
    .replace("Instructions\n", "")

  let jsonRecipe = {
    title: title[1],
    prepTime: prepTime[0],
    cookTime: cookTime[0],
    ingredients: ingredients,
    instructions: instructions
  };

  await browser.close();
  return jsonRecipe;
};