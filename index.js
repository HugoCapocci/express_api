const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs').promises;
const app = express();
const v1 = express.Router();
const basicAuth = require('./middleware/basic-auth').basicAuth;
require('dotenv').config();
const MessageService = require('./services/message-service');
const messageService = new MessageService();

// toujours garder bodyParser en premier dans les appels à use()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1', v1);

// request : requette HTTP (reçu du client)
// response : réponse HTTP à envoyer, au clienten retour
v1.get('/message',async (request, response) => {
    // const quotes = await fs.readFile('./data/quotes.json');
    const quotes = await messageService.getMessages();
    // response.setHeader('content-type', 'application/json');
    response.send(quotes);
});

v1.get('/message/:id', async (request, response) => {
    // const quotes = await fs.readFile('./data/quotes.json');
    const id = request.params.id;
    try {
        const message = await messageService.getOneMessage(id);
        message ? response.send(message) : response.sendStatus(404);
    }
    catch (e) {
        response.sendStatus(400);
    }
});

// console.log('basicAuth ', basicAuth);
v1.post('/message', basicAuth, async (request, response) => {
    const message = request.body;
    // un message est valide si il a un auther et une citation
    console.log('message? ', message);

    const isValid = message.quote && message.quote.length > 0 && message.author && message.author.length > 0;
    // si pas valide
    if(!isValid) return response.sendStatus(400);

    // on sauvegarde dans mongo
    const createdMessage = await messageService.createMessage(message);
    response.send(createdMessage);
});

v1.delete('/message/:id', basicAuth, async (request, response) => {
    const id = request.params.id;
    try {
        const isDeleted = await  messageService.deleteMessage(id);
        isDeleted ? response.sendStatus(204) : response.sendStatus(404);
    }catch (e) {
        response.sendStatus(400);
    }
});

app.listen(3000, () => {
    console.log('app is running on port 3000');
});
