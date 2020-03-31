const express = require('express');

const app = express();
const v1 = express.Router();


app.use('/api/v1', v1);

v1.get('/message', (request, response) => {
    response.send([
        {
            'name' : 'Guillaume1'
        },
        {
            'name' : 'Guillaume2'
        }
    ])
})


app.listen(3000, () => {
    console.log('Server listening on port 3000 !');
});