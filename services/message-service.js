const {MongoClient, ObjectId} = require('mongodb');
module.exports = class MessageService {

    getConnectedClient() {
        console.log(process.env.MONGO_CONNECTION_URL);
        const client = new MongoClient(
            process.env.MONGO_CONNECTION_URL,
            {useNewUrlParser: true, useUnifiedTopology: true}
        );
        return client.connect();
    }

    async createMessage(message){

        const client = await this.getConnectedClient();
        const collection = client.db(process.env.MONGO_DB).collection('messages');

        const insertedMessage = await collection.insertOne(message);
        client.close();
        return insertedMessage;
    }
};
