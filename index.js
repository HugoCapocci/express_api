const express = require('express');
const bodyParser = require('body-parser');

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

    if(isValid){
        const quotes = await fs.readFile('./data/quotes.json')
        const quoteArray = JSON.parse(quotes);

        quoteArray.sort((quoteA,quoteB) => quoteB.id - quoteA.id);

        message.id = quoteArray[0].id + 1;

        response.send(message);
    }else{
        
        response.sendStatus(400);
    }
})

app.listen(3000, ()=>{
    console.log('server listenig on port 3000 - Ta mère est un velow');
})