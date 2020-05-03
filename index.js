const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const v1 = express.Router();
require('dotenv').config();
const multer = require('multer');
//on spécifie un dossier, sur le serveur, ou recevoir les fichier envoyés par POST
const upload = multer({ dest: 'data/upload/' });
const basicAuth = require('./middleware/basic-auth').basicAuth;
const MessageService = require('./services/message-service');
const messageService = new MessageService();
const FileService = require('./services/file-service');
const fileService = new FileService();

// log fileService et FileService si error

// toujours garder bodyParser en premier dans les appels à use()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1', v1);

// request : requette HTTP (reçu du client)
// response : response HTTP (à envoyer au client, en retour)
v1.get('/message', async (request, response) => {
    const quotes = await messageService.getMessages();
    response.send(quotes);
});

v1.get('/message/:id', async (request, response) => {
    // recupérer la citation qui correspond à l'id transmis
    const id = request.params.id;
    try {
        const message = await messageService.getMessage(id);
        // ternaire
        message ? response.send(message) : response.sendStatus(404);
    } catch(e) {
        response.sendStatus(400);
    }
});

v1.post('/message', basicAuth, async (request, response) => {
    const message = request.body;
    
    if (!MessageService.isMessageValid(message)) return response.sendStatus(400);

    // on sauvegarde dans mongo!
    const createdMessage = await messageService.createMessage(message);
    response.send(createdMessage); // 201
});

v1.delete('/message/:id', basicAuth, async (request, response) => {
    const id = request.params.id;
    try {
        const isDeleted = await messageService.deleteMessage(id);
        isDeleted ? response.sendStatus(204) : response.sendStatus(404);
    } catch(e) {
        response.sendStatus(400);
    }
});

v1.put('/message/:id', basicAuth, async (request, response) => {
    const id = request.params.id;
    const message = request.body;
    if (!MessageService.isMessageValid(message))
        return response.sendStatus(400);

    try {
        const result = await messageService.updateMessage(message, id);
        if(!result.isFind) return response.sendStatus(404);
        // 304 ou 202... 3xx correspond normalement à une redirection
        result.isModified ? response.sendStatus(200) : response.sendStatus(304);
    } catch(e) {
        console.log('error occurs : ', e);
        response.sendStatus(400);
    }
});

v1.post('/file', upload.single('myFile'), async (request, response) => {
    try {
        await fileService.saveFileInfos(request.file);
        response.sendStatus(200);
    } catch(e) {
        response.sendStatus(500);
    }
});

v1.get('/file', async (request, response) => {
    try {
        const filesInfo = await fileService.getFilesInfo();
        response.send(filesInfo);
    } catch(e) {
        console.log('error ocurs ', e);
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
            // on envoit le flux du fichier
            fileResult.file.pipe(response);
        } else
            response.sendStatus(404);
    } catch(e) {
        console.log('error ocurs ', e);
        response.sendStatus(500);
    }
});

v1.delete('/file/:id', async (request, response) => {
    const id = request.params.id;
    try {
        const isDeleted = await fileService.deleteFile(parseInt(id));
        isDeleted ? response.sendStatus(204) : response.sendStatus(404);
    } catch(e) {
        console.log('error ocurs ', e);
        response.sendStatus(500);
    }
});

app.listen(3000, () => {
    console.log('Server listening on port 3000!');
});
