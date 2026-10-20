# backwoodsfestival.se

Sajten för Backwoods Festival, hantverksfestivalen på Rotsågen i Rot, Älvdalen.
Vanlig HTML och CSS på GitHub Pages, utan byggsteg. Allt som pushas till `main`
går live direkt på https://backwoodsfestival.se.

## Sidor

| Fil | Sida |
| --- | --- |
| `index.html` | Hem |
| `biljetter.html` | Biljetter |
| `program.html` | Årets program |
| `hitta-hit.html` | Hitta hit (karta, vägbeskrivning, vanliga frågor) |
| `om-oss.html` | Om oss (historia, team, press, kontakt) |
| `utstallare.html` | Utställare |
| `galleri.html` | Bilder från 2026 (byggs från `_build/galleri.json`) |
| `integritet.html`, `cookies.html` | Policysidor |
| `404.html` | Visas när en sida saknas (använder absoluta sökvägar) |
| `kontakt.html` | Gammal adress, skickar vidare till `om-oss.html#kontakt` |

## Markeringar i koden

Sök efter dessa för att hitta rätt ställe direkt:

| Markering | Var | Vad |
| --- | --- | --- |
| `BW-PROGRAM` | `program.html` | Årets program: bakgrundsbild och texten på affischen |
| `BW-BILJETTER` | `biljetter.html` | Biljettsektionen ("släpps snart" eller Kwikk-widgeten) |
| `BW-EVENT-DATA` | `index.html`, `program.html` | Strukturerad data för Google och AI-sök (datum, plats) |
| `BW-DATUM` | `js/main.js` | Datumet (ÅÅÅÅ-MM-DD) som nedräkningen på startsidan räknar mot. Räknar kalenderdagar efter svensk tid och byter siffra vid midnatt |
| `BW:SIDHUVUD`, `BW:SIDFOT`, `BW:GEMENSAM-HEAD` | alla sidor | Gemensamma delar, se nedan |

## Gemensam meny och sidfot

Menyn, sidfoten, cookie-rutan och det gemensamma i `<head>` ligger i
`_build/partials/`. Ändra där och kör:

```
python3 _build/sync.py
```

Skriptet kopierar in delarna mellan markeringarna i varje sida och markerar
aktuell sida i menyn. Allt annat i sidorna lämnas orört. Mappen `_build`
publiceras inte.

## Byta program inför nytt år

1. Lägg bakgrundsbilden i `images/foto/` (webp, ca 1600 px bred).
2. I `program.html`, under `BW-PROGRAM`: byt sökvägen i `background-image`
   och uppdatera texten på affischen.
3. Uppdatera `BW-EVENT-DATA` i `program.html` och `index.html`.
4. Byt datum överallt (sök på `2027-05-15` och `15 maj 2027`), även `BW-DATUM` i `js/main.js`.
5. Uppdatera `lastmod` i `sitemap.xml` och texten i `llms.txt`.

## När biljetterna släpps

Steg för steg står i kommentaren under `BW-BILJETTER` i `biljetter.html`.
Kwikk-stilarna ligger i `css/kwikk.css` och laddas bara på biljettsidan.

## Bildgalleriet

Bilderna på `galleri.html` och deras alt-texter står i `_build/galleri.json`,
grupperade under rubriker. Lägg till en bild där och kör
`python3 _build/galleri.py`. Skriptet bygger galleriet och bildlistan i
`sitemap.xml`. Alla länkar med `data-forstora` (även startsidans galleri)
öppnas förstorade i en ruta.

## Bilder

- Festivalbilder ligger i `images/foto/` och heter
  `backwoods-ÅR-vad-som-syns-BREDD.webp`, t.ex.
  `backwoods-2026-bjorn-pa-baren-1600.webp`. Varje bild finns i 800, 1600
  och 2400 px bredd (stående bilder: 600, 1200 och 1800).
- Varje bild på sidan har en `alt`-text som beskriver vad som syns.
- Delningsbilden för Facebook m.fl. är `images/og-backwoods-2027.jpg`
  (1200 × 630).
- Loggor: `images/backwoods-logga-*.webp`. `backwoods-logga-rund.png` används
  i den strukturerade datan.
- Bilderna från 2026 är tagna av Tobbe Nilsson m.fl.

## Design

- Färger och mått ligger som variabler överst i `css/style.css`. Använd dem i
  stället för att skriva färgkoder i komponenter.
- Typsnitt: Bahianita (rubriker) och Courier Prime (brödtext), självhostade i
  `fonts/`.
- Programmet och biljettsläppet visas som en kraftpappersaffisch på
  armeringsnät, som skyltarna vid baren på festivalen.
- Mobilen först: grundreglerna gäller mobil, `@media` lägger på för större
  skärmar.

## SEO

- Titlar: `Sidnamn | Backwoods Festival 2027, Älvdalen` (startsidan
  undantagen). Skriv alltid ut Älvdalen, det finns en amerikansk musikfestival
  som också heter Backwoods.
- Varje sida har egen `description`, `canonical` och Open Graph-taggar med
  fullständiga adresser.
- `sitemap.xml`, `robots.txt` och `llms.txt` (sammanfattning för AI-sök) ligger
  i roten.

## Cookies

Google Analytics (`G-4Q9FT55M7K`) laddas först när besökaren säger ja i
cookie-rutan. Valet sparas i webbläsaren. Kartan på Hitta hit laddas först vid
klick.
