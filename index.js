const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const app = express();
const v1 = express.Router();

require('dotenv').config();

const basicAuth = require('./middleware/basic-auth').basicAuth;
const MessageService = require('./services/message-service');
const messageService = new MessageService();
const FileService = require('./services/file-service');
const fileService = new FileService();


//toujours garder bodyParser en premier dans les appels a use()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1', v1);

//request = requete http ( reçu du client )
//response = reponse HTTP ( à envoyer au client en retour )
v1.get('/messages', async (request, response) => {
    //const quotes = await fs.readFile('./data/quotes.json');
    //response.send(JSON.parse(quotes));

    const quotes = await messageService.getMessages();
    response.send(quotes);
});

v1.get('/message/:id', async (request, response) => {
    //const quotes = await fs.readFile('./data/quotes.json');
    //const quoteArray = JSON.parse(quotes);
    //recuperer la citation qui correspond à l'id transmit
    //const id = request.params.id;
    //const quote = quoteArray.find(function (currentQuote) {
    //    return currentQuote.id == id;
    //});
    //quote ? response.send(quote) : response.sendStatus(404);

    const id = request.params.id;

    try {
        const message = await messageService.getMessage(id);
        
        //ternaire
        message ? response.send(message) : response.sendStatus(404);
    } catch {
        response.sendStatus(400);
    }
    
});

console.log('basicAuth', basicAuth);

v1.post('/message', basicAuth, async (request, response) => {
    const message = request.body;

    const isValid = message.quote && message.quote.length > 0 && message.author && message.author.length > 0;

    if (!isValid) return response.sendStatus(400);

    const createdMessage = await messageService.createMessage(message);
    response.send(createdMessage);

});

v1.delete('/message/:id', basicAuth, async (request, response) => {
    const id = request.params.id;
    try {
        const isDeleted = await messageService.deleteMessage(id);
        response.sendStatus(200);
    }catch(e) {
        response.sendStatus(400);
    }
});

v1.put('/message/:id', basicAuth, async (request, response) => {
    const id = request.params.id;
    const message = request.body;
    if(!MessageService.isMessageValid(message))
        return response.sendStatus(400);
        
    try {
        const result = await messageService.updateMessage(message, id);
        if(!result.isFind) return response.sendStatus(404);
        result.isModified ? response.sendStatus(200) : response.sendStatus(304);
    }catch(e) {
        console.log('error occurs : ', e);
        response.sendStatus(400);
    }
});

const multer = require('multer');
//on specifie un dossier, sur le serveur, ou recevoir les fichier envoyes par POST
const upload = multer({ dest: 'data/upload/' });

v1.post('/file', upload.single('myFile'), async (request, response) => {
    //console.log(request.file);
    //response.sendStatus(200);
    try{
        await fileService.saveFileInfos(request.file);
        response.sendStatus(200);
    } catch(error) {
        response.sendStatus(500);
    }

});

v1.get('/files', async(request, response) => {
    try{
        const filesInfo = await fileService.getFilesInfo();
        response.send(filesInfo);
    } catch(e) {
        console.log('error ocurs ', e)
        response.sendStatus(500);
    }
});

// id == id en base de donnees
v1.get('/file/:id', async(request, response) => {
    const id = request.params.id;
    try{
        const fileResult = await fileService.getFile(id);
        if (fileResult) {
            response.setHeader(
                'Content-disposition', 
                'attachment; filename=' + fileResult.fileInfo['original-name']
                );
                response.setHeader('Content-type', fileResult.fileInfo['mime-type']);
                response.setHeader('Content-length', fileResult.fileInfo.size);
                //on  envoit le flux du fichier
                fileResult.file.pipe(response);
        } else 
            response.sendStatus(404);
    } catch(e) {
        console.log('error ocurs ', e)
        response.sendStatus(500);
    }
});

app.listen(3000, () => {
    console.log('Server listening in port 3000!');
});