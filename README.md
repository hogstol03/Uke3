# UKE 9 - PWA

Dette prosjektet er en Progressiv Web App (PWA) laget med HTML, CSS, JavaScript og Express. Applikasjonen bruker en Service Worker for å cache ressurser.

## Hvordan bruke prosjektet
1. Kjøre lokalt med Liver Server:

For å få applikasjonen til å fungere, åpne index.html-filen i Live Server i VSCode.

2. Kjøre applikasjonen på server (node/express):

Jeg fikk noen problemer med å få serveren til å kjøre på en spesifikk port (f.eks. 8000 eller 8080).
Når jeg prøvde å starte applikasjonen ved å bruke kommandoen node script.mjs i terminalen, fikk jeg feilen EADDRINUSE: address already in use. Dette skjer når porten allerede er i bruk.
Jeg forsøkte å endre porten, men møtte lignende problemer. Fant ut at dette kunne bli løst ved å stoppe eventuelle kjørende prosesser på portene før oppstart, men fikk det fremdeles ikke til.
