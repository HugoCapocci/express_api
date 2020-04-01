const {MongoClient, ObjectID} = require('mongodb');
require('dotenv').config();

const client = new MongoClient(
    process.env.MONGO_CONNEXION_URL,
    {useNewUrlParser: true}
);

console.log(process.env.MONGO_CONNEXION_URL);

client.connect()
.then(() =>{
    console.log('connection OK');
})
.catch((error) =>{
    console.log('connection KO', error);
});
