const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const app = express();
const v1 = express.Router();
require('dotenv').config();

const basicAuth = require('./middleware/basic-auth').basicAuth;
const MessageService = require('./services/messageService');
const messageService = new MessageService();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1', v1);

// req = requete HTTP (reçu du client)
// res = response HTTP (à envoyer au client en retour)
v1.get('/message', async (req, res) => {
    const quotes = await messageService.getMessages();
    res.send(quotes);
    // Get avec un fichier JSON
    //const quotes = await fs.readFile('./data/quotes.json');
    //res.setHeader('Content-Type', 'application/json');
    //res.send(JSON.parse(quotes));
});

v1.get('/message/:id', async (req, res) => {

    const id = req.params.id;

    try {
        const quotes = await messageService.getMessagesById(id);
        if (!quotes)
            res.sendStatus(404);
        else
            res.send(quotes);

    } catch(e) {
        res.sendStatus(400);
    }
   
    // Get ID avec un fichier JSON
    /*const quotes = await fs.readFile('./data/quotes.json');
    const quoteArray = JSON.parse(quotes);*/
    // récupérer le message qui correspond à l'id
    /*const id = req.params.id;
    const quote = quoteArray.find(function(currentQuote) {
        return currentQuote.id == id;
    });

    if (!quote) {
        res.sendStatus(404);
    } else {
        res.send(quote);
    }*/

});

v1.post('/message', basicAuth, async (req, res) => {
    const message = req.body;
    // un message est valide s'il a un auteur et une citation
    console.log('message?', message);

    const isValid = message.quote && message.quote.length > 0
        && message.author && message.author.length > 0;
    
    // si pas valide :
    if (!isValid)
        return res.sendStatus(400);

    const createMessage = await messageService.createMessage(message);

    res.send(createMessage);
    // const quotes = await fs.readFile('./data/quotes.json');
    // const quoteArray = JSON.parse(quotes);
    // quoteArray.sort((quoteA, quoteB) => quoteB.id - quoteA.id);
    // /*
    //     Equivalent de : function(a,b) {
    //         return b - a;
    //     } 
    // */

    // // si valide : renvoit l'élément créé
    // // ajouter max id + 1
    // message.id = quoteArray[0].id + 1;
    //res.send(message);
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});