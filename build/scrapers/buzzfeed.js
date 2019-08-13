"use strict";

// @ts-check
var puppeteer = require("puppeteer");

async function buzzFeed(input) {
  var browser = await puppeteer.launch();
  var page = await browser.newPage();
  var url = "https://www.buzzfeed.com/pierceabernathy/bacon-avocado-brussels-sprout-salad-with-lemon-vinaigrette?utm_term=.oaavdq2mM#.sbezB7ndD";
  await page.goto(url);

  var title = await page.evaluate(function () {
    return Array.from(document.querySelectorAll("h1")).map(function (title) {
      return title.innerText;
    });
  });

  var ingredients = await page.evaluate(function () {
    return Array.from(document.getElementById("mod-subbuzz-text-1").children).map(function (title) {
      return title.innerText;
    });
  });

  var instructions = await page.evaluate(function () {
    return Array.from(document.getElementById("mod-subbuzz-text-2").children).map(function (title) {
      return title.innerText;
    });
  });

  var jsonRecipe = {
    'title': title,
    'ingredients': ingredients,
    'instructions': instructions
  };

  await browser.close();
  console.log('jsonRecipe', jsonRecipe);
  return jsonRecipe;
};

module.exports = {
  buzzFeed: buzzFeed
};
//# sourceMappingURL=buzzfeed.js.map