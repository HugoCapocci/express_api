
require('dotenv').config();
const { MongoClient, ObjectID } = require('mongodb');



module.exports = class MessageServie {
    getConnectedClient(){
        let client = new MongoClient(
            process.env.MONGO_CONNECTION_URL,
            { useNewUrlParser: true, useUnifiedTopology: true }
        );
        return client.connect();
    }

    static isMessageValid(message){
        return message.quote && message.quote.length > 0 && message.author && message.author.length > 0;
    }

    async createMessage(message){
        
        let client = await this.getConnectedClient();

        let collection = client.db(process.env.MONGO_DB).collection('messages');
        let insertedMessage = await collection.insertOne(message);
        await client.close();

        return insertedMessage;
    }

    async getMessages(){
        
        let client = await this.getConnectedClient();

        let collection = client.db(process.env.MONGO_DB).collection('messages');
        let quotes = await collection.find({}).toArray();
        await client.close();

        return quotes;
    }


    async getMessage(id){
        let client = await this.getConnectedClient();

        let collection = client.db(process.env.MONGO_DB).collection('messages');
        let quote = await collection.findOne({_id : ObjectID(id)});
        await client.close();

        return quote;
    }

    async deleteMessage(id){
        
        
        let client = await this.getConnectedClient();

        let collection = client.db(process.env.MONGO_DB).collection('messages');
        let res = await collection.deleteOne({_id : ObjectID(id)});

        await client.close();

        return res.deletedCount === 1;
    }

    async updateMessage(message, id){
        
        let client = await this.getConnectedClient();

        let collection = client.db(process.env.MONGO_DB).collection('messages');
        
        let query = {
            _id: ObjectID(id)
        };
        let updateQuery = {
            $set: message
        }
        let res = await collection.updateOne(query, updateQuery);

        await client.close();

        return{
            isFind: res.matchedCount == 1,
            isModified: res.modifiedCount == 1
        }
    }
}


// client.connect().then(() => {
//     console.log('connection ok');
    
// }).catch((error) => {
//     console.log('connection failed ', error);
    
// })