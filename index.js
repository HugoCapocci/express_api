const express = require('express');
const fs = require('fs').promises;
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const v1 = express.Router();
const basicAuth = require("./middleware/basic-auth").basicAuth;
const MessageService = require("./services/message-service");
const messageService = new MessageService();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/api/v1', v1);
const multer = require('multer');
const upload = multer({dest: 'data/upload/'});
const FileService = require('./services/file-service');
const fileService = new FileService();
v1.post('/file', upload.single('myFile'), async (request, response) => {
    //meta donnees recuperes
    try {
        await fileService.saveFileInfos(request.file);
        /*
        on veut extraire et enregistrer filename (nom sur le disque)
        originalname -> "vrai nom du fichier"
        mimetype, size, encoding
         */
        response.sendStatus(200);
    } catch (e) {
        response.sendStatus(500);
    }
});

v1.get('/file/:id', async (request, response) => {
    const id = request.params.id;
    try {
        const fileResult = await fileService.getFile(id);
        if (fileResult) {
            response.setHeader('Content-disposition',
                'attachment; filename =' +
                '', fileResult.fileInfo['original-name']);

            response.setHeader('Content-type', fileResult.fileInfo['mime-type']);
            response.setHeader('Content-length', fileResult.fileInfo.size);
            fileResult.file.pipe(response);

            // response.send(200);
        } else {
            response.send(404);
        }
    } catch (e) {
        //  console.log(e.message());
        response.sendStatus(500);
    }
    //const quotes = await fs.readFile('./data/quotes.json');
    //response.setHeader('content-type', 'application/json');
});
v1.delete('/file/:id', async (request, response) => {
    const id = request.params.id;
    try {
        const deletedFile = await fileService.deleteFile(id);
        if (deletedFile === null) return response.sendStatus(404);
        deletedFile ? response.sendStatus(200) : response.sendStatus(403);
        //response.sendStatus(200);
    } catch (e) {
        console.log(e);
        response.sendStatus(500);
    }
    //const quotes = await fs.readFile('./data/quotes.json');
    //response.setHeader('content-type', 'application/json');
});
//request requete htpp reçu du client
//response reponse http à envoyer au client en retour
v1.get('/message', async (request, response) => {
    const quotes = await messageService.getMessages();
    //const quotes = await fs.readFile('./data/quotes.json');
    //response.setHeader('content-type', 'application/json');
    response.send(quotes);
});

v1.get('/message/:id', async (request, response) => {
    const id = request.params.id;
    try {
        const message = await messageService.getMessage(id);
        message ? response.send(message) : response.sendStatus(404);
    } catch (e) {
        response.sendStatus(404);
    }
    /* const quotesArray = JSON.parse(quotes);
     let id = request.params.id;
     const quote = quotesArray.find(function (currentQuote) {
         return currentQuote.id == id;
     });
     console.log(quote);*/
});

v1.delete('/message/:id', basicAuth, async (request, response) => {
    const id = request.params.id;
    try {
        const isDeleted = await messageService.deleteMessage(id);
        isDeleted ? response.sendStatus(200) : response.sendStatus(404);
    } catch (e) {
        response.sendStatus(404);
    }

});

v1.put('/message/:id', basicAuth, async (request, response) => {
    const id = request.params.id;
    const message = request.body;
    if (!MessageService.isMessageValid(message))
        return response.sendStatus(400);
    try {
        const result = await messageService.updateMessage(message, id);
        if (!result.isFind) response.sendStatus(404);
        result.isModified ? response.sendStatus(200) : response.sendStatus(304);
    } catch (e) {
        response.sendStatus(400);
    }

});
v1.post('/message', basicAuth, async (request, response) => {
    const message = request.body;
    //un message est valide s'il a un auteur et une citation
    console.log('message', message);

    if (!MessageService.isMessageValid(message)) return response.sendStatus(400);
    // const quotes = await fs.readFile('./data/quotes.json');
    // const quotesArray = JSON.parse(quotes);

    const createdMessage = messageService.createMessage(message);
///user passwordpassword
    //equivalent de function(a,b) => {return b-a;}
    // quotesArray.sort((QuoteA,QuoteB) => QuoteB.id - QuoteA.id);
    // message.id = quotesArray[0].id +1;
    response.send(createdMessage);
    //si pas valide
    //   response.sendStatus();

    //si valide renvoi element cree et maxid +1
    //   response.
});
app.listen(3000, () => {
    console.log("port 30000");
});