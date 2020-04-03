const {MongoClient, ObjectID} = require('mongodb');

module.exports = class MessageService {

    // retourne une connection, qu'il faudra fermer à chaque fois
    static getConnectedClient() {
        console.log("MONGO_CONNECTION_URL ",process.env.MONGO_CONNECTION_URL);
        const client = new MongoClient(
            process.env.MONGO_CONNECTION_URL,
            { useNewUrlParser: true, useUnifiedTopology: true }
        ); 
        
        return client.connect();
    }

    //Crée le message passé en paramètres dans la base de données
    static async create(message) {
        const client = await this.getConnectedClient();

        const collection = client.db(process.env.MONGO_DB).collection('messages');
        const insertedMessage = await collection.insertOne(message);

        await client.close();

        return insertedMessage;
    }

    //Retourne la liste de tous les messages
    static async list(){
        const client = await this.getConnectedClient();
        const collection = client.db(process.env.MONGO_DB).collection('messages');

        const quotes = await collection.find({}).toArray();
        await client.close()

        return quotes;
    }

    //Retourne le message ayant l'id spécifié
    static async details(id){
        const client = await this.getConnectedClient();
        const collection = client.db(process.env.MONGO_DB).collection('messages');

        const quotes = await collection.findOne({
            _id: new ObjectID(id)
        });

        await client.close();

        return quotes;
    }

    //Supprime le message ayant l'id spécifié
    static async delete(id){
        const client = await this.getConnectedClient();
        const collection = client.db(process.env.MONGO_DB).collection('messages');

        const result = await collection.deleteOne({
            _id: new ObjectID(id)
        });

        await client.close();
        return result;
    }

    //Modifie le message ayant l'id passé en paramètre 
    static async update(id, message) {
        const client = await this.getConnectedClient();
        const collection = client.db(process.env.MONGO_DB).collection('messages');

        const result = await collection.findOneAndUpdate({_id: new ObjectID(id)}, {$set : message})

        await client.close();
        return(result);
    }

}