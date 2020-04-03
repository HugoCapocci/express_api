require('dotenv').config();
//const {a}  = require('a'); = équivalent de  const {a] require ('a').a;
const {MongoClient, ObjectID} = require('mongodb');

module.exports = class MethodService {

    static isMessageValid(message) {
        return message.quote && message.quote.length > 0
            && message.author && message.author.length > 0;
    }

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

    async updateMessage(message, id) {
        const client = await this.getConnectedClient();
        const collection = client.db(process.env.MONGO_DB).collection('messages');
        const query = {
            _id: ObjectID(id)
        };
        const updateQuery = {
            $set: message
        };
        const result = await collection.updateOne(query, updateQuery);
        await client.close();
        return {
            isFind: result.matchedCount === 1,
            isModified: result.modifiedCount === 1
        }
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

