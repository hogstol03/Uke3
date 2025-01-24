
const apiBase = "http://localhost:8000/temp/deck";

// --------------------------
document.getElementById("createDeck").addEventListener("click", async () => {
    const response = await fetch(apiBase, { method: "POST" });
    const data = await response.json();
    document.querySelector("#deckId span").textContent = data.deck_id;
});

// --------------------------
document.getElementById("shuffleDeck").addEventListener("click", async () => {
    const deckId = document.getElementById("shuffleDeckId").value;
    const response = await fetch(`${apiBase}/shuffle/${deckId}`, { method: "PATCH" });
    if (response.ok) {
        alert("Kortstokken er stokket!");
    } else {
        alert("Feil: Kunne ikke stokke kortstokken.");
    }
});

// --------------------------
document.getElementById("viewDeck").addEventListener("click", async () => {
    const deckId = document.getElementById("viewDeckId").value;
    const response = await fetch(`${apiBase}/${deckId}`);
    if (response.ok) {
        const data = await response.json();
        document.getElementById("deckView").textContent = JSON.stringify(data, null, 2);
    } else {
        alert("Feil: Kunne ikke finne kortstokken.");
    }
});

// --------------------------
document.getElementById("drawCard").addEventListener("click", async () => {
    const deckId = document.getElementById("drawDeckId").value;
    const response = await fetch(`${apiBase}/${deckId}/card`);
    if (response.ok) {
        const data = await response.json();
        document.querySelector("#drawnCard span").textContent = `${data.value} of ${data.suit}`;
    } else {
        alert("Feil: Kunne ikke trekke et kort.");
    }
});
