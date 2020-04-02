const { MongoClient, ObjectId } = require("mongodb");

module.exports = class MessageService {
  getConnectedClient() {
    const client = new MongoClient(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    return client.connect();
  }

  async createMessage(message) {
    const client = await this.getConnectedClient();
    const collection = client
      .db(process.env.DATABASE_NAME)
      .collection("messages");

    const insertedMessage = await collection.insertOne(message);

    await client.close();

    return insertedMessage;
  }

  async getMessages() {
    const client = await this.getConnectedClient();
    const collection = client
      .db(process.env.DATABASE_NAME)
      .collection("messages");

    const quotes = await collection.find({}).toArray();

    await client.close();

    return quotes;
  }

  async getMessage(id) {
    const client = await this.getConnectedClient();
    const collection = client
      .db(process.env.DATABASE_NAME)
      .collection("messages");

    const quote = await collection.findOne({ _id: ObjectId(id) });

    await client.close();

    return quote;
  }
};
