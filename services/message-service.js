/* 
    Équivalent de :

    const MongoClient = require('mongodb').MongoClient;
    const ObjectID = require('mongodb').ObjectID;
*/

const { MongoClient, ObjectID} = require('mongodb');

module.exports = class MessageService {

    // Retourne une connection, qu'il faudra fermer à chaque fois
    getConnectedClient(){
        const client = new MongoClient(
            process.env.MONGO_CONNECTION_URL,
            { useNewUrlParser: true, useUnifiedTopology: true}
        );
        return client.connect();
    }

    async createMessage(message){
        // TODO
        const client = await this.getConnectedClient();

        const collection = client.db(process.env.MONGO_DB).collection('messages');
        const insertedMessage = await collection.insertOne(message);

        // somth

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

        const quote = await collection.findOne({
            _id: ObjectID(id)
        });

        await client.close();

        return quote;

    }
}
