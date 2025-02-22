document.addEventListener("DOMContentLoaded", () => {
    const createDeckButton = document.getElementById("create-deck");
    const shuffleDeckButton = document.getElementById("shuffle-deck");
    const drawCardButton = document.getElementById("draw-card");
    const showDeckButton = document.getElementById("show-deck");
    const deckIdSpan = document.getElementById("deck-id");
    const cardDetails = document.getElementById("card-details");
    const cardImage = document.getElementById("card-image");

    let deckId = null;

    // ===================== OPPRETT NY KORTSTOKK =====================
    createDeckButton.addEventListener("click", async () => {
        const response = await fetch("https://applikasjonsutvikling-2.onrender.com/temp/deck", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                shuffled: true,
                remaining: 52,
            }),
        });

        if (!response.ok) {
            alert(`Feil: ${response.status} - ${response.statusText}`);
            return;
        }

        const data = await response.json();
        deckId = data.deck_id;
        deckIdSpan.textContent = deckId;

        // Aktiver knapper etter at en kortstokk er opprettet
        shuffleDeckButton.disabled = false;
        drawCardButton.disabled = false;

        console.log("Kortstokk opprettet:", deckId);
    });

    // ===================== STOKK KORTSTOKKEN =====================
    shuffleDeckButton.addEventListener("click", async () => {
        if (!deckId) {
            alert("Du må opprette en kortstokk først.");
            return;
        }

        const response = await fetch(`https://applikasjonsutvikling-2.onrender.com/temp/deck/shuffle/${deckId}`, {
            method: "PATCH",
        });

        if (!response.ok) {
            alert(`Feil: ${response.status} - ${response.statusText}`);
            return;
        }

        alert("Kortstokken er stokket!");
        console.log("Kortstokk stokket:", deckId);
    });

    // ===================== TREKK ET KORT =====================
    drawCardButton.addEventListener("click", async () => {
        if (!deckId) {
            alert("Du må opprette en kortstokk først.");
            return;
        }

        const response = await fetch(`https://applikasjonsutvikling-2.onrender.com/temp/deck/${deckId}/card`, {
            method: "GET",
        });

        if (!response.ok) {
            alert(`Feil: ${response.status} - ${response.statusText}`);
            return;
        }

        const data = await response.json();
        const card = data.drawnCard;

        if (card) {
            let rank = card.rank;
            let suit = card.suit;
            let imageUrl = card.image; // Antar at API-et returnerer en bilde-url for kortet

            cardDetails.textContent = `${rank} of ${suit}`;
            cardImage.src = imageUrl;
            cardImage.alt = `${rank} of ${suit}`;

            // Endre fargen på teksten basert på kortets farge
            if (suit === "Hearts" || suit === "Diamonds") {
                cardDetails.style.color = "red";
            } else {
                cardDetails.style.color = "black";
            }

            console.log("Trukket kort:", card);
        } else {
            alert("Ingen flere kort igjen i kortstokken.");
        }
    });

    // ===================== VIS KORTSTOKKEN =====================
    showDeckButton.addEventListener("click", async () => {
        if (!deckId) {
            alert("Du må opprette en kortstokk først.");
            return;
        }

        const response = await fetch(`https://applikasjonsutvikling-2.onrender.com/temp/deck/${deckId}`, {
            method: "GET",
        });

        if (!response.ok) {
            alert(`Feil: ${response.status} - ${response.statusText}`);
            return;
        }

        const deck = await response.json();

        // Finn eller opprett et div-element for å vise kortene
        let deckContainer = document.getElementById("deck-container");
        if (!deckContainer) {
            deckContainer = document.createElement("div");
            deckContainer.id = "deck-container";
            document.body.appendChild(deckContainer);
        }

        deckContainer.innerHTML = "<h3>Innhold i kortstokken:</h3>";

        // Gå gjennom alle kortene og vis dem
        deck.forEach(card => {
            let cardElement = document.createElement("p");

            if (card.rank && card.suit) {
                let rank = card.rank;
                let suit = card.suit;

                if (suit === "Hearts" || suit === "Diamonds") {
                    cardElement.style.color = "red";
                } else {
                    cardElement.style.color = "black";
                }

                cardElement.textContent = `${rank} of ${suit}`;
            } else {
                console.error("Feil format på kort:", card);
                cardElement.textContent = "Feil: Kunne ikke vise kort";
            }

            deckContainer.appendChild(cardElement);
        });

        deckContainer.style.display = "block";
        console.log("Kortstokk vist:", deck);
    });
});
