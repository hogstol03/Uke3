import express from 'express'
import HTTP_CODES from './utils/httpCodes.mjs';

const server = express();
const port = (process.env.PORT || 8000);
const decks = new Map();

server.set('port', port);
server.use(express.static('public'));

function getRoot(req, res, next) {
    res.status(HTTP_CODES.SUCCESS.OK).send('Hello World').end();
}

function getPoem(req, res, next) {
    const poem = `
        Roses are red,
        Violets are blue,
        Sugar is sweet,
        And so are you.
    `;
    res.status(HTTP_CODES.SUCCESS.OK).send(poem).end();
}

function getQuote(req, res, next) {
    const quotes = [
        "The only limit to our realization of tomorrow is our doubts of today. – Franklin D. Roosevelt",
        "Do what you can, with what you have, where you are. – Theodore Roosevelt",
        "In the middle of every difficulty lies opportunity. – Albert Einstein",
        "Life is 10% what happens to us and 90% how we react to it. – Charles R. Swindoll",
        "It does not matter how slowly you go as long as you do not stop. – Confucius"
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.status(HTTP_CODES.SUCCESS.OK).send(randomQuote).end();
}

function getSum(req, res, next) {
    const a = parseInt(req.params.a, 10);
    const b = parseInt(req.params.b, 10);

    if (isNaN(a) || isNaN(b)) {
        return res.status(400).send("Begge parametrene må være tall.");
    }

    const sum = a + b;

    res.status(200).send(`Summen av ${a} og ${b} er ${sum}`).end();
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

server.patch('/temp/deck/shuffle/:deck_id', (req, res) => {
    const { deck_id } = req.params;
    if (!decks.has(deck_id)) {
        return res.status(404).send('Kortstokk ikke funnet.');
    }

    const deck = decks.get(deck_id);
    shuffleDeck(deck);
    res.status(200).send('Kortstokk stokket.');
});

server.post('/tmp/sum/:a/:b', getSum);
server.get('/tmp/quote', getQuote);
server.get("/", getRoot);
server.get('/tmp/poem', getPoem);
server.get('/temp/deck/:deck_id/card', (req, res) => {
    const { deck_id } = req.params;
    if (!decks.has(deck_id)) {
        return res.status(404).send('Kortstokk ikke funnet.');
    }

    const deck = decks.get(deck_id);
    if (deck.length === 0) {
        return res.status(400).send('Kortstokken er tom.');
    }

    const randomIndex = Math.floor(Math.random() * deck.length);
    const [card] = deck.splice(randomIndex, 1);
    decks.set(deck_id, deck);

    res.status(200).json(card);
});

server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});

