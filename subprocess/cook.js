const plats = [];
let isCooking = false;
process.send("je suis prêt à cuisiner");

process.on('message', (plat => {
    console.log('il fuat préparer le plat ', plat);
    // process.exit(0);
    plats.push(plat);
    if (!isCooking){
        doCook();
    }
}));

//vérifie toutes les x secondes s'il y a un plat à cuisiner
setInterval(() => {
    if(!isCooking && plats.length > 0){
        doCook();
    }
}, 2000);

doCook = () => {
    isCooking = true;
    const plat = plats.shift();
    //après un laps de temps, le plat est prêt
    const timeToReady = Math.random() * 3000;
    setTimeout(() => {
        process.send({
            plat: plat,
            preparationTime: timeToReady
        });
        isCooking = false;
        if(plats.length == 0){
            process.exit(0);
        }
    }, timeToReady);
};

