const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const app = express();
const v1 = express.Router();

require('dotenv').config();

const basicAuth = require('./middleware/basic-auth').basicAuth;
const MessageService = require('./services/message-service');
const messageService = new MessageService();


//toujours garder bodyParser en premier dans les appels a use()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1', v1);

//request = requete http ( reçu du client )
//response = reponse HTTP ( à envoyer au client en retour )
v1.get('/messages', async (request, response) => {
    //const quotes = await fs.readFile('./data/quotes.json');
    //response.send(JSON.parse(quotes));

    const quotes = await messageService.getMessages();
    response.send(quotes);
});

v1.get('/message/:id', async (request, response) => {
    //const quotes = await fs.readFile('./data/quotes.json');
    //const quoteArray = JSON.parse(quotes);
    //recuperer la citation qui correspond à l'id transmit
    //const id = request.params.id;
    //const quote = quoteArray.find(function (currentQuote) {
    //    return currentQuote.id == id;
    //});
    //quote ? response.send(quote) : response.sendStatus(404);

    const id = request.params.id;

    try {
        const message = await messageService.getMessages(id);
        
        //ternaire
        message ? response.send(message) : response.sendStatus(404);
    } catch {
        response.sendStatus(400);
    }
    
});

console.log('basicAuth', basicAuth);

v1.post('/message', basicAuth, async (request, response) => {
    const message = request.body;

    const isValid = message.quote && message.quote.length > 0 && message.author && message.author.length > 0;

    if (!isValid) return response.sendStatus(400);

    const createdMessage = await messageService.createMessage(message);
    response.send(createdMessage);

});

v1.delete('/message/:id', basicAuth, async (request, response) => {
    const id = request.params.id;
    try {
        const isDeleted = await messageService.deleteMessage(id);
        response.sendStatus(200);
    }catch(e) {
        response.sendStatus(400);
    }
});

app.listen(3000, () => {
    console.log('Server listening in port 3000!');
});