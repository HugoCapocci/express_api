const express = require('express');
const fs = require('fs');
const app = express();

const v1 = express.Router();

app.use('/api/v1', v1);

v1.get('/message', (request, response) => {
    const quotes = await fs.readFile('./data/quotes.json')

    response.send(quotes);
})

app.listen(3000, () => {
    console.log('Server is listening on port 3000')
})