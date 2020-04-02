// const {a} = require('libA') <=> const a = require('libA').a
const { MongoClient, ObjectId } = require('mongodb');

console.log('process.env.MONGO_CONNECTION_URL? ', process.env.MONGO_CONNECTION_URL);

module.exports = class MessageService{

    // retourne une connection, qu'il faudra fermer a chaque fois
    getConnectedClient() {
        const client = new MongoClient(
            process.env.MONGO_CONNECTION_URL,
            { useNewUrlParser: true , useUnifiedTopology: true}
        );
        return client.connect();
    }

    async createMessage(message){
        // TODO
        const client = await this.getConnectedClient();

        const collection = client.db(process.env.MONGO_DB).collection('messages');
        const insertedMessage = await collection.insertOne(message);

        //
        await client.close();

        return insertedMessage;

    }
}


// client.connect().then(function () {
//     console.log('connection ok');
// }).catch(function (err) {
//     console.log('confection fail ', err)
// })
