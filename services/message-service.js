require('dotenv').config();
const { MongoClient, ObjectID } = require('mongodb');

module.exports = class MessageService {
  getConnectedClient() {
    const client = new MongoClient(process.env.MONGO_CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return client.connect();
  }

  createMessenger(message) {
    const client = this.getConnectedClient();
    client.close();
  }
};
