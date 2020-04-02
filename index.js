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

v1.get('/message', async (request, response)=>{

    const quotes = await fs.readFile('./data/quotes.json')
    response.send(quotes);
});

v1.get('/message/:id', async (request, response)=>{
    const id = request.params.id;
    const quotes = await fs.readFile('./data/quotes.json')
    const quoteArray = JSON.parse(quotes);

    const myQuote = quoteArray.find(function(currentQuote){
        return currentQuote.id == id
    })

    if(!myQuote){
        response.sendStatus(404);
    }else{
        response.send(myQuote);
    }
    
})

v1.post('/message', basicAuth, async (request, response) =>{
    const message = request.body;
    console.log('message reçu !');

    const isValid = message.quote && message.quote.length > 0
     && message.author && message.author.length > 0;
    //

    if(!isValid){
        response.sendStatus(400);
    }
        
    const createdMessage = await MessageService.createMessage(message);
    response.send(createdMessage);
    

})

app.listen(3000, ()=>{
    console.log('server listenig on port 3000');
})