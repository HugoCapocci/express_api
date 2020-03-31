const express = require('express');
const fs = require('fs').promises;
const app = express();

const v1 = express.Router();

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

app.listen(3000, () => {
    console.log('Server is listening on port 3000')
})