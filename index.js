const express = require('express');

const app = express();
const fs = require('fs').promises;
const v1 = express.Router();

app.use('/api/v1', v1); 

//request = requete http ( reçu du client )
//response = reponse HTTP ( à envoyer au client en retour )
v1.get('/message', async (request, response)=>{
    const quotes = await fs.readFile('./data/quotes.json');
    response.send(JSON.parse(quotes));

})

v1.get('/message/:id', async (request, response)=>{
    const quotes = await fs.readFile('./data/quotes.json');
    const quoteArray = JSON.parse(quotes);
    //recuperer la citation qui correspond à l'id transmit
    const id = request.params.id;
    const quote = quoteArray.find(function(currentQuote){
        return currentQuote.id == id;
    });
    quote ? response.send(quote) : response.sendStatus(404) ;

})

app.listen(3000,()=>{
    console.log('Server listening in port 3000!');
});