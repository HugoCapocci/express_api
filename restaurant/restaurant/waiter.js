module.exports = class Waiter {
    constructor(cook) {
        cook.on('dishReady', function (result) {
        console.log("en salle" + result.dishName);
        console.log(('a pris' + result.preparationTime + '  de préparation'))
        })
    }
};