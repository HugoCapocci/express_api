const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const app = express();
const v1 = express.Router();

const MessageService = require('./services/message-service');
const messageService = new MessageService();
const FileService = require('./services/file-service');
const fileService = new FileService();

const { basicAuth } = require('./middleware/basic-auth');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api/v1', v1);

v1.get('/message', async (request, response) => {
    // let quotes = await fs.readFile('./data/quotes.json');

    let quotes = await messageService.getMessages();
    response.send(quotes);
});

v1.get('/message/:id', async (request, response) => {
    let id = request.params.id;
    // let quotes = await fs.readFile('./data/quotes.json');
    // let quote = JSON.parse(quotes).find(quote => quote.id == id);

    try {
        let quote = await messageService.getMessage(id);
        response.send(quote)
    } catch (error) {
        response.sendStatus(400);
    }
});


v1.post('/message', basicAuth, async (request, response) => {
    let message = request.body;


    if (!MessageService.isMessageValid(message)) return response.sendStatus(400);

    console.log('here');

    let createdMessage = await messageService.createMessage(message);

    // let quotes = await fs.readFile('./data/quotes.json');
    // if(!quotes) return response.sendStatus(500);

    // let quoteArray = JSON.parse(quotes);
    // quoteArray.sort((a, b) => b.id - a.id);

    // message.id = quoteArray[0].id +1;
    response.send(createdMessage);


});

v1.delete('/message/:id', basicAuth, async (request, response) => {
    let id = request.params.id;
    try {
        let isDeleted = await messageService.deleteMessage(id);
        isDeleted ? response.sendStatus(200) : response.sendStatus(404);
    } catch (error) {
        response.sendStatus(400);
    }


});

v1.put('/message/:id', basicAuth, async (request, response) => {
    let id = request.params.id;
    let message = request.body;
    if (!MessageService.isMessageValid(message)) return response.sendStatus(400);
    try {
        let res = await messageService.updateMessage(message, id);

        if (res.isFind) return response.sendStatus(404);
        res.isModified ? response.sendStatus(200) : response.sendStatus(404);
    } catch (error) {
        response.sendStatus(400);
    }


});

const multer = require('multer');
const upload = multer({ dest: 'data/upload/' });
v1.post('/file', upload.single('myFile'), async (request, response) => {
    try {
        await fileService.saveFileInfos(request.file);
        response.sendStatus(200);
    } catch (error) {
        response.sendStatus(500);
    }

});

v1.get('/file', async (request, response) => {
    try {
        let filesInfo = await fileService.getFilesInfo();
        response.send(filesInfo);
    } catch (error) {
        response.sendStatus(500);
    }
});

v1.get('/file/:id', async (request, response) => {
    let id = request.params.id;
    try {
        let fileResult = await fileService.getFile(id);
        if (fileResult) {
            response.setHeader(
                'Content-disposition',
                'attachment; filename=' + fileResult.fileInfo['original-name']
            );
            response.setHeader(
                'Content-length',
                fileResult.fileInfo.size
            );
            response.setHeader(
                'Content-type', fileResult.fileInfo['mime-type']
            );
            fileResult.file.pipe(response);
            response.sendStatus(200);
        } else {
            response.sendStatus(404)
        }
    } catch (error) {
        response.sendStatus(500);
    }
});


app.listen(3000, () => {
    console.log('Server listening on port 3000 !');
});