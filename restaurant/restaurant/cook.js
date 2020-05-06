//on défini ici le cuisinier
const EventEmitter = require('events');
module.exports = class Cook extends EventEmitter {
    //via cette méthode on lui envoie des commandes
    doCook(dishName) {
        console.log(dishName + 'en cours de préparation');
        const preparationTime = Math.random() * 3000;

        //emission du message
        setTimeout( () => {
            this.emit('dishReady', {dishName: dishName,
            preparationTime: preparationTime});
        }, preparationTime);

     //   this.emit('DishReady', dishName);
    }
};