
require('dotenv').config();
const { MongoClient, ObjectID } = require('mongodb');



module.exports = class MessageServie {
    getConnectedClient(){
        const client = new MongoClient(
            process.env.MONGO_CONNECTION_URL,
            { useNewUrlParser: true, useUnifiedTopology: true }
        );
        return client.connect();
    }

    createMessage(message){

        const client = this.getConnectedClient();

        client.close();
    }
}


// client.connect().then(() => {
//     console.log('connection ok');
    
// }).catch((error) => {
//     console.log('connection failed ', error);
    
// })