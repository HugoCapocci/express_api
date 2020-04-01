/*
    const MongoClient = require('mongodb').MongoClient;
    const ObjectID = require('mongodb').ObjectID;
*/

const { MongoClient, ObjectID } = require('mongodb'); 

module.exports = class MessageService {

    // retourne une connection qu'il faudra fermer à chaque fois
    getConnectedClient() {
        const client = new MongoClient(
            process.env.MONGO_CONNECTION_URL,
            { useNewUrlParser: true, useUnifiedTopology: true }
        );

        return client.connect();
    }

    createMessage(message) {
        const client = this.getConnectedClient();

        client.close();
    }

};