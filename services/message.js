import mongodb from "mongodb";
const { MongoClient } = mongodb

class MessageService {

    static isMessageValid = (message) => {
        return message.quote && message.author;
    }

    getConnectedService = () => {
        const client = new MongoClient(
            process.env.MONGO_DATABASE_URL,
            { useNewUrlParser: true, useUnifiedTopology: true }
        );

        return client.connect();
    };

    createMessage = async (message) => {
        const client = await this.getConnectedService();

        const collection = client.db(process.env.MONGO_DATABASE_NAME).collection('messages')
        const resultMessage = await collection.insertOne(message);

        await client.close();

        return resultMessage;
    };

    getMessages = async () => {
        const client = await this.getConnectedService();

        const collection = client.db(process.env.MONGO_DATABASE_NAME).collection('messages');
        const quotes = await collection.find({}).toArray();

        await client.close();

        return quotes;
    };

    getMessage = async (id) => {
        const client = await this.getConnectedService();

        const collection = client.db(process.env.MONGO_DATABASE_NAME).collection('messages');
        const quote = await collection.findOne({ _id: mongodb.ObjectID(id) });

        await client.close();

        return quote;
    };

    updateMessage = async (id, message) => {
        const client = await this.getConnectedService();

        const collection = client.db(process.env.MONGO_DATABASE_NAME).collection('messages');
        // const result = await collection.findOneAndUpdate(
        const result = await collection.updateOne(
            { _id: mongodb.ObjectID(id) },
            { $set: message }
        );

        await client.close();

        return {
            isFind: result.matchedCount == 1,
            isModified: result.modifiedCount == 1
        };
    };

    deleteMessage = async (id) => {
        const client = await this.getConnectedService();

        const collection = client.db(process.env.MONGO_DATABASE_NAME).collection('messages');
        const result = await collection.deleteOne({ _id: mongodb.ObjectID(id) });

        await client.close();

        return result.deletedCount === 1;
    };
}

export default MessageService;