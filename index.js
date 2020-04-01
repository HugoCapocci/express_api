const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const app = express();
const v1 = express.Router();
require('dotenv').config();

const basicAuth = require('./middleware/basic-auth').basicAuth;
const MessageService = require('./services/message-service');
const messageService = new MessageService();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/api/v1', v1);

//GET ALL
v1.get('/message', async (request, response) => {
    const quotes = await fs.readFile('./data/quotes.json');
    response.send(JSON.parse(quotes));
});

//GET BY ID
v1.get('/message/:id', async (request, response) => {
    const quotes = await fs.readFile('./data/quotes.json');
    const quoteArray = JSON.parse(quotes);
    const id = request.params.id;
    const quote = quoteArray.find(currentQuote => {
        return id == currentQuote.id;
    });
    quote ? response.send(quote) : response.sendStatus(404);
});

//POST
v1.post('/message', basicAuth, async (request, response) => {
    const message = request.body;
    const isValid = message.quote && message.quote.length > 0
        && message.author && message.author.length > 0;
    if (!isValid) return response.sendStatus(400);

    const createdMessage = messageService.createMessage(message);
    response.send(createdMessage);

});

app.listen(3000, () => {
    console.log('Server listening on port 3000!')
});
