require('dotenv').config()
/*
 * equivalent de :yarn add env
   const MongoClient = require('mongodb').MongoClient;
   const ObjectID = require('mongodb').ObjectID;
 */

const { MongoClient, ObjectID } = require('mongodb');

console.log('process.env.MONGO_CONNECTION_URL?', process.env.MONGO_CONNECTION_URL);

/*
const client =new MongoClient(
    process.env.MONGO_CONNECTION_URL,
    { useNewUrlParser: true, useUnifiedTopology: true }
);

client.connect()
.then(function() {
    console.log('connection OK');
})
.catch(function(error) {
    console.log('console failed', error);
});

*/

module.exports = class MessageService {

    static isMessageValid(message) {
        return message.quote && message.quote.length > 0 && message.author && message.author.length > 0;
    }

    //
    getConnectedClient() {
        const client = new MongoClient(
            process.env.MONGO_CONNECTION_URL,
            { useNewUrlParser: true, useUnifiedTopology: true }
        );

        return client.connect(); 
    }

    //create a data
    async createMessage(message) {
        const client = await this.getConnectedClient();

        const collection = client.db(process.env.MONGO_DB).collection('messages');
        const insertedMessage = await collection.insertOne(message);

        await client.close();
        return insertedMessage;
    }

    //get all data
    async getMessages() {
        //
        const client = await this.getConnectedClient();
        const collection = client.db(process.env.MONGO_DB).collection('messages');
        const quotes = await collection.find({}).toArray();
        await client.close();
        return quotes;
    }

    //get 1 data from id
    async getMessage(id) {
        const client = await this.getConnectedClient();
        const collection = client.db(process.env.MONGO_DB).collection('messages');
        const message = await collection.findOne({
            _id: ObjectID(id)
        });
        await client.close();
        return message;
    }

    //delete, delete a data
    async deleteMessage(id) {
        const client = await this.getConnectedClient();
        const collection = client.db(process.env.MONGO_DB).collection('messages');

        const result = await collection.deleteOne({
            _id: ObjectID(id)
        })
        await client.close();
        return result.deletedCount === 1;
    }

    //put, update a data
    async updateMessage(message, id) {
        const client = await this.getConnectedClient();
        const collection = client.db(process.env.MONGO_DB).collection('messages');

        const query = {
            _id: ObjectID(id)
        };
        const updateQuery = {
            $set: message
        };
        const result = await collection.updateOne(query, updateQuery)

        await client.close();

        return {
            isFind: result.matchedCount == 1,
            isModified: result.modifiedCount == 1
        }
    }
}