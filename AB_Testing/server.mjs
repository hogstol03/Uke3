import express from "express";

const app = express();
const PORT = 3000;

const VARIANTS = {
    A: "Dette er versjon A av API-svaret",
    B: "Dette er versjon B av API-svaret",
};

const SPLIT = 0.5;

const userVariants = {};

function abTestingMiddleware(req, res, next) {
    const userId = req.ip;

    if (!userVariants[userId]) {
        userVariants[userId] = Math.random() < SPLIT ? "A" : "B";
    }

    const variant = userVariants[userId];
    res.locals.variant = VARIANTS[variant];
    console.log(`Bruker tildelt variant: ${variant}`);
    next();
}

app.use(abTestingMiddleware);

app.get("/api/feature", (req, res) => {
    res.send(res.locals.variant);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});