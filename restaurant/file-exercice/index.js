//version promesse de fs
const fs = require('fs').promises;

//const readable = getReadableStreamSomehow();


async function copy(fileName, encoding){
    const fileContent = await fs.readFile(fileName, encoding);
    fs.writeFile('./out/' + fileName, fileContent, encoding)
}

copy('./texte.txt', 'utf8');
copy('adapter.png');
//const readedFile = fs.readFile(fs.unlink);
/*
fs.readFile('./texte.txt', 'utf8')
    .then(function (data) {
        fs.writeFile('copy.txt', data, 'utf-8');
    });

fs.readFile('./adapter.png')
    .then(function (data) {
        fs.writeFile('adapter2.png', data );
    });
*/


