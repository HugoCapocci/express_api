const {MongoClient, ObjectId} = require('mongodb');
module.exports = class MessageService {

    getConnectedClient() {
        console.log(process.env.MONGO_CONNECTION_URL);
        const client = new MongoClient(
            process.env.MONGO_CONNECTION_URL,
            {useNewUrlParser: true, useUnifiedTopology: true}
        );
        return client.connect();
    }

    createMessage(message){
        //TODO !
        const client = this.getConnectedClient();

        //smth

        client.close();
    }
};
