const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const v1 = express.Router();
require('dotenv').config();

const basicAuth = require('./middleware/basic-auth').basicAuth;
const MessageService = require('./services/message-service');
const messageService = new MessageService();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/api/v1', v1);

// request : requête HTTP (reçu du client)
// response : réponse HTTP (à envoyer au client, en retour)
v1.get('/message', async (request, response) => {

    const quotes = await messageService.getMessages();
    response.send(quotes);
});

v1.get('/message/:id', async (request, response) => {

    // Récupérer la citation par rapport à l'ID transmis
    const id = request.params.id;
    try {
        const quote = await messageService.getMessage(id);
        // Opération ternaire
        quote ? response.send(quote) : response.sendStatus(404);
    } catch (error) {
         response.sendStatus(400)
    }
    
   
})

v1.post('/message', basicAuth, async (request, response) => {
    const message = request.body;

    //Si pas valide
    if (!MessageService.isMessageValid(message)) return response.sendStatus(400);
    
    // On sauvegarde dans Mongo !
    const createdMessage = await messageService.createMessage(message)
    response.send(createdMessage);
})

v1.delete('/message/:id', basicAuth, async (request, response) => {
    const id = request.params.id;
    try {
        const isDeleted = await messageService.deleteMeessage(id);
        isDeleted ? response.sendStatus(204) : response.sendStatus(404);
    } catch (error) {
        response.sendStatus(400);
    }
   
})

v1.put('/message/:id', basicAuth, async (request, response) => {
    const message = request.body;
    const id = request.params.id;
    if (!MessageService.isMessageValid(message)) return response.sendStatus(400);
    try {
        const result = await messageService.updateMessage(message, id);
        if(!result.isFind) return response.sendStatus(404);
        result.isModified ? response.sendStatus(200) : response.sendStatus(304);
    } catch (error) {
        console.log('Erreur : ' , error);
        response.sendStatus(400);
    }
})

app.listen(3000, () => {
    console.log('Server listening on port 3000 !')
})