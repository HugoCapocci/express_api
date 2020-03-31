const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();
const v1 = express.Router();

//toujours garder bodyParser en premier dans les appels a use()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1', v1);


//request = requete http ( reçu du client )
//response = reponse HTTP ( à envoyer au client en retour )
v1.get('/message', async (request, response)=>{
    const quotes = await fs.readFile('./data/quotes.json');
    response.send(JSON.parse(quotes));

});

v1.get('/message/:id', async (request, response)=>{
    const quotes = await fs.readFile('./data/quotes.json');
    const quoteArray = JSON.parse(quotes);
    //recuperer la citation qui correspond à l'id transmit
    const id = request.params.id;
    const quote = quoteArray.find(function(currentQuote){
        return currentQuote.id == id;
    });
    quote ? response.send(quote) : response.sendStatus(404) ;

});

v1.post('/message', async (request, response)=>{
    const message =  request.body;
    //une citation est valide si elle a un auteur et une citation
    console.log('message', message);
    const isValid = message.quote && message.author && message.quote.length > 0 && message.author.length > 0;
    //si pas valide
    if (!isValid) return response.sendStatus(400);

    const quotes = await fs.readFile('./data/quotes.json');
    const quoteArray = JSON.parse(quotes);
    quoteArray.sort((quoteA,quoteB)=>quoteB.id-quoteA.id);
    /*équivalent de : function(quoteA,quoteB){
        return quoteB-quoteA;
    }
    */

    //si valide: renvoit l'element crée
    //ajouter max id+1
    message.id=quoteArray[0].id+1 ;
    response.send(message);

});

app.listen(3000,()=>{
    console.log('Server listening in port 3000!');
});