const express = require('express');
const fs = require('fs').promises;
const app = express();
const bodyParser = require('body-parser');
const v1 = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1', v1);

//request requete htpp reçu du client
//response reponse http à envoyer au client en retour
v1.get('/message', async (request, response) => {
    const quotes = await fs.readFile('./data/quotes.json');
    response.setHeader('content-type', 'application/json');
    response.send(quotes);
});

v1.get('/message/:id', async (request, response) => {
    const quotes = await fs.readFile('./data/quotes.json');
    const quotesArray = JSON.parse(quotes);
    let id = request.params.id;
    const quote = quotesArray.find(function (currentQuote) {
        return currentQuote.id == id;
    });
    console.log(quote);
    quote ? response.send(quote) : response.sendStatus(404);
});


v1.post('/message', async (request, response) => {
    const message = request.body;
    //un message est valide s'il a un auteur et une citation
    console.log('message', message);

    const isValid = message.quote && message.quote.length > 0
        && message.author && message.author.length > 0;

    if (!isValid) return response.sendStatus(400);
    const quotes = await fs.readFile('./data/quotes.json');
    const quotesArray = JSON.parse(quotes);

    //equivalent de function(a,b) => {return b-a;}
    quotesArray.sort((QuoteA,QuoteB) => QuoteB.id - QuoteA.id);
    message.id = quotesArray[0].id +1;
    response.send(message);
    //si pas valide
 //   response.sendStatus();

    //si valide renvoi element cree et maxid +1
 //   response.
});
app.listen(3000, () => {
    console.log("port 30000");
});