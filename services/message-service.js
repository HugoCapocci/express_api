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

  async createMessage(message) {
    const client = await this.getConnectedClient();
    const collection = client.db(process.env.MONGO_DB).collection('messages');
    const insertedMessage = await collection.insertOne(message);
    await client.close();

    return insertedMessage;
  }

  async getMessages() {
    const client = await this.getConnectedClient();
    const collection = client.db(process.env.MONGO_DB).collection('messages');
    const messages = await collection.find({}).toArray();
    await client.close();

    return messages;
  }

  async getMessage(id) {
    const client = await this.getConnectedClient();
    const collection = client.db(process.env.MONGO_DB).collection('messages');
    const message = await collection.findOne({ _id: ObjectID(id) });
    await client.close();

    return message;
  }

  async deleteMessage(id) {
    const client = await this.getConnectedClient();
    const collection = client.db(process.env.MONGO_DB).collection('messages');
    const deletedMessage = await collection.deleteOne({ _id: ObjectID(id) });
    await client.close();

    return deletedMessage.deletedCount === 1;
  }
};
