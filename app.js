const express = require('express')
const app = express()
const puppeteer = require("puppeteer");
const bodyParser = require('body-parser');

// CORS
app.use(function (req, res, next) {
  // Instead of "*" you should enable only specific origins
  res.header('Access-Control-Allow-Origin', '*');
  // Supported HTTP verbs
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  // Other custom headers
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const buzzFeed = async (input) => {
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

  console.log('title', title)
  console.log('ingredients', ingredients);
  console.log('instructions', instructions);

  // const Ingredients = await page.evaluate(() =>
  //   // grabs the whole ingredients block
  //   Array.from(document.querySelectorAll("#mod-subbuzz-text-1"))
  // );

  let jsonRecipe = {
    'title': title,
    'ingredients': ingredients,
    'instructions': instructions
  }



  // app.get('/', (req, res) => res.json(jsonRecipe))

  await browser.close();
  console.log('jsonRecipe', jsonRecipe)
  return jsonRecipe
};

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


// sends buzzfeed recipe info back with API
app.get('/api/v1/recipes', async (req, res) => {
  const recipe = await buzzFeed();

  res.status(200).send({
    success: 'true',
    message: 'todos retrieved successfully',
    recipe
  })
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))