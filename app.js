const express = require('express');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');

const app = express();

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

// CORS
app.use(function (req, res, next) {
  console.log('in CORS function')
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
  console.log("in buzzfeed function")
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const url = input;
  try {
    await page.goto(url);
  } catch (e) {
    console.log(e)
  }


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
  return jsonRecipe
};

// take a recipe URL and return the recipe info
app.post('/api/v1/recipes', async (req, res) => {
  console.log('in post function')
  if (!req.body.url) {
    return res.status(400).send({
      success: "false",
      message: "didn't get a url in body"
    });
  }

  const url = req.body.url;
  const recipe = await buzzFeed(url);

  return res.status(201).send({
    success: "true",
    message: `sent ${url} => here's what we found`,
    recipe
  })
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))