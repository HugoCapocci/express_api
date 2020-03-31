const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const app = express();
const v1 = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1', v1);

// request : requête HTTP (reçu du client)
// response : response HTTP (à envoyer au client, en retour)
v1.get('/message', async (request, response) => {
    const quotes = await fs.readFile('./data/quotes.json');
    response.send(JSON.parse(quotes));
});

v1.get('/message/:id', async (request, response) => {
    const quotes = await fs.readFile('./data/quotes.json');
    const quoteArray = JSON.parse(quotes);

    // récupérer la citation qui correspond à l'id transmis
    const id = request.params.id;
    const quote = quoteArray.find(function(currentQuote) {
        return currentQuote.id == id;
    });
    quote ? response.send(quote) : response.sendStatus(404);
});

v1.post('/message', async (request, response) => {
    /* const message = request.body;
    // un message est valide s'il a un auteur et une citation
    console.log('message?', message);
    const isValid = message.quote && message.quote.length > 0 && message.author && message.author.length > 0;
    // si pas valide
    if (!isValid) return response.sendStatus(400);
    // si valide
    response.sendStatus(200); */

    const message = request.body;

    // un message  est valide si il a un auteur et une citation
    const isValid = message.quote && message.quote.length > 0
     && message.author && message.author.length > 0;
    
    if (!isValid) return response.sendStatus(400);

    const quotes = await fs.readFile('./data/quotes.json');
    if (!quotes) return response.sendStatus(500);

    const quoteArray = JSON.parse(quotes);
    quoteArray.sort((quoteA, quoteB) => quoteB.id - quoteA.id);
    /* équivalent de: function(quoteA, quoteB) {
        return quoteB - quoteA;
    }
    */
    message.id = quoteArray[0].id + 1;
    response.send(message);
});

app.listen(3000, () => {
    console.log('Server listening on port 3000!');
});