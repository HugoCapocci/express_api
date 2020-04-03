const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs').promises;
const app = express();
const v1 = express.Router();
const basicAuth = require('./middleware/basic-auth').basicAuth;
require('dotenv').config();
const MessageService = require('./services/message-service');
const messageService = new MessageService();
const FileService = require('./services/FileService');
const fileService = new FileService();

// toujours garder bodyParser en premier dans les appels à use()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1', v1);

// request : requette HTTP (reçu du client)
// response : réponse HTTP à envoyer, au clienten retour
v1.get('/message',async (request, response) => {
    // const quotes = await fs.readFile('./data/quotes.json');
    const quotes = await messageService.getMessages();
    // response.setHeader('content-type', 'application/json');
    response.send(quotes);
});

v1.get('/message/:id', async (request, response) => {
    // const quotes = await fs.readFile('./data/quotes.json');
    const id = request.params.id;
    try {
        const message = await messageService.getOneMessage(id);
        message ? response.send(message) : response.sendStatus(404);
    }
    catch (e) {
        response.sendStatus(400);
    }
});

// console.log('basicAuth ', basicAuth);
v1.post('/message', basicAuth, async (request, response) => {
    const message = request.body;
    // un message est valide si il a un auther et une citation
    console.log('message? ', message);

    const isValid = message.quote && message.quote.length > 0 && message.author && message.author.length > 0;
    // si pas valide
    if(!isValid) return response.sendStatus(400);

    // on sauvegarde dans mongo
    const createdMessage = await messageService.createMessage(message);
    response.send(createdMessage);
});

v1.delete('/message/:id', basicAuth, async (request, response) => {
    const id = request.params.id;
    try {
        const isDeleted = await  messageService.deleteMessage(id);
        isDeleted ? response.sendStatus(204) : response.sendStatus(404);
    }catch (e) {
        response.sendStatus(400);
    }
});

v1.put('/message/:id', basicAuth, async (request, response) => {
    const id = request.params.id;
    const message = request.body;
    console.log(id);
    console.log(message);
    if (!MessageService.isMessageValid(message)) return response.sendStatus(400);
    try {
        const result = await messageService.updateMessage(message, id);
        if (!result.isFind) return response.sendStatus(404);
        // 304 ou 202  3xx corespond a des redirections
        result.isModified ? response.sendStatus(200) : response.sendStatus(304);
        // ? response.sendStatus(200) : response.sendStatus(404);
    }
    catch (e) {
        console.log('error occured: ', e);
        response.sendStatus(400);
    }
});

const multer = require('multer');
// on spécifie un dossier sur le serveur ou on va recevoir les fichiers par POST
const upload = multer({dest: 'data/upload'});
v1.post('/file',upload.single('myFile') , (request, response) => {
    try {
        fileService.saveFileInfo(request.file);
        // console.log(request.file);
        response.sendStatus(200);
    }catch (e) {
        response.sendStatus(500);
    }

});

v1.get('/file', async (request, response) => {
    try {
        const filesInfo = await fileService.getFilesInfo();
        response.send(filesInfo);
    }catch (e) {
        console.log('erreurs : ', e);
        response.sendStatus(500);
    }
});


v1.get('/file/:id', async (request, response) => {
    const id = request.params.id;
    try {
        const fileResult = await fileService.getFile(id);
        // response.send(200);
        if (fileResult){
            response.setHeader('Content-disposition', 'attachement; filename=' + fileResult.fileInfo['original-name']);
            response.setHeader('Content-type', fileResult.fileInfo['mime-type']);
            response.setHeader('Content-length', fileResult.fileInfo.size);
            // on envoie el flux du fichier
            fileResult.file.pipe(response);
            response.sendStatus(200);
        }
        else{
            response.sendStatus(404);
        }
    }catch (e) {
        console.log('erreurs : ', e);
        response.sendStatus(500);
    }
});

app.listen(3000, () => {
    console.log('app is running on port 3000');
});
