const express = require('express');
const fs = require('fs').promises;
const app = express();
const v1 = express.Router();

app.use('/api/v1', v1);

// request : requête HTTP (reçu du client)
// response : response HTTP (à envoyer au client, en retour)
v1.get('/message', async (request, response) => {
    const quotes = await fs.readFile('./data/quotes.json')
    response.send(quotes);
});

app.listen(3000, () => {
    console.log('Server listening on port 3000!');
});