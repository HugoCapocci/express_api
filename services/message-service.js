
const { MongoClient, objectID } = require('mongodb');


module.exports = class MessageService {
    getConnectedClient(){
        const client = new MongoClient(
            process.env.MONGO_CONNECTION_URL,
            { useNewUrlParser: true }
        );
        return client.connect();
    }


}


