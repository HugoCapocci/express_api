import mongodb from "mongodb";
const { MongoClient } = mongodb

class MessageService {
    getConnectedService() {
        const client = new MongoClient(
            process.env.DATABASE_URL,
            { useNewUrlParser: true, useUnifiedTopology: true }
        );

        return client.connect();
    };

    async createMessage(message) {
        const client = await this.getConnectedService();

        const collection = client.db(process.env.DATABASE_NAME).collection('messages')
        const resultMessage = await collection.insertOne(message);

        await client.close();

        return resultMessage;
    };

    async getMessages() {
        const client = await this.getConnectedService();

        const collection = client.db(process.env.DATABASE_NAME).collection('messages');
        const quotes = await collection.find({}).toArray();

        await client.close();

        return quotes;
    };

    async getMessage(id) {
        const client = await this.getConnectedService();

        const collection = client.db(process.env.DATABASE_NAME).collection('messages');
        const quote = await collection.findOne({ _id: mongodb.ObjectID(id) });

        await client.close();

        return quote;
    };

    async deleteMessage(id) {
        const client = await this.getConnectedService();

        const collection = client.db(process.env.DATABASE_NAME).collection('messages');
        const result = await collection.deleteOne({ _id: mongodb.ObjectID(id) });

        await client.close();

        return result.deletedCount === 1;
    };
}

export default MessageService;