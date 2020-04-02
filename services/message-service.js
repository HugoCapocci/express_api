const { MongoClient, ObjectID } = require('mongodb');

/* const client = new MongoClient(
    process.env.MONGO_CONNECTION_URL, 
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true 
    }
);

client.connect()
.then(function() {
    console.log('connection OK');
})
.catch(function(error) {
    console.log('connection failed ', error);
}); */

module.exports = class MessageService  {
    // retourne une connexion qu'il faudra fermer à chaque fois
    getConnectedClient() {
        const client = new MongoClient(
            process.env.MONGO_CONNECTION_URL,
            { useNewUrlParser: true, useUnifiedTopology: true }
        );

        return client.connect();
    }

    async createMessage(message) {
        const client = await this.getConnectedClient();

        const collection = client.db(process.env.MONGO_DB).collection('messages');
        const insertedMessage = await collection.insertOne(message);

        await client.close();

        return insertedMessage;
    }
}