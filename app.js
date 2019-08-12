const express = require('express')
const app = express()
const puppeteer = require("puppeteer");
const bodyParser = require('body-parser');

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const todos = [
  {
    id: 1,
    title: "lunch",
    description: "Go for lunc by 2pm"
  }
];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url =
    "https://www.buzzfeed.com/pierceabernathy/bacon-avocado-brussels-sprout-salad-with-lemon-vinaigrette?utm_term=.oaavdq2mM#.sbezB7ndD";
  await page.goto(url);

  const h1 = await page.evaluate(() =>
    Array.from(document.querySelectorAll("h1")).map(title => title.innerText)
  );

  // const Ingredients = await page.evaluate(() =>
  //   // grabs the whole ingredients block
  //   Array.from(document.querySelectorAll("#mod-subbuzz-text-1"))
  // );

  let jsonRecipe = {
    'title': h1[0]
  }

  app.get('/', (req, res) => res.json(jsonRecipe))

  await browser.close();
})();

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

// take a recipe URL
app.post('/api/v1/recipes', (req, res) => {
  if (!req.body.url) {
    return res.status(400).send({
      success: 'false',
      message: 'url'
    });
  }
  const url = req.body.url
  console.log('url input: ', url)
  return res.status(201).send({
    success: 'true',
    message: 'recipe url received',
    url
  })
});

// get recipe information
app.get('/api/v1/recipes', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'todos retrieved successfully',
    recipes: todos
  })
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))