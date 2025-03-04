import express from "express";
import HTTP_CODES from "./utils/httpCodes.mjs"; 
import flashcardRoutes from "./routes/flashcards.mjs";
import cors from "cors"; // Importer CORS-pakken

const server = express();
const port = process.env.PORT || 8000; 
const decks = new Map();

server.use(cors()); // Legg til CORS middleware her
server.use(express.static("public"));
server.use(express.json());

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 

// Koble til Flashcard API
server.use("/api/flashcards", flashcardRoutes);

// Kortstokk-funksjonalitet (API-Endpoints)
server.post("/temp/deck", (req, res) => {
    const deckId = Math.random().toString(36).substring(2, 10);
    const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
    const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"];

    const deck = [];
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({ suit, rank });
        }
    }

    decks.set(deckId, deck);
    res.status(201).json({ deck_id: deckId });
});

// Stokke kortstokk
server.patch("/temp/deck/shuffle/:deck_id", (req, res) => {
    const { deck_id } = req.params;
    if (!decks.has(deck_id)) {
        return res.status(404).send("Kortstokk ikke funnet.");
    }

    const deck = decks.get(deck_id);
    shuffleDeck(deck);
    res.status(200).json({ message: "Kortstokk stokket." });
});

// Hente kort fra kortstokk
server.get("/temp/deck/:deck_id/card", (req, res) => {
    const { deck_id } = req.params;
    if (!decks.has(deck_id)) {
        return res.status(404).send("Kortstokk ikke funnet.");
    }

    const deck = decks.get(deck_id);
    if (deck.length === 0) {
        return res.status(400).send("Kortstokken er tom.");
    }

    const randomIndex = Math.floor(Math.random() * deck.length);
    const [card] = deck.splice(randomIndex, 1);

    const rankCode = card.rank === "10" ? "0" : card.rank[0];
    const suitCode = card.suit[0];
    card.code = `${rankCode}${suitCode}`.toUpperCase();

    decks.set(deck_id, deck);
    res.status(200).json(card);
});

// Hente hele kortstokken
server.get("/temp/deck/:deck_id", (req, res) => {
    const { deck_id } = req.params;

    if (!decks.has(deck_id)) {
        return res.status(404).send("Kortstokk ikke funnet.");
    }

    const deck = decks.get(deck_id);
    res.status(200).json(deck);
});

// Slette kortstokk
server.delete("/temp/deck/:deck_id", (req, res) => {
    const { deck_id } = req.params;
    if (!decks.has(deck_id)) {
        return res.status(404).send("Kortstokk ikke funnet.");
    }

    decks.delete(deck_id);
    res.status(200).send("Kortstokk slettet.");
});

// Start serveren
server.set("port", port);
server.listen(port, () => {
    console.log(`Server kjører på port ${port}`);
});

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]]; // Bytt plass på kortene
    }
}