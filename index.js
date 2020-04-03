import express from 'express';

import multer from 'multer';
// specify a directory, on server, where received post files will go
const upload = multer({ dest: 'data/upload/' });

import basicAuth from './middlewares/basic-auth.js';

import MessageService from './services/message.js';
const messageService = new MessageService();

import FileService from './services/file.js';
const fileService = new FileService();

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const v1 = express.Router();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/v1', v1);

v1.get('/message', async (req, res) => {
    const quotes = await messageService.getMessages();
    res.send(quotes);
});

v1.get('/message/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const quote = await messageService.getMessage(id);
        res.send(quote);
    } catch (error) {
        res.sendStatus(400);
    }
});

v1.post('/message', basicAuth, async (req, res) => {
    const message = req.body;
    if (!MessageService.isMessageValid(message)) return res.sendStatus(400);
    const createdMessage = await messageService.createMessage(message);
    res.send(createdMessage);
});

v1.put('/message/:id', basicAuth, async (req, res) => {
    const id = req.params.id;
    const message = req.body;
    if (!MessageService.isMessageValid(message)) return res.sendStatus(400);
    try {
        const result = await messageService.updateMessage(id, message);
        if (!result.isFind) res.sendStatus(404);
        result.isModified ? res.sendStatus(200) : res.sendStatus(202);
    } catch (error) {
        res.sendStatus(400);
    }
});

v1.delete('/message/:id', basicAuth, async (req, res) => {
    const id = req.params.id;
    try {
        const isDeleted = await messageService.deleteMessage(id);
        isDeleted ? res.sendStatus(204) : res.sendStatus(404);
    } catch (error) {
        res.sendStatus(400);
    }
})

v1.post('/file', upload.single('myFile'), async (req, res) => {
    try {
        await fileService.saveFileInfo(req.file);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
});

v1.get('/file', async (req, res) => {
    try {
        const filesInfo = await fileService.getFilesInfo();
        res.send(filesInfo)
    } catch (error) {
        res.sendStatus(500);
    }
});

v1.get('/file/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const fileResult = await fileService.getFile(id);
        if (fileResult) {
            res.setHeader(
                'Content-disposition',
                `attachment; filename=${fileResult.fileInfo['original-name']}`
            )
            res.setHeader('Content-Type', fileResult.fileInfo['mime-type']);
            res.setHeader('Content-length', fileResult.fileInfo.size);
            //send file stream
            fileResult.file.pipe(res);
            // res.sendStatus(200);
        } else
            res.sendStatus(404);
    } catch (error) {
        res.sendStatus(500);
    }
});

app.listen(3000, () => {
    console.log('Server listening on port 3000!');
});