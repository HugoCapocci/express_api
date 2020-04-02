const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();
const v1 = express.Router();
require('dotenv').config();

const basicAuth = require('./middleware/basic-auth').basicAuth;
const MessageService = require('./services/message-service');
const messageService = new MessageService;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1', v1);

v1.get('/message', async (request, response) => {

    const quotes = await messageService.getMessages();
    response.setHeader('content-type', 'application/json');
    response.send(quotes);
})

v1.get('/message/:id', async (request, response) => {

    const id = request.params.id;
    try {
        const message  = await messageService.getMessage(id);

        message ? response.send(message) : response.sendStatus(404);
    } catch(e) {
        response.sendStatus(400);
    }
})

v1.post('/message', basicAuth, async (request, response) => {
    const message = request.body;
    console.log('message?', message);

    const isValid = message.quote && message.quote.length > 0 && message.author && message.author.length > 0;
    if(!isValid) return response.sendStatus(400);

    const createdMessage = messageService.createMessage(message);

    response.send(createdMessage);
    response.send(message);
});

v1.delete('/message/:id', basicAuth, async (request, response) => {
    const id = request.params.id;
    try {
        const isDeleted = await messageService.deleteMessage(id);
        isDeleted ? response.sendStatus(204) : response.sendStatus(404);
    } catch (e){
        response.sendStatus(400);
    }
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
})




