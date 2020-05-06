process.on('message', (plat) => {
    setTimeout(() => {
        process.send(plat);
    }, 2000)
});