const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs').promises;

const app = express();
const v1 = express.Router();

app.use('/api/v1', v1);

// request : requette HTTP (reçu du client)
// response : réponse HTTP à envoyer, au clienten retour
v1.get('/message',async (request, response) => {
    const quotes = await fs.readFile('./data/quotes.json');
    response.setHeader('content-type', 'application/json');
    response.send(JSON.parse(quotes));
});

v1.get('/message/:id',async (request, response) => {
    const quotes = await fs.readFile('./data/quotes.json');
    const quoteArray = JSON.parse(quotes);
    const id = request.params.id;
    // response.send(quotes);

    const quote = quoteArray.find(function (currentOne) {
        return currentOne.id == id;
    });

    // ternaire
    quote ? response.send(quote) : response.sendStatus(404);

});

app.listen(3000, () => {
    console.log('app is running on port 3000');
});
