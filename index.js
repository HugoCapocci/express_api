const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const app = express();
const v1 = express.Router();
require('dotenv').config();

const basicAuth = require('./middleware/basic-auth').basicAuth;
const MessageService = require('./services/message-service');
const messageService = new MessageService();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/api/v1', v1);

//GET ALL
v1.get('/messages', async (request, response) => {
    const quotes = await messageService.getMessages();
    response.send(quotes);
});

//GET BY ID
v1.get('/messages/:id', async (request, response) => {
    const id = request.params.id;
    try {
        const message = await messageService.getMessage(id);
        message ? response.send(message) : response.sendStatus(404);
    }catch (e) {
        response.sendStatus(400);
    }
});

//POST
v1.post('/message', basicAuth, async (request, response) => {
    const message = request.body;

    if (!MessageService.isMessageValid(message)) return response.sendStatus(400);
    //on sauvegarde dans mongo
    const createMessage = await messageService.createMessage(message);
});

v1.delete('/message/:id', basicAuth, async (request, response) => {
    try {
        const isDeleted = await messageService.deleteMessage(request.params.id);
        isDeleted ? response.sendStatus(200) : response.sendStatus(404);
    }catch (e) {
        response.sendStatus(400);
    }
});

v1.put('/message/:id', basicAuth, async (request, response) => {
    const message = request.body;
    const id = request.params.id;

    if (!MessageService.isMessageValid(message)) return response.sendStatus(400);
    try{
        const result = await messageService.updateMessage(message, id);
        if(!result.isFind) return response.sendStatus(404);
        result.isModified ? response.sendStatus(200) : response.sendStatus(304);
        response.sendStatus(200)
    }catch (e) {
        console.log('error occurs : ', e);
        response.sendStatus(400)
    }
});

const multer = require('multer');
const upload = multer({dest: 'data/upload/'});

v1.post('/file', upload.single('myFile'), async (request, response) => {
    try {
        await fileService.saveFileInfos(request.file);
        response.sendStatus(200);
    } catch (e) {
        response.sendStatus(500);
    }
});

v1.get('/file', async (request, response) => {
    try {
        const filesInfo = await fileService.getFilesInfo();
        response.send(filesInfo);
    } catch (e) {
        console.log('error occurs:', e);
        response.sendStatus(500);
    }
});

// id == id en base de données !
v1.get('/file/:id', async (request, response) => {
    const id = request.params.id;
    try {
        const fileResult = await fileService.getFile(id);
        if (fileResult) {
            response.setHeader(
                'Content-disposition',
                'attachment; filename=' + fileResult.fileInfo['original-name']
            );
            response.setHeader('Content-type', fileResult.fileInfo['mime-type']);
            response.setHeader('Content-length', fileResult.fileInfo.size);
            //on envoie le flux du fichier
            fileResult.file.pipe(response);
        } else {
            response.sendStatus(404);
        }
    } catch (e) {
        console.log('error occurs:', e);
        response.sendStatus(500);
    }
});

v1.delete('/file/:id', async (request, response) => {
    const id = request.params.id;
    try{
        await fileService.deleteFile(id);
        //a compléter
        response.sendStatus(200);
    }
    catch (e) {
        console.log('error occurs: ', error);
        response.sendStatus(500);
    }
});


app.listen(3000, () => {
    console.log('Server listening on port 3000!')
});
