import express from "express";

const router = express.Router();

// Midlertidig lagring av flashcards
const flashcards = [];

// Opprett et nytt flashcard (Create)
router.post("/", (req, res) => {
    const { question, answer } = req.body;
    if (!question || !answer) {
        return res.status(400).json({ message: "Spørsmål og svar er påkrevd!" });
    }

    const newFlashcard = { id: flashcards.length + 1, question, answer };
    flashcards.push(newFlashcard);
    res.status(201).json(newFlashcard);
});

// Hent alle flashcards (Read)
router.get("/", (req, res) => {
    res.status(200).json(flashcards);
});

// Oppdater et flashcard (Update)
router.patch("/:id", (req, res) => {
    const { id } = req.params;
    const { question, answer } = req.body;

    const flashcard = flashcards.find(f => f.id == id);
    if (!flashcard) {
        return res.status(404).json({ message: "Flashcard ikke funnet!" });
    }

    if (question) flashcard.question = question;
    if (answer) flashcard.answer = answer;

    res.status(200).json(flashcard);
});

// Slett et flashcard (Delete)
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const index = flashcards.findIndex(f => f.id == id);
    if (index === -1) {
        return res.status(404).json({ message: "Flashcard ikke funnet!" });
    }

    flashcards.splice(index, 1);
    res.status(200).json({ message: "Flashcard slettet!" });
});

export default router;