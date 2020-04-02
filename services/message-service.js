const { MongoClient } = require("mongodb");

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
};
