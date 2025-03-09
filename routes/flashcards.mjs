import express from "express";
import pkg from 'pg'; 
const { Pool } = pkg; 

const router = express.Router();

// Koble til PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Opprett et nytt flashcard (Create)
router.post("/", async (req, res) => {
    const { question, answer, category } = req.body;
    if (!question || !answer || !category) {
        return res.status(400).json({ message: "Spørsmål, svar og kategori er påkrevd!" });
    }

    const query = `
        INSERT INTO flashcards (question, answer, category)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [question, answer, category];

    try {
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error creating flashcard:", err);
        res.status(500).json({ message: "Error creating flashcard" });
    }
});

// Hent alle flashcards (Read)
router.get("/", async (req, res) => {
    const query = 'SELECT * FROM flashcards ORDER BY created_at DESC;'; // Sorter etter opprettelsesdato

    try {
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching flashcards:", err);
        res.status(500).json({ message: "Error fetching flashcards" });
    }
});

// Oppdater et flashcard (Update)
router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const { question, answer, category } = req.body;

    const query = `
        UPDATE flashcards
        SET question = $1, answer = $2, category = $3
        WHERE id = $4
        RETURNING *;
    `;
    const values = [question, answer, category, id];

    try {
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Flashcard ikke funnet!" });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error updating flashcard:", err);
        res.status(500).json({ message: "Error updating flashcard" });
    }
});

// Slett et flashcard (Delete)
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM flashcards WHERE id = $1 RETURNING *;';

    try {
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Flashcard ikke funnet!" });
        }
        res.status(200).json({ message: "Flashcard slettet!" });
    } catch (err) {
        console.error("Error deleting flashcard:", err);
        res.status(500).json({ message: "Error deleting flashcard" });
    }
});

export default router;
