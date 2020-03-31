<<<<<<< HEAD

const { MongoClient, objectID } = require('mongodb');


module.exports = class MessageService {
    getConnectedClient(){
        const client = new MongoClient(
            process.env.MONGO_CONNECTION_URL,
            { useNewUrlParser: true }
        );
        return client.connect();
    }

=======
/*
équivalent de :

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
*/
const { MongoClient, ObjectID } = require('mongodb');

module.exports = class MessageService {

    // retourne une connection, qu'il faudra fermer à chaque fois
    getConnectedClient() {
        const client = new MongoClient(
            process.env.MONGO_CONNECTION_URL,
            { useNewUrlParser: true, useUnifiedTopology: true }
        ); 
        
        return client.connect();
    }

    createMessage(message) {
        // TODO !
    }
>>>>>>> upstream/master

}


