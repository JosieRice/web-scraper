// @ts-check
import puppeteer from "puppeteer";

export const buzzFeed = async input => {
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  const url = input;
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