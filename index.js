const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();
const v1 = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1', v1);

v1.get('/message', async (request, response) => {

    const quotes = await fs.readFile('./express_api/data/quotes.json');

    response.setHeader('content-type', 'application/json');
    response.send(JSON.parse(quotes));
})

v1.get('/message/:id', async (request, response) => {
    const quotes = await fs.readFile('./express_api/data/quotes.json');
    const quoteArray = JSON.parse(quotes);
    const id = request.params.id;
    const quote = quoteArray.find(function(currentQuote){
        return currentQuote.id == id;
    })

    // if(!quote){
    //     response.sendStatus(404);
    // }else{
    //     response.send(quote);
    // }

    quote ? response.send(quote) : response.sendStatus(404);
})

v1.post('/message', async (request, response) => {
    const message = request.body;
    console.log('message?', message);

    const isValid = message.quote && message.quote.length > 0 && message.author && message.author.length > 0;
    if(!isValid) return response.sendStatus(400);

    const quotes = await fs.readFile('./express_api/data/quotes.json');
    if(!quotes) return response.sendStatus(500);
    const quoteArray = JSON.parse(quotes);
    quoteArray.sort((a, b) => b.id - a.id);

    message.id = quoteArray[0].id + 1;

    response.send(message);
})

app.listen(3000, () => {
    console.log("Listening on port 3000");
})
