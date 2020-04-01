require('dotenv').config();
//const {a}  = require('a'); = équivalent de  const {a] require ('a').a;
const {MongoClient, ObjectID} = require('mongodb');

module.exports = class MethodService{
    getConnectedClient(){
        const client = new MongoClient(
            process.env.MONGO_CONNECTION_URL,
            {urlNewParser: true, useUnifiedTopology: true}
        );
return client.connect();
/*client.connect().then(function () {
            console.log("connection OK");
        }).catch(function (error) {
            console.log('connection failed', error);
        });*/
    }

    createMessage(message){
      //  const client = this.getConnectedClient();

       // client.close();
    }
};

