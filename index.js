const express = require("express");
const fs = require("fs").promises;

const app = express();
const v1 = express.Router();

app.use("/api/v1", v1);

v1.get("/message", async (request, response) => {
  const quotes = await fs.readFile("./data/quotes.json");
  response.send(JSON.parse(quotes));
});

v1.get("/message/:id", async (request, response) => {
  const id = request.params.id;
  const quotes = await fs.readFile("./data/quotes.json");
  const quotesArray = JSON.parse(quotes);
  const quote = quotesArray.find(q => q.id == id);

  if (!quote) {
    response.sendStatus(404);
  } else {
    response.send(quote);
  }
});

app.listen(3000, () => {
  console.log("Server listening…");
});
