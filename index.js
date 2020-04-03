const express = require('express');
const fs = require('fs').promises;
const bodyParser = require('body-parser');
const multer = require('multer');
require('dotenv').config();

const app = express();
const v1 = express.Router();
const port = process.env.PORT || 3000;
const basicAuth = require('./middleware/basic-auth').basicAuth;
const upload = multer({ dest: 'data/upload/' });
const MessageService = require('./services/message-service');
const messageService = new MessageService();
const FileService = require('./services/file-service');
const fileService = new FileService();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1', v1);

v1.get('/message', async (request, response) => {
  // const quotes = await fs.readFile('./data/quotes.json');
  // response.send(JSON.parse(quotes));
  const quotes = await messageService.getMessages();
  response.send(quotes);
});

v1.get('/message/:id', async (request, response) => {
  // let quotes = await fs.readFile('./data/quotes.json');
  // quotes = JSON.parse(quotes);
  // const message = quotes.find(
  //   quote => quote.id === parseInt(request.params.id),
  // );
  // !message ? response.sendStatus(404) : response.send(message);
  try {
    const message = await messageService.getMessage(request.params.id);
    !message ? response.sendStatus(404) : response.send(message);
  } catch (err) {
    response.sendStatus(400);
  }
});

v1.post('/message', basicAuth, async (request, response) => {
  const message = request.body;

  if (!MessageService.isMessageValid(request.body)) {
    return response.sendStatus(500);
  }

  const createdMessage = await messageService.createMessage(message);
  response.send(createdMessage);

  // let quotes = await fs.readFile('./data/quotes.json');
  // quotes = JSON.parse(quotes);
  // const ids = quotes.map(quote => quote.id);
  // message.id = Math.max.apply(null, ids) + 1;
  // response.send(message);
});

v1.delete('/message/:id', basicAuth, async (request, response) => {
  try {
    const deletedMessage = await messageService.deleteMessage(
      request.params.id,
    );
    response.sendStatus(deletedMessage ? 200 : 204);
  } catch (err) {
    response.sendStatus(400);
  }
});

v1.put('/message/:id', basicAuth, async (request, response) => {
  if (!MessageService.isMessageValid(request.body)) {
    return response.sendStatus(500);
  }
  try {
    const updatedMessage = await messageService.updateMessage(
      request.body,
      request.params.id,
    );
    if (!updatedMessage.isFind) {
      response.sendStatus(404);
    }
    response.sendStatus(updatedMessage.isModified ? 200 : 304);
  } catch (err) {
    response.sendStatus(400);
  }
});

v1.post('/file', upload.single('myFile'), async (request, response) => {
  try {
    await fileService.saveFileInfos(request.file);
    response.sendStatus(200);
  } catch (err) {
    response.sendStatus(500);
  }
});

v1.get('/file', async (request, response) => {
  try {
    const filesInfo = await fileService.getFilesInfo();
    response.send(filesInfo);
  } catch (err) {
    response.sendStatus(500);
  }
});

v1.get('/file/:id', async (request, response) => {
  try {
    const fileResult = await fileService.getFile(request.params.id);

    if (fileResult) {
      response.setHeader(
        'Content-disposition',
        'attachment; filename=' + fileResult.fileInfo['original-name'],
      );
      response.setHeader('Content-type', fileResult.fileInfo['mime-type']);
      response.setHeader('Content-length', fileResult.fileInfo.size);
      // on envoit le flux du fichier
      fileResult.file.pipe(response);
    } else {
      response.sendStatus(400);
    }
  } catch (err) {
    response.sendStatus(500);
  }
});

v1.delete('/file/:id', async (request, response) => {});
app.listen(port, () => console.log(`App listning on port ${port}`));

// {
// fieldname: 'myFile',
// originalname: 'attestation_navigo_hugo_capocci_novembre_2019.pdf',
// encoding: '7bit',
// mimetype: 'application/pdf',
// destination: 'data/upload/',
// filename: 'b12b264ed97c692e50fdf3917a1364a8',
// path: 'data/upload/b12b264ed97c692e50fdf3917a1364a8',
// size: 105393
// }
