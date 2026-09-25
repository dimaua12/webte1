# Stručné poznámky k obhajobe

## HTML

Každá stránka má rovnakú hlavičku (`header`), navigáciu (`nav`) a pätičku (`footer`). V `main` je obsah konkrétnej stránky rozdelený na tematické `section`. Profil má aj `aside` s mottom; kontakt je v `address`. Nadpis `h1` pomenúva stránku a `h2` jej časti.

## Rozloženie a responzivita

V `css/styles.css` sú spoločné farby, medzery a zaoblenie uložené ako premenné v `:root`. Flexbox usporadúva navigáciu, pätičku a riadky zručností. Grid vytvára tri karty na profile, dva stĺpce životopisu a polia pri mape. Na profile fotografia pláva vľavo pomocou `float`, aby text obtekal sprava. Pri šírke do 768 px sa navigácia mení na tlačidlo Menu, stĺpce sa skladajú pod seba a fotografia už neobteká text. Tabuľka rozvrhu sa na úzkych obrazovkách posúva vodorovne.

## JavaScript

V `js/script.js` tlačidlo Menu prepína triedu `is-open` a atribút `aria-expanded`. Rozvrh číta z buniek `data-day`, `data-start` a `data-end`; podľa aktuálneho času označí práve prebiehajúcu hodinu alebo nájde najbližšiu ďalšiu. Filter iba skryje obsah buniek iného typu. Percento semestra je pomer uplynutého času k celému obdobiu medzi `SEMESTER_START` a `SEMESTER_END`.

Pracovný stôl nepotrebuje JavaScript: päť rádiových tlačidiel je položených nad fotografiou a CSS podľa `:checked` ukáže jeden z piatich panelov. Na mobile majú panely stále rovnaké miesto a výšku pod obrázkom.

## localStorage na mape

Nový bod sa uloží ako objekt s názvom a súradnicami. `JSON.stringify(points)` prevedie celé pole na text pre `localStorage`. Pri ďalšom otvorení stránky `JSON.parse(...)` vráti pole späť; z neho sa znovu vytvoria značky a možnosti v zozname. Údaje sú uložené iba v danom prehliadači.

## Haversinov vzorec

Funkcia `haversineDistance` dostane zemepisné šírky a dĺžky dvoch bodov. Rozdiely uhlov prevedie zo stupňov na radiány a pomocou sínusu a kosínusu vypočíta časť oblúka na Zemi. Výsledný stredový uhol vynásobí polomerom Zeme 6371 km. Výsledok je vzdušná vzdialenosť, nie dĺžka cesty po uliciach. Kontrolný príklad: body `(0°, 0°)` a `(0°, 1°)` sú vzdialené približne 111,195 km.
