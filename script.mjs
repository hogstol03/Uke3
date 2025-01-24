import express from 'express';
import HTTP_CODES from './utils/httpCodes.mjs';

const server = express();
const port = (process.env.PORT || 8000);
const decks = new Map();

server.set('port', port);
server.use(express.static('public'));

function getRoot(req, res, next) {
    res.status(HTTP_CODES.SUCCESS.OK).send('Hello World').end();
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// POST /temp/deck: Oppretter en ny kortstokk
server.post('/temp/deck', (req, res) => {
    const deckId = Math.random().toString(36).substring(2, 10);
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];

    const deck = [];
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({ suit, rank });
        }
    }

    decks.set(deckId, deck);
    res.status(201).json({ deck_id: deckId });
});

// PATCH /temp/deck/shuffle/:deck_id: Stokker kortstokk
server.patch('/temp/deck/shuffle/:deck_id', (req, res) => {
    const { deck_id } = req.params;
    if (!decks.has(deck_id)) {
        return res.status(404).send('Kortstokk ikke funnet.');
    }

    const deck = decks.get(deck_id);
    shuffleDeck(deck);
    res.status(200).send('Kortstokk stokket.');
});

// GET /temp/deck/:deck_id/card: Trekker et kort fra kortstokk
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

server.get("/", getRoot);

server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});