const express = require('express');

const app = express();
const v1 = express.Router();

app.use('/api/v1', v1);

v1.get('/message', (request, response)=>{
    response.send([
        {
        "quote": "All mankind is of one author, and is one volume; when one man dies, one chapter is not torn out of the book, but translated into a better language; and every chapter must be so translated; God emploies several translators; some pieces are translated by age, some by sickness, some by war, some by justice; but God's hand is in every translation; and his hand shall bind up all our scattered leaves again, for that library where every book shall lie open to one another.",
        "author": "John Donne",
        "id": 1
        },
        {
        "quote": "Goodness is always an asset. A man who is straight, friendly and useful may never be famous, but he is respected and liked by all who know him. He has laid a sound foundation for success and he will have a worthwhile life.",
        "author": "Herbert N. Casson",
        "id": 2
        }
        
        ]);
});

app.listen(3000, ()=>{
    console.log('server listenig on port 3000 - Ta mère est un velow');
})