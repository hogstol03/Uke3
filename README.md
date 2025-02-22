# UKE 8 - Strukturere og Eksterne servere

Dette er et API for å opprette, stokke og hente kort fra en kortstokk. API-et gir deg muligheten til å opprette en kortstokk, stokke den og hente ett kort eller hele kortstokken.

## Hvordan teste API-et

For testing av API-et kan du bruke **Insomnia** eller **Postman**. Eksportfilene ligger i mappen `api-testing` i repoet.

### API-endepunkter

Her er en oversikt over tilgjengelige API-endepunkter:

1. **POST** `/temp/deck`
   - **Beskrivelse**: Opprett en ny kortstokk.
   - **Eksempel på respons**: `{ "deck_id": "abc123" }`

2. **PATCH** `/temp/deck/shuffle/{deck_id}`
   - **Beskrivelse**: Stokk kortstokken med den angitte `deck_id`.
   - **Eksempel på respons**: `"Kortstokk stokket."`

3. **GET** `/temp/deck/{deck_id}/card`
   - **Beskrivelse**: Hent et tilfeldig kort fra kortstokken med `deck_id`.
   - **Eksempel på respons**: `{ "suit": "Hearts", "rank": "King", "code": "KH" }`

4. **GET** `/temp/deck/{deck_id}`
   - **Beskrivelse**: Hent hele kortstokken med `deck_id`.
   - **Eksempel på respons**: `[ { "suit": "Hearts", "rank": "King", "code": "KH" }, ... ]`
  
### Hvordan bruke API-et

1. For å opprette en kortstokk, send en **POST**-forespørsel til `/temp/deck`. Dette vil returnere et `deck_id` som du bruker til å referere til kortstokken din.
   
2. For å stokk kortstokken, send en **PATCH**-forespørsel til `/temp/deck/shuffle/{deck_id}` hvor `{deck_id}` er den unike ID-en til kortstokken.

3. For å hente et tilfeldig kort, send en **GET**-forespørsel til `/temp/deck/{deck_id}/card`.

4. For å hente hele kortstokken, send en **GET**-forespørsel til `/temp/deck/{deck_id}`.

### URL til produksjonsversjon (Render)

[https://applikasjonsutvikling-2.onrender.com](https://applikasjonsutvikling-2.onrender.com)

Du kan teste API-et direkte på denne URL-en.
