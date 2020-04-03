const express = require("express");
const bodyParser = require("body-parser");
const basicAuth = require("./middleware/basic-auth").basicAuth;
const MessageService = require("./services/message-service");
const FileService = require("./services/file-service");
require("dotenv").config();

const app = express();
const v1 = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/v1", v1);

const messageService = new MessageService();
const fileService = new FileService();

v1.get("/message", async (request, response) => {
  const quotes = await messageService.getMessages();

  response.send(quotes);
});

v1.get("/message/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const quote = await messageService.getMessage(id);

    if (!quote) {
      response.sendStatus(404);
    } else {
      response.send(quote);
    }
  } catch (error) {
    response.sendStatus(400);
  }
});

v1.post("/message", basicAuth, async (request, response) => {
  const message = request.body;

  const isValid = MessageService.isMessageValid(message);

  if (!isValid) return response.sendStatus(400);

  const createdMessage = await messageService.createMessage(message);
  response.send(createdMessage);
});

v1.put("/message/:id", basicAuth, async (request, response) => {
  try {
    const id = request.params.id;
    const message = request.body;

    const isValid = MessageService.isMessageValid(message);
    if (!isValid) return response.sendStatus(400);

    const updatedMessage = await messageService.updateMessage(id, message);

    if (!updatedMessage.isFind) return response.sendStatus(404);
    updatedMessage.isModified ? response.send(200) : response.sendStatus(304);
  } catch (error) {
    response.sendStatus(400);
  }
});

v1.delete("/message/:id", basicAuth, async (request, response) => {
  try {
    const id = request.params.id;
    const isDeleted = await messageService.deleteMessage(id);

    if (isDeleted) {
      response.sendStatus(204);
    } else {
      response.send(404);
    }
  } catch (error) {
    response.sendStatus(400);
  }
});

const multer = require("multer");
const upload = multer({ dest: "data/upload" });

v1.post("/file", upload.single("myFile"), async (request, response) => {
  try {
    await fileService.saveFileInfo(request.file);
    response.send(201);
  } catch (error) {
    response.sendStatus(500);
  }
});

v1.get("/file", async (request, response) => {
  try {
    const files = await fileService.getFilesInfo();
    response.send(files);
  } catch (error) {
    response.sendStatus(500);
  }
});

v1.get("/file/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const fileResult = await fileService.getFileInfo(id);

    if (fileResult) {
      response.setHeader(
        "Content-disposition",
        `attachment; filename=${fileResult.fileInfo["original-name"]}`
      );
      response.setHeader("Content-type", fileResult.fileInfo["mime-type"]);
      response.setHeader("Content-length", fileResult.fileInfo["size"]);
      fileResult.fileByte.pipe(response);
    } else {
      response.sendStatus(404);
    }
  } catch (error) {
    response.sendStatus(500);
  }
});

app.listen(3000, () => {
  console.log("Server listening…");
});
