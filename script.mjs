import express from 'express'
import HTTP_CODES from './utils/httpCodes.mjs';

const server = express();
const port = (process.env.PORT || 8000);

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

server.get('/tmp/quote', getQuote);
server.get("/", getRoot);
server.get('/tmp/poem', getPoem);

server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});

