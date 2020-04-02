require('dotenv').config();
//const {a}  = require('a'); = équivalent de  const {a] require ('a').a;
const {MongoClient, ObjectID} = require('mongodb');

module.exports = class MethodService {
    getConnectedClient() {
        const client = new MongoClient(
            process.env.MONGO_CONNECTION_URL,
            {urlNewParser: true, useUnifiedTopology: true}
        );
        return client.connect();
        /*client.connect().then(function () {
                    console.log("connection OK");
                }).catch(function (error) {
                    console.log('connection failed', error);
                });*/
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
        const quotes = await collection.find({}).toArray();
        await client.close();
        return quotes;
    }

    async getMessage(id) {
        const client = await this.getConnectedClient();
        const collection = client.db(process.env.MONGO_DB).collection('messages');
        const message = await collection.findOne({
            _id: new ObjectID(id)
        });
        await client.close();
        return message;
    }

    async deleteMessage(id) {
        const client = await this.getConnectedClient();
        const collection = client.db(process.env.MONGO_DB).collection('messages');
        const result = await collection.deleteOne({
            _id: ObjectID(id)
        });
        await client.close();
        return result.deletedCount === 1;
    }
};

