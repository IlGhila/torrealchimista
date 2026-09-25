# La Torre dell'Alchimista — sito ufficiale

Sito statico (HTML/CSS/JS, nessuna dipendenza) della band di rock progressivo
**La Torre dell'Alchimista**, Bergamo.

## Struttura

```
index.html
assets/
  css/style.css
  js/main.js
  bg/       fasce di sfondo (l'illustrazione originale tagliata in 6)
  img/      logotipi, copertine, fotografie
```

## Anteprima in locale

```
node serve.js        →  http://localhost:8080
```

## Come è gestito lo sfondo

L'illustrazione originale è un unico file da 3764x6688 px (35 MB), composto a
fasce orizzontali. È stata tagliata nelle 6 fasce corrispondenti alle sezioni
(stacchi a y = 2040 / 3165 / 4360 / 5194 / 5952) e convertita in WebP a due
risoluzioni: **~1 MB in totale** invece di 35.

Ogni sezione porta la propria fascia più il colore piatto campionato da essa.

Per rigenerare le fasce dall'originale serve `ffmpeg`; i comandi sono
documentati in `assets/bg/README.md`.

## Struttura delle sezioni

Sopra i **1024 px** ogni sezione è alta quanto la finestra ed è
`position:sticky; top:0` con z-index crescente: resta ferma mentre la
successiva le scorre sopra, così ognuna sembra formarsi dalla precedente.
È lo stesso meccanismo del sito personale (mghilardini.it).

Le fasce originali sono panoramiche (da 3,1:1 a 5,1:1) e non possono riempire
uno schermo 16:9. Ogni fascia sta quindi su un proprio livello (`.sec::after`)
appoggiato in fondo alla sezione, alto `--fascia-h` (42svh): è l'orizzonte
dipinto, e il colore piatto della fascia occupa il resto, dove vive il testo.
La sezione si riserva quello spazio con `padding-bottom: var(--fascia-h)`,
perciò testo e disegno non si toccano mai. Fa eccezione la Home, la cui fascia
è quasi 2:1 e regge il taglio a tutto schermo.

La scala tipografica di questa modalità è legata a `--u: min(1vw, 1.71svh)`:
su una finestra bassa il testo rimpicciolisce da solo e continua a stare nello
spazio disponibile invece di farsi tagliare.

Sotto i 1024 px il pin si disattiva (`position:relative`, **non** `static`: la
sezione deve restare il riferimento dei propri livelli assoluti, altrimenti si
ancorano a `<main>` e finiscono tutti in fondo alla pagina) e le sezioni
tornano in flusso normale, con la fascia larga 100% in coda.

### Se vuoi che l'illustrazione riempia tutto lo schermo

Servono fasce **molto più alte**: circa **16:9** (es. 2560×1440 per fascia) per
il desktop. Con quelle, il livello illustrato può passare da 42svh a `inset:0`
come la Home, e il colore piatto sparisce del tutto.

## Movimenti

Stesso vocabolario del sito personale (mghilardini.it), per coerenza fra i due:

- **comparsa allo scroll, reversibile** — attributo `data-reveal`
  sull'elemento, con `transition: opacity 1s ease, transform 1s ease` e
  ritardi sfalsati di ~.12s tramite la variabile `--d` scritta nell'HTML.
  Un IntersectionObserver in `main.js` aggiunge `.is-in` quando l'elemento
  sale oltre il bordo inferiore e **la toglie quando ci ritorna sotto**:
  scorrendo avanti e indietro la scena si ricompone ogni volta.
  Chi esce dal bordo *superiore* resta visibile — toglierlo lì farebbe sparire
  un testo che si sta ancora leggendo. Il segno di `boundingClientRect.top`
  distingue i due casi.
  Il ritorno è più svelto dell'andata (.55s) e senza scalata dei ritardi.
  Direzioni: predefinita dal basso, `data-reveal="left"` per le intro di
  sezione, `data-reveal="right"` per copertine, date e card.
- **filetto dorato** — non sfuma: si disegna da 0 a 58px.
- **apertura** — il titolo sale da dietro la propria riga (`heroUp`), la barra
  di navigazione scende (`navIn`, in CSS: se il JS non parte resta visibile).
- **pulsazioni** — respiro lento dell'illustrazione di apertura (`slowzoom`,
  42s), rimbalzo della freccia di scorrimento (`scrollBounce`, 1,6s), anello
  pulsante sul pallino delle card Media al passaggio del mouse (`pulseRing`).

Tutto è disattivato sotto `prefers-reduced-motion: reduce`, e un blocco
`<noscript>` mostra ogni contenuto se il JavaScript è disabilitato.

## Da completare

- indirizzo email e link reali a Instagram / Facebook / YouTube (sezione Contatti)
- date dei concerti
- link ai video nella sezione Media
