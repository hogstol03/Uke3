import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors()); // Tillater frontend å hente fra backend

let decks = {}; // Lagrer kortstokker i minnet

// ====================== OPPRETT NY KORTSTOKK ======================
app.post("/temp/deck", (req, res) => {
    const deck_id = uuidv4();
    const suits = ["♠", "♥", "♦", "♣"];
    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

    const newDeck = [];
    for (const suit of suits) {
        for (const value of values) {
            newDeck.push({ value, suit });
        }
    }

    decks[deck_id] = {
        deck_id,
        shuffled: false,
        remaining: 52,
        cards: newDeck,
    };

    res.json({ deck_id });
});

// ====================== STOKK KORTSTOKKEN ======================
app.patch("/temp/deck/shuffle/:deck_id", (req, res) => {
    const { deck_id } = req.params;
    if (!decks[deck_id]) {
        return res.status(404).json({ error: "Kortstokk ikke funnet" });
    }

    decks[deck_id].cards.sort(() => Math.random() - 0.5);
    decks[deck_id].shuffled = true;

    res.json({ message: "Kortstokken er stokket!" });
});

// ====================== VIS KORTSTOKKEN ======================
app.get("/temp/deck/:deck_id", (req, res) => {
    const { deck_id } = req.params;
    if (!decks[deck_id]) {
        return res.status(404).json({ error: "Kortstokk ikke funnet" });
    }

    res.json(decks[deck_id].cards);
});

// ====================== TREKK ET KORT ======================
app.get("/temp/deck/:deck_id/card", (req, res) => {
    const { deck_id } = req.params;
    if (!decks[deck_id]) {
        return res.status(404).json({ error: "Kortstokk ikke funnet" });
    }

    if (decks[deck_id].remaining === 0) {
        return res.status(400).json({ error: "Ingen flere kort igjen" });
    }

    const drawnCard = decks[deck_id].cards.pop();
    decks[deck_id].remaining--;

    res.json(drawnCard);
});

// ====================== START SERVEREN ======================
app.listen(port, () => {
    console.log(`Server kjører på port ${port}`);
});
