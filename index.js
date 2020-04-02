const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs").promises;
const basicAuth = require("./middleware/basic-auth").basicAuth;
const MessageService = require("./services/message-service");
require("dotenv").config();

const app = express();
const v1 = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/v1", v1);

const messageService = new MessageService();

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

v1.post("/message", basicAuth, async (request, response) => {
  const message = request.body;

  const isValid =
    message.quote &&
    message.quote.length > 0 &&
    message.author &&
    message.author.length > 0;

  if (!isValid) return response.sendStatus(400);

  const createdMessage = await messageService.createMessage(message);
  response.send(createdMessage);
});

app.listen(3000, () => {
  console.log("Server listening…");
});
