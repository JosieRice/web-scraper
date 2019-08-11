const express = require('express')
const app = express()
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url =
    "https://www.buzzfeed.com/pierceabernathy/bacon-avocado-brussels-sprout-salad-with-lemon-vinaigrette?utm_term=.oaavdq2mM#.sbezB7ndD";
  await page.goto(url);
  // await page.screenshot({path: 'example.png'});

  const h1 = await page.evaluate(() =>
    Array.from(document.querySelectorAll("h1")).map(title => title.innerText)
  );

  // const Ingredients = await page.evaluate(() =>
  //   // grabs the whole ingredients block
  //   Array.from(document.querySelectorAll("#mod-subbuzz-text-1"))
  // );

  console.log("h1", h1);

  let jsonRecipe = {
    'title': h1[0]
  }

  console.log("json", jsonRecipe)
  // console.log("Ingredients", Ingredients);

  // res.json({ username: 'Flavio' })
  app.get('/', (req, res) => res.json(jsonRecipe))

  await browser.close();
})();

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

// app.get('/', (req, res) => res.send('Hello World!'))
// app.get('/', (req, res) => res.json({ json: 'Hello World!' }))



app.listen(port, () => console.log(`Example app listening on port ${port}!`))