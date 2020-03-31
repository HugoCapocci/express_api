import express from 'express';
import { promises as fs } from 'fs';

const app = express();
const v1 = express.Router();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/v1', v1);

v1.get('/message', async (req, res) => {
    const rawQuotes = await fs.readFile('./data/quotes.json');
    const quotes = JSON.parse(rawQuotes);
    res.send(quotes);
});

v1.get('/message/:id', async (req, res) => {
    const rawQuotes = await fs.readFile('./data/quotes.json');
    const quotes = JSON.parse(rawQuotes);
    const id = req.params.id;
    const quote = quotes.find(quote => quote.id == id);
    !quote ? res.sendStatus(404) : res.send(quote);
});

v1.post('/message', async (req, res) => {
    const message = req.body;
    const isValid = message.quote && message.author
    if (!isValid) return res.sendStatus(400);
    const rawQuotes = await fs.readFile('./data/quotes.json');
    const quotes = JSON.parse(rawQuotes);
    quotes.sort((q1, q2) => q2.id - q1.id);
    message.id = quotes[0].id + 1;
    res.send(message);
})

app.listen(3000, () => {
    console.log('Server listening on port 3000!');
});