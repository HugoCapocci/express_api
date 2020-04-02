import mongodb from "mongodb";
const { MongoClient } = mongodb;

class MessageService {
    getConnectedService() {
        const client = new MongoClient(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        return client.connect();
    }

    createMessage() {
        const client = this.getConnectedService();

        client.close();
    }
}

export default MessageService;
