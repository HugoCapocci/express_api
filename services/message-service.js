require('dotenv').config()
/*
 * equivalent de :yarn add env
   const MongoClient = require('mongodb').MongoClient;
   const ObjectID = require('mongodb').ObjectID;
 */

const { MongoClient, ObjectID } = require('mongodb');

console.log('process.env.MONGO_CONNECTION_URL?', process.env.MONGO_CONNECTION_URL);

const client =new MongoClient(
    process.env.MONGO_CONNECTION_URL,
    { useNewUrlParser: true, useUnifiedTopology: true }
);

client.connect()
.then(function() {
    console.log('connection OK');
})
.catch(function(error) {
    console.log('console failed', error);
});