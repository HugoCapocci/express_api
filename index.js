const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const app = express();
const v1 = express.Router();

const MessageService = require('./services/message-service');
const messageService = new MessageService();

const { basicAuth } = require('./middleware/basic-auth');


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/api/v1', v1);

v1.get('/message', async (request, response) => {
    // let quotes = await fs.readFile('./data/quotes.json');

    let quotes = await messageService.getMessages();
    response.send(quotes);
});

v1.get('/message/:id', async (request, response) => {
    let id = request.params.id;
    // let quotes = await fs.readFile('./data/quotes.json');
    // let quote = JSON.parse(quotes).find(quote => quote.id == id);
    
    try{
        let quote = await messageService.getMessage(id);
        response.send(quote)
    }catch(error){
        response.sendStatus(400);
    }
});


v1.post('/message', basicAuth, async (request, response) => {
    let message = request.body;

    let isValid = message.quote && message.quote.length > 0 && message.author && message.author.length > 0;
    
    if(!isValid) return response.sendStatus(400);

    console.log('here');

    let createdMessage = await messageService.createMessage(message);

    // let quotes = await fs.readFile('./data/quotes.json');
    // if(!quotes) return response.sendStatus(500);
    
    // let quoteArray = JSON.parse(quotes);
    // quoteArray.sort((a, b) => b.id - a.id);

    // message.id = quoteArray[0].id +1;
    response.send(createdMessage);


});

v1.delete('/message/:id', basicAuth, async (request, response) => {
    let id = request.params.id;
    try{
        let isDeleted = await messageService.deleteMessage(id);
        isDeleted ? response.sendStatus(200) : response.sendStatus(404);
    }catch(error){
        response.sendStatus(400);
    }
    
    
});


app.listen(3000, () => {
    console.log('Server listening on port 3000 !');
});