const {MongoClient, ObjectID} = require('mongodb');

module.exports = class MessageService {

    // retourne une connection, qu'il faudra fermer à chaque fois
    static getConnectedClient() {
        console.log("MONGO_CONNECTION_URL ",process.env.MONGO_CONNECTION_URL);
        const client = new MongoClient(
            process.env.MONGO_CONNECTION_URL,
            { useNewUrlParser: true, useUnifiedTopology: true }
        ); 
        
        return client.connect();
    }

    static async createMessage(message) {
        const client = await this.getConnectedClient();

        const collection = client.db(process.env.MONGO_DB).collection('messages');
        const insertedMessage = await collection.insertOne(message);

        await client.close();

        return insertedMessage;
    }

}