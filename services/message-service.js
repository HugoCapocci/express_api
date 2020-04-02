const { MongoClient, ObjectID } = require('mongodb');

/* const client = new MongoClient(
    process.env.MONGO_CONNECTION_URL, 
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true 
    }
);

client.connect()
.then(function() {
    console.log('connection OK');
})
.catch(function(error) {
    console.log('connection failed ', error);
}); */

module.exports = class MessageService  {
    // retourne une connexion qu'il faudra fermer à chaque fois
    getConnectedClient() {
        const client = new MongoClient(
            process.env.MONGO_CONNECTION_URL,
            { useNewUrlParser: true, useUnifiedTopology: true }
        );

        return client.connect();
    }

    createMessage(message) {
        // TODO !
        const client = this.getConnectedClient();

        // smth

        await client.close();

        return {
            
        }
    }
}