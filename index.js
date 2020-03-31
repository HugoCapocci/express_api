const express = require('express');
const fs = require('fs').promises;

const app = express();
const v1 = express.Router();

app.use('/api/v1', v1);

v1.get('/message', async (request, response) => {

    const quotes = await fs.readFile('./express_api/data/quotes.json');

    response.setHeader('content-type', 'application/json');
    response.send(JSON.parse(quotes));
})

v1.get('/message/:id', async (request, response) => {
    const quotes = await fs.readFile('./express_api/data/quotes.json');
    const quoteArray = JSON0parse(quotes);
    const id = request.params.id;
    const quote = quoteArray.find(function(currentQuote){

    })

    if(!quote){
        response.sendStatus(404);
    }else{
        response.send(quote);
    }
})

app.listen(3000, () => {
    console.log("Listening on port 3000");
})
