// const {a} = require('libA') <=> const a = require('libA').a
const { MongoClient, ObjectId } = require('mongodb');

console.log('process.env.MONGO_CONNECTION_URL? ', process.env.MONGO_CONNECTION_URL);

module.exports = class MessageService{
    getConnectedClient() {
        const client = new MongoClient(
            process.env.MONGO_CONNECTION_URL,
            { useNewUrlParser: true },
            { useUnifiedTopology: true }
        );
        return client.connect();
    }
}


// client.connect().then(function () {
//     console.log('connection ok');
// }).catch(function (err) {
//     console.log('confection fail ', err)
// })
