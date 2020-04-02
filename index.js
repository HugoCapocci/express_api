const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const MessageService = require('./services/message-service');

const fs = require('fs').promises;
const app = express();
const v1 = express.Router();

const basicAuth = require('./middleware/basic-auth').basicAuth;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1', v1);

//Listing function
v1.get('/message', async (request, response)=>{
    //const quotes = await fs.readFile('./data/quotes.json')
    response.send(await MessageService.list());
});

//Details function
v1.get('/message/:id', async (request, response)=>{
    const id = request.params.id;
    
    try{
        const myQuote = await MessageService.details(id);

        myQuote ? response.send(myQuote) : response.sendStatus(404);
    }catch{
        response.sendStatus(400);
    }
    
});

//Creating function
v1.post('/message', basicAuth, async (request, response) =>{
    const message = request.body;
    console.log('message reçu !');

    const isValid = message.quote && message.quote.length > 0
     && message.author && message.author.length > 0;

    if(!isValid){
        response.sendStatus(400);
    }
        
    const createdMessage = await MessageService.create(message);
    response.send(createdMessage);
});

v1.delete('/message/:id', basicAuth, async (req, res) => {
    const id = req.params.id;
    
    try{
        const isDeleted = await MessageService.delete(id);

        isDeleted ? res.sendStatus(204) : res.sendStatus(404)
    }catch{
        response.sendStatus(400);
    }
});

app.listen(3000, ()=>{
    console.log('server listenig on port 3000');
})