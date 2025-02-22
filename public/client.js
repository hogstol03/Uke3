document.addEventListener('DOMContentLoaded', function () {
    const createDeckButton = document.getElementById('create-deck');
    const shuffleDeckButton = document.getElementById('shuffle-deck');
    const drawCardButton = document.getElementById('draw-card');
    const showDeckButton = document.getElementById('show-deck');
    const deckIdElement = document.getElementById('deck-id');
    const cardDetailsElement = document.getElementById('card-details');
    const cardImageElement = document.getElementById('card-image');

    const apiUrl = "https://applikasjonsutvikling-2-pgq4.onrender.com/";

    createDeckButton.addEventListener('click', async () => {
        const response = await fetch(`${apiUrl}/temp/deck`, { method: 'POST' });
        if (response.ok) {
            const data = await response.json();
            deckIdElement.textContent = data.deck_id;
            shuffleDeckButton.disabled = false;
            drawCardButton.disabled = false;
        } else {
            alert('Feil ved oppretting av kortstokk.');
        }
    });

    shuffleDeckButton.addEventListener('click', async () => {
        const deckId = deckIdElement.textContent;
        const response = await fetch(`${apiUrl}/temp/deck/shuffle/${deckId}`, { method: 'PATCH' });
        if (response.ok) {
            alert("Kortstokk stokket!");
        } else {
            alert('Feil ved stokkingen av kortstokken.');
        }
    });

    drawCardButton.addEventListener('click', async () => {
        const deckId = deckIdElement.textContent;
        if (!deckId || deckId === "Ingen kortstokk opprettet") {
            alert("Du må opprette en kortstokk først.");
            return;
        }

        const response = await fetch(`${apiUrl}/temp/deck/${deckId}/card`, { method: 'GET' });
        if (response.ok) {
            const card = await response.json();
            cardDetailsElement.textContent = `${card.rank} of ${card.suit}`;
            cardImageElement.src = `https://deckofcardsapi.com/static/img/${card.code}.png`;
            cardImageElement.style.display = 'block';
        } else {
            alert('Feil ved trekking av kort.');
        }
    });

    showDeckButton.addEventListener('click', async () => {
        const deckId = deckIdElement.textContent;
        const response = await fetch(`${apiUrl}/temp/deck/${deckId}`, { method: 'GET' });

        if (response.ok) {
            const deck = await response.json();
            console.log("Kortstokk:", deck);
            alert("Kortstokken vises i konsollen.");
        } else {
            alert('Feil ved visning av kortstokk.');
        }
    });
});
