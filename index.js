const express = require('express');
const fs = require('fs').promises;
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const v1 = express.Router();
const port = process.env.PORT || 3000;
const basicAuth = require('./middleware/basic-auth').basicAuth;
const MessageService = require('./services/message-service').MessageService;
const messageService = new MessageService();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1', v1);

v1.get('/message', async (request, response) => {
  const quotes = await fs.readFile('./data/quotes.json');
  response.send(JSON.parse(quotes));
});

v1.get('/message/:id', async (request, response) => {
  let quotes = await fs.readFile('./data/quotes.json');
  quotes = JSON.parse(quotes);
  const message = quotes.find(
    quote => quote.id === parseInt(request.params.id),
  );
  !message ? response.sendStatus(404) : response.send(message);
});

v1.post('/message', basicAuth, async (request, response) => {
  const message = request.body;
  const isValid =
    message.quote &&
    message.quote.length > 0 &&
    message.author &&
    message.author.length > 0;

  if (!isValid) {
    return response.sendStatus(500);
  }

  const createdMessage = messageService.createMessage(message);
  let quotes = await fs.readFile('./data/quotes.json');
  quotes = JSON.parse(quotes);
  const ids = quotes.map(quote => quote.id);
  message.id = Math.max.apply(null, ids) + 1;
  response.send(message);
});

app.listen(port, () => console.log(`App listning on port ${port}`));
