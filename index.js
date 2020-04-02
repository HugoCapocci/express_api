const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
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
    // Un message est valide si il a un auteur et une citation
    console.log('message ?', message);

    const quotes = await fs.readFile('./data/quotes.json');

    // Contrôle
    const isValid = message.quote && message.quote.length > 0 && message.author && message.author.length > 0;

    // Sil n'y a pas de quotes
    if (!quotes) return response.sendStatus(500);

    //Si pas valide
    if (!isValid) return response.sendStatus(400);
    
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

app.listen(3000, () => {
    console.log('Server listening on port 3000 !')
})