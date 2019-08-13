'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _puppeteer = require('puppeteer');

var _puppeteer2 = _interopRequireDefault(_puppeteer);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

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
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));

var buzzFeed = async function buzzFeed(input) {
  var browser = await _puppeteer2.default.launch();
  var page = await browser.newPage();
  var url = input;
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
  return jsonRecipe;
};

// take a recipe URL and return the recipe info
app.post('/api/v1/recipes', async function (req, res) {
  if (!req.body.url) {
    return res.status(400).send({
      success: "false",
      message: "didn't get a url in body"
    });
  }

  var url = req.body.url;
  var recipe = await buzzFeed(url);

  return res.status(201).send({
    success: "true",
    message: 'sent ' + url + ' => here\'s what we found',
    recipe: recipe
  });
});

app.listen(port, function () {
  return console.log('Example app listening on port ' + port + '!');
});
//# sourceMappingURL=app.js.map