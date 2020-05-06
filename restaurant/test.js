const fs = require('fs');
const util = require('util');
const unlinkPromise = util.promisify(fs.unlink);

//fonction asynchrone
async function deleteFile(fileName){
    //on attend que cette instruction await soit executee pour apsser à la suite
   await unlinkPromise(fileName);
    console.log("delelelele");
}

deleteFile('./dummy.txt');
/*
//promesses
unlinkPromise('./dummy.txt')
    .then(function () {
        console.log("deleted");
    })
    .then(function () {
        console.log("ok");
    });
*/
/*
//callback = fonction appellée en retour
fs.unlink('./dummy.txt', function () {
    console.log("hello2");
});*/
console.log("hello");
//const unlinkPromise = util.promisify(fs.unlink)