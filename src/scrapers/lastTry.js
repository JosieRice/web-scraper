// @ts-check
import puppeteer from "puppeteer";

export const lastTry = async input => {
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  const url = input;
  await page.goto(url);

  const pageContent = await page.evaluate(() =>
    Array.from(document.getElementsByClassName('recipe'))[0].innerText
  );

  const description = pageContent.substring(pageContent.indexOf("Description"), pageContent.indexOf("Ingredients"))

  const ingredients = pageContent.substring(pageContent.indexOf("Ingredients"), pageContent.indexOf("Instructions"))

  const instructions = pageContent.substring(pageContent.indexOf("Instructions"), pageContent.indexOf("Nutrition"));

  let jsonRecipe = {
    description,
    ingredients,
    instructions
  };

  await browser.close();
  return jsonRecipe;
};