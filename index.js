const express = require('express');
const fs = require('fs').promises;
const app = express();
const bodyParser = require('body-parser');

const v1 = express.Router();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/api/v1', v1);

v1.get('/message', async (request, response) => {
    try {
        const quotes = await fs.readFile('./data/quotes.json');
        response.send(JSON.parse(quotes));
    } catch (error) {
        response.send(error);
    }
})

v1.get('/message/:id', async (request, response) => {
    const quotes = await fs.readFile('./data/quotes.json')
    const quoteArray = JSON.parse(quotes);
    const id = request.params.id;

    const quote = await quoteArray.find((quote) => {
        return quote.id == id
    });

    quote ?  response.send(quote) : response.sendStatus(404);
})

v1.post('/message', async (request, response) => {
    const message = request.body;    
    const isValid = message.quote && message.quote.length > 0 && message.author

    if (!isValid) return response.sendStatus(400);
    const quotes = await fs.readFile('./data/quotes.json');
    const quoteArray = JSON.parse(quotes);
    quoteArray.sort((quoteA,quoteB) => quoteB.id - quoteA.id);

    message.id = quoteArray[0].id + 1;
    response.send(message);


    console.log(message);
})

app.listen(3000, () => {
    console.log('Server is listening on port 3000')
})

function getNextId(obj) {
    return (Math.max.apply(Math, obj.map(function(o) {
        return o.id;
    })) + 1);
}