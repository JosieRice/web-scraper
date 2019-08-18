// @ts-check
import puppeteer from "puppeteer";

export const buzzFeed = async input => {
  console.log("in buzzfeed function");
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  const url = input;
  await page.goto(url);

  const title = await page.evaluate(() =>
    Array.from(document.querySelectorAll("h1")).map(title => title.innerText)
  );

  const ingredients = await page.evaluate(() =>
    Array.from(document.getElementById("mod-subbuzz-text-1").children).map(
      title => title.innerText
    )
  );

  const instructions = await page.evaluate(() =>
    Array.from(document.getElementById("mod-subbuzz-text-2").children).map(
      title => title.innerText
    )
  );

  let jsonRecipe = {
    title: title,
    ingredients: ingredients,
    instructions: instructions
  };

  await browser.close();
  return jsonRecipe;
  // return "from buzzfeed"
};