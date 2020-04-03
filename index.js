const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

//On instacie un MessageService pour la gestion des messages
const MessageService = require('./services/message-service');

const fs = require('fs').promises;
const app = express();
const v1 = express.Router();

//On instacie un FileService pour la gestion des fichiers
const FileService = require('./services/file-service');
const fileService = new FileService();

//For Basic Auth gestiure
const basicAuth = require('./middleware/basic-auth').basicAuth;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1', v1);

//Listing function
v1.get('/message', async (request, response) => {
    //const quotes = await fs.readFile('./data/quotes.json')
    response.send(await MessageService.list());
});

//Details function
v1.get('/message/:id', async (request, response) => {
    const id = request.params.id;

    try {
        const myQuote = await MessageService.details(id);

        myQuote ? response.send(myQuote) : response.sendStatus(404);
    } catch{
        response.sendStatus(400);
    }

});

//Creating function
v1.post('/message', basicAuth, async (request, response) => {
    const message = request.body;
    console.log('message reçu !');

    const isValid = message.quote && message.quote.length > 0
        && message.author && message.author.length > 0;

    if (!isValid) {
        response.sendStatus(400);
    }

    const createdMessage = await MessageService.create(message);
    response.send(createdMessage);
});

//Deleting function
v1.delete('/message/:id', basicAuth, async (req, res) => {
    const id = req.params.id;

    try {
        const isDeleted = await MessageService.delete(id);

        isDeleted ? res.sendStatus(204) : res.sendStatus(404)
    } catch{
        response.sendStatus(400);
    }
});

//Update function
v1.put('/message/:id', basicAuth, async (req, res) => {
    const id = req.params.id;
    const message = req.body;

    const updatedMessage = await MessageService.update(id, message);

    res.send(updatedMessage);
});

//Multer for manipulating posted files
const multer = require('multer');
//on spécifie un dossier ou recevoir les fichiers 
const upload = multer({ dest: 'data/upload/' });

//Create the file reference in database
v1.post('/file', upload.single('myFile'), async (req, res) => {
    console.log('Entering Savinf function');
    try {
        await fileService.saveFileInfo(req.file);
        res.sendStatus(200);
    } catch (error) {
        console.log('entering catch');
        res.sendStatus(500);
    }

});

//Listing files function
v1.get('/file', async (req, res) => {
    console.log('Entering get method');
    try {
        const filesInfo = await fileService.list();
        res.send(filesInfo);
    } catch (error) {
        console.log('error :', error);
        res.sendStatus(500);
    }
});

//Return document passed in reference
v1.get('/file/:id', async (req, res) => {
    console.log('Entering file details function');
    const id = req.params.id;
    try {
        const fileResult = await fileService.getFile(id);
        if(fileResult){
            res.setHeader(
                'Content-disposition',
                'attachement; filename=' + fileResult.fileInfo['original-name']
                );
            res.setHeader('Content-type', fileResult.fileInfo['mime-type']);
            res.setHeader('Content-length', fileResult.fileInfo.size);
            //on envoie le flux du fichier
            fileResult.file.pipe(res);
            //res.send(200);
        }else{
            res.sendStatus(404);
        }
        
    } catch (error) {
        console.log('error: ', error);
        res.sendStatus(500);
    }
})

//Delete file method
v1.delete('/file/:id', (req, res) => {

})

app.listen(3000, () => {
    console.log('server listenig on port 3000');
})