const fork = require('child_process').fork;
const waiter = fork('./waiter.js');

waiter.on('message', message => {
    console.log('plat servi en salle : ', message);
});
let cook;
function initCook(){
    let cook = fork('./cook.js');
    cook.on('message', (message => {
        console.log('message du cuisinier :', message);
        waiter.send(message);
    }))
    cook.on('exit', (code, signal) => {
        console.log(`cook has finished his work. Exited with ${code} and signal ${signal} `)
        //réactive un cuisinier
        initCook();
    });
}
initCook();

cook.send("frites");
 setTimeout(() => {
     cook.send('Steak');
 }, 4000)

//commande un plat
//['Burger', 'Sphagetti', 'Frites', 'Kebab']
  //  .forEach(plat => cookChildSubProcess.send(plat));
//cookChildSubProcess.send("burger");


//commande un plat