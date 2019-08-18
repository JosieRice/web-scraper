// @ts-check
import express from "express";
import bodyParser from "body-parser";
import { buzzFeed } from "./scrapers/buzzfeed";

const app = express();

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

// CORS
app.use(function (req, res, next) {
  // Instead of "*" you should enable only specific origins
  res.header("Access-Control-Allow-Origin", "*");
  // Supported HTTP verbs
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  // Other custom headers
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// take a recipe URL and return the recipe info
app.post("/api/v1/recipes", async (req, res) => {
  console.log("in post function");
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
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
