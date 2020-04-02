const {MongoClient, ObjectId} = require('mongodb');
module.exports = class MessageService {

    getConnectedClient() {
        const client = new MongoClient(
            process.env.MONGO_CONNECTION_URL,
            {useNewUrlParser: true, useUnifiedTopology: true}
        );
        return client.connect();
    }

    async createMessage(message) {

        const client = await this.getConnectedClient();
        const collection = client.db(process.env.MONGO_DB).collection('messages');

        const insertedMessage = await collection.insertOne(message);
        //toujours fermer la connexion au client quand on a fini !
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
        const message = await collection.findOne({_id: ObjectId(id)});
        await client.close();
        return message;
    }

    async deleteMessage(id){
        const client = await this.getConnectedClient();
        const collection = client.db(process.env.MONGO_DB).collection('messages');
        const result = await collection.deleteOne({_id: ObjectId(id)});
        await client.close();
        return result.deletedCount === 1;
    }
};
