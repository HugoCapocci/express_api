
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

    async createMessage(message){
        
        const client = await this.getConnectedClient();

        let collection = client.db(process.env.MONGO_DB).collection('messages');
        let insertedMessage = await collection.insertOne(message);
        await client.close();

        return insertedMessage;
    }

    async getMessages(){
        
        const client = await this.getConnectedClient();

        let collection = client.db(process.env.MONGO_DB).collection('messages');
        let quotes = await collection.find({}).toArray();
        await client.close();

        return quotes;
    }


    async getMessage(id){
        const client = await this.getConnectedClient();

        let collection = client.db(process.env.MONGO_DB).collection('messages');
        let quote = await collection.findOne({_id : ObjectID(id)});
        await client.close();

        return quote;
    }

    async deleteMessage(id){
        
        
        const client = await this.getConnectedClient();

        let collection = client.db(process.env.MONGO_DB).collection('messages');
        let res = await collection.deleteOne({_id : ObjectID(id)});

        await client.close();

        return res.deletedCount === 1;
    }
}


// client.connect().then(() => {
//     console.log('connection ok');
    
// }).catch((error) => {
//     console.log('connection failed ', error);
    
// })