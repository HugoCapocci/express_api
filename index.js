const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const app = express();
const v1 = express.Router();
require('dotenv').config();

const basicAuth = require('./middleware/basic-auth').basicAuth;
const MessageService = require('./services/message-service');
const messageService = new MessageService();

// toujours garder bodyParser en premier dans les appels à use()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1', v1);

// request : requette HTTP (reçu du client)
// response : response HTTP (à envoyer au client, en retour)
v1.get('/message', async (request, response) => {
    const quotes = await messageService.getMessages();
    response.send(quotes);
});

v1.get('/message/:id', async (request, response) => {

    // recupérer la citation qui correspond à l'id transmis
    const id = request.params.id;
    try{
        const message = await messageService.getMessage(id); 
        message ? response.send(message) : response.sendStatus(404);
    }
    catch(e){
        response.sendStatus(400);
    }
});

v1.post('/message', basicAuth, async (request, response) => {
    const message = request.body;

    // un message  est valide si il a un auteur et une citation
    const isValid = message.quote && message.quote.length > 0
     && message.author && message.author.length > 0;
    
    if (!isValid) return response.sendStatus(400);

    // on sauvegarde dans mongo!
    const createdMessage = messageService.createMessage(message);

    response.send(createdMessage);
});

v1.delete('/message/:id',basicAuth,  async (request, response) => {

    const id = request.params.id;
    try{
        const isDelete = await messageService.deleteMessage(id); 
        isDeleted ? response.sendStatus(204) : response.sendStatus(404);
    }
    catch(e){
        response.sendStatus(400);
    }
});
app.listen(3000, () => {
    console.log('Server listening on port 3000!');
});