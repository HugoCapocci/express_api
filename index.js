const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const app = express();
const v1 = express.Router();
require('dotenv').config();

const basicAuth = require("./middleware/basic-auth").basicAuth;
const MessageService = require("./services/message-service");
const messageService = new MessageService();

// toujours garder bodyParser en premier dans les appels à use()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1', v1);

// request : requette HTTP (reçu du client)
// response : response HTTP (à envoyer au client, en retour)
v1.get('/message', async (request, response) => {
    const quotes = await fs.readFile('./data/quotes.json');
    response.send(JSON.parse(quotes));
});

v1.get('/message/:id', async (request, response) => {
    const quotes = await fs.readFile('./data/quotes.json');
    const quoteArray = JSON.parse(quotes);

    // recupérer la citation qui correspond à l'id transmis
    const id = request.params.id;
    const quote = quoteArray.find(function(currentQuote) {
       return currentQuote.id == id;
    });

    // ternaire
    quote ? response.send(quote) : response.sendStatus(404);
});

v1.post('/message', basicAuth, async (request, response) => {
    const message = request.body;

    // un message  est valide si il a un auteur et une citation
    const isValid = message.quote && message.quote.length > 0
     && message.author && message.author.length > 0;
    
    if (!isValid) return response.sendStatus(400);
    console.log(process.env.MONGO_CONNECTION_URL);

    // on sauvegarde dans mongo!
    const createdMessage = await messageService.createMessage(message);


    response.send(createdMessage);
});

app.listen(3000, () => {
    console.log('Server listening on port 3000!');
});
