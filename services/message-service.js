// const {a} = require('libA') <=> const a = require('libA').a
const { MongoClient, ObjectId } = require('mongodb');

// console.log('process.env.MONGO_CONNECTION_URL: ', process.env.MONGO_CONNECTION_URL);

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
    async getMessages(){
        // TODO
        const client = await this.getConnectedClient();
        const collection = client.db(process.env.MONGO_DB).collection('messages');
        const quotes = await collection.find({}).toArray();

        //
        await client.close();

        return quotes;
    }
    async getOneMessage(id){
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
}


// client.connect().then(function () {
//     console.log('connection ok');
// }).catch(function (err) {
//     console.log('confection fail ', err)
// })
