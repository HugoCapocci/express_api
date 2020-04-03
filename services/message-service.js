require('dotenv').config();
const { MongoClient, ObjectID } = require('mongodb');

module.exports = class MessageService {
  static isMessageValid(message) {
    return (
      message.quote &&
      message.quote.length > 0 &&
      message.author &&
      message.author.length > 0
    );
  }

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

  async updateMessage(message, id) {
    const client = await this.getConnectedClient();
    const collection = client.db(process.env.MONGO_DB).collection('messages');

    const query = {
      _id: ObjectID(id),
    };

    const updateQuery = {
      $set: message,
    };

    const updatedMessage = await collection.updateOne(query, updateQuery);
    await client.close();

    return {
      isFind: updatedMessage.matchedCount === 1,
      isModified: updatedMessage.modifiedCount === 1,
    };
  }

  async deleteMessage(id) {
    const client = await this.getConnectedClient();
    const collection = client.db(process.env.MONGO_DB).collection('messages');
    const deletedMessage = await collection.deleteOne({ _id: ObjectID(id) });
    await client.close();

    return deletedMessage.deletedCount === 1;
  }
};
