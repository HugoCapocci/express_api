const express = require('express');
const fs = require('fs').promises;
const app = express();
const v1 = express.Router();

app.use('/api/v1', v1);

// request : requête HTTP (reçu du client)
// response : response HTTP (à envoyer au client, en retour)
v1.get('/message', async (request, response) => {
    const quotes = await fs.readFile('./data/quotes.json');
    response.send(JSON.parse(quotes));
});

v1.get('/message/:id', async (request, response) => {
    const quotes = await fs.readFile('./data/quotes.json');
    // récupérer la citation qui correspond à l'id transmis
    const id = request.params.id;
})

app.listen(3000, () => {
    console.log('Server listening on port 3000!');
});