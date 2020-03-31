const express = require('express');

const app = express();
const v1 = express.Router();

app.use('/api/v1', v1);

// req = requete HTTP (reçu du client)
// res = response HTTP (à envoyer au client en retour)
v1.get('/message', (req, res) => {
    res.send([
            {
                "quote": "test oui un deux trois",
                "author": "Winda",
                "id": 1
            },
            {
                "quote": "les cours en ligne ... pas ouf ca bug",
                "author": "Hitema",
                "id": 2
            }
    ])
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});