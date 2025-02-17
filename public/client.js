document.addEventListener('DOMContentLoaded', function () {
    const createDeckButton = document.getElementById('create-deck');
    const shuffleDeckButton = document.getElementById('shuffle-deck');
    const drawCardButton = document.getElementById('draw-card');
    const deckIdElement = document.getElementById('deck-id');
    const cardDetailsElement = document.getElementById('card-details');
    const cardImageElement = document.getElementById('card-image');

    // -----------------------------
    cardDetailsElement.textContent = '';
    cardImageElement.src = '';
    cardImageElement.style.display = 'none';

    // -----------------------------
    createDeckButton.addEventListener('click', async () => {
        const response = await fetch('http://localhost:8000/temp/deck', {
            method: 'POST',
        });

        if (response.ok) {
            const data = await response.json();
            const deckId = data.deck_id;
            deckIdElement.textContent = deckId;
            shuffleDeckButton.disabled = false;
            drawCardButton.disabled = false;
        } else {
            alert('Feil ved oppretting av kortstokk.');
        }
    });

    // -----------------------------
    shuffleDeckButton.addEventListener('click', async () => {
        const deckId = deckIdElement.textContent;

        const response = await fetch(`http://localhost:8000/temp/deck/shuffle/${deckId}`, {
            method: 'PATCH',
        });

        if (response.ok) {
            alert('Kortstokken er stokket!');
        } else {
            alert('Feil ved stokkingen av kortstokken.');
        }
    });

    // -----------------------------
    drawCardButton.addEventListener('click', async () => {
        const deckId = deckIdElement.textContent;

        const response = await fetch(`http://localhost:8000/temp/deck/${deckId}/card`, {
            method: 'GET',
        });

        if (response.ok) {
            const card = await response.json();

            cardDetailsElement.textContent = `${card.rank} of ${card.suit}`;
            cardImageElement.src = `https://deckofcardsapi.com/static/img/${card.code}.png`;
            cardImageElement.style.display = 'block';
        } else {
            alert('Feil ved trekking av kort.');
        }
    });
});