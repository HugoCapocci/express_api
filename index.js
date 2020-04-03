const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs").promises;
const app = express();
const v1 = express.Router();
require("dotenv").config();
const multer = require('multer');
//on specifie un dossier, sur le serveur, ou recevoir les fichier envoyes par POST
const upload = multer({ dest: 'data/upload/' });
const basicAuth = require("./middleware/basic-auth").basicAuth;
const MessageService = require("./services/message-service");
const messageService = new MessageService();
const FileService = require("./services/file-service")
const fileService = new FileService();

// toujours garder bodyParser en premier dans les appels à use()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api/v1", v1);

// request : requette HTTP (reçu du client)
// response : response HTTP (à envoyer au client, en retour)
/*v1.get("/message", async (request, response) => {
  const quotes = await fs.readFile("./data/quotes.json");
  response.send(JSON.parse(quotes));
});*/

/*v1.get("/message/:id", async (request, response) => {
  const quotes = await fs.readFile("./data/quotes.json");
  const quoteArray = JSON.parse(quotes);

  // recupérer la citation qui correspond à l'id transmis
  const id = request.params.id;
  const quote = quoteArray.find(function(currentQuote) {
    return currentQuote.id == id;
  });

  // ternaire
  quote ? response.send(quote) : response.sendStatus(404);
});*/

v1.post("/message", basicAuth, async (request, response) => {
  const message = request.body;

  // un message  est valide si il a un auteur et une citation
  const isValid =
    message.quote &&
    message.quote.length > 0 &&
    message.author &&
    message.author.length > 0;

  if (!isValid) return response.sendStatus(400);

  // on sauvegarde dans mongo!
  const createdMessage = await messageService.createMessage(message);

  response.send(createdMessage);
});

v1.get("/message", async (request, response) => {
  const quotes = await messageService.getMessages();
  response.send(quotes);
});
v1.get("/message/:id", async (request, response) => {
  const id = request.params.id;
  try {
    const message = await messageService.getMessage(id);

    // ternaire
    message ? response.send(message) : response.sendStatus(404);
  } catch (e) {
    response.sendStatus(400);
  }
});
v1.post("/message/:id", basicAuth, async (request, response) => {});
app.listen(3000, () => {
  console.log("Server listening on port 3000!");
});
v1.delete("/message/:id", basicAuth, async (request, response) => {
  const id = request.params.id;
  try {
    const isDeleted = await messageService.deleteMessage(id);
    isDeleted ? response.sendStatus(204) : response.sendStatus(404);
  } catch (e) {
    response.sendStatus(400);
  }
});
v1.put('/message/:id',basicAuth,  async (request, response) => {

    const message = request.body;
    const id = request.params.id;
    if(!MessageService.isMessageValid(message)) return response.sendStatus(400);
    try{
        const result = await messageService.updateMessage(message,id);
        result.isFind ? response.sendStatus(200) : response.sendStatus(404);
    }
    catch(e){
        console.log('error occurs:',e);
        response.sendStatus(400);
    }
});


v1.post('/file', upload.single('myFile'),async (request, response) => {
  //console.log(request.file);
  try{
  await fileService.saveFileInfos(request.file);
  response.sendStatus(200);
  }
  catch (error){
    response.sendStatus(500);
  }
});

v1.get('/file',async (request, response) => {
  
  try{
    const filesInfo = await fileService.getFileInfos();
    response.send(filesInfo);
  }
  catch (error){
    console.log(error);
    response.sendStatus(500);

  }
});

//id en base de donnée !
v1.get('/file/:id',async (request, response) => {
  const id = request.params.id;  
  try{
    const fileResult = await fileService.getFile(id);
    if(fileResult){
      response.setHeader(
        'Content-disposition', 
        'attachment: filename' + fileResult.fileInfo['original-name']
      );
    response.setHeader('Content-type', fileResult.fileInfo['mime-type']);
    response.setHeader('Content-length', fileResult.fileInfo.size);
    fileResult.file.pipe(response);
    }else response.sendStatus(404);
  }
  catch (error){
    console.log(error);
    response.sendStatus(500);

  }
});

app.listen(3001, () => {
    console.log('Server listening in port 3000!');
});