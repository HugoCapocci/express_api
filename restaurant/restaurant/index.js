const Cook = require('./cook');
const Waiter = require('./waiter');

const cook = new Cook();
const waiter = new Waiter(cook);

cook.doCook('sushi');
cook.doCook('burger');
