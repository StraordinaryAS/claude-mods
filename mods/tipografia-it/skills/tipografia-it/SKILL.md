---
name: tipografia-it
description: Regole di tipografia italiana per scrivere, impaginare o rivedere testi in italiano (Word, PDF, InDesign, libri, pagine web e CSS). Usala per righe isolate, parole sganciate, spazi, giustificazione, lunghezza riga, trattini, virgolette caporali, apostrofo tipografico, accenti, font e interlinea.
---

# Tipografia italiana

Regole per testi in italiano destinati ad altri: documenti, PDF, libri, slide, pagine web. Non servono per il codice né per le risposte in chat.

## Quando usarla

- Scrivi o correggi un testo in italiano che verrà stampato, impaginato o pubblicato.
- Impagini un documento in Word, InDesign, LaTeX o un PDF.
- Scrivi HTML o CSS che contiene testo in italiano.
- Ti chiedono una revisione tipografica o una “bozza pulita”.

## Come funziona

Applica le regole mentre scrivi. Su un testo esistente, passa la checklist in fondo e correggi. Ogni regola dice cosa controllare e come risolvere su carta (Word, InDesign) e sul web (CSS).

### 1. Righe isolate e parole sganciate

| Errore | Cos’è |
| --- | --- |
| Vedova | Ultima riga di un paragrafo rimasta sola in cima alla pagina successiva. |
| Orfana | Prima riga di un paragrafo rimasta sola in fondo alla pagina. |
| Parola sganciata | Una sola parola, o una sillaba corta, sull’ultima riga di un paragrafo. |

- **Word**: Paragrafo › Distribuzione testo › Controllo righe isolate (attivo di default, verificalo). Per la parola sganciata unisci le ultime due parole con uno spazio unificatore (Ctrl+Maiusc+Spazio).
- **InDesign**: Opzioni di unione, con almeno 2 righe all’inizio e alla fine del paragrafo. Usa il Compositore paragrafo Adobe. Per la parola sganciata applica Nessuna interruzione alle ultime due parole o ritocca di poco il tracking (±10).
- **Web**: sul web non ci sono salti pagina. Contano le parole sganciate e la stampa della pagina.

```css
p { text-wrap: pretty; }          /* riduce le parole sganciate */
h1, h2, h3 { text-wrap: balance; } /* righe dei titoli di lunghezza simile */
@media print { p { orphans: 2; widows: 2; } }
```

In alternativa usa `&nbsp;` tra le ultime due parole di un titolo.

### 2. Spazi, giustificazione, lunghezza riga

- **Un solo spazio** dopo punto, virgola, punto e virgola, due punti. Mai il doppio spazio. Nessuno spazio prima della punteggiatura.
- **Spazio unificatore** tra numero e unità (10 km, 5 kg, 20 °C), tra iniziali e cognome (A. Rossi) e dopo abbreviazioni come “p.” o “art.”.
- **Fiumi bianchi**: nel testo giustificato attiva la sillabazione in italiano. Se i fiumi restano, allinea a sinistra.
  - Word: Layout › Sillabazione › Automatica, con la lingua del testo impostata su Italiano.
  - InDesign: Sillabazione attiva e lingua Italiano in Carattere.
- **Lunghezza riga**: 50–75 caratteri, spazi inclusi. Più lunga stanca, più corta spezza il ritmo.
- **Web**: sul web preferisci l’allineamento a sinistra. Giustifica solo con la sillabazione attiva.

```css
/* nell'HTML: <html lang="it"> */
p { max-width: 65ch; hyphens: auto; }
.giustificato { text-align: justify; hyphens: auto; }
```

`hyphens: auto` funziona solo se la pagina dichiara `lang="it"`.

### 3. Trattini

| Segno | Uso | Spazi |
| --- | --- | --- |
| Trattino breve `-` | Parole composte (socio-economico), codici, numeri di telefono | No |
| Trattino medio `–` | Intervalli (1915–1918, pagine 10–20), tratte (Roma–Milano) | No |
| Trattino lungo `—` | Da evitare | — |

- Per gli incisi usa virgole, parentesi o due punti, non il trattino lungo.
- Se uno stile editoriale impone i trattini per gli incisi, usa il trattino medio con gli spazi ( – così – ), mai il trattino breve.
- Per i dialoghi di narrativa usa le caporali, non i trattini.
- Il segno meno nei numeri negativi è `−` (U+2212), non il trattino.

### 4. Font e interlinea

- **Al massimo due famiglie di caratteri**: una per i titoli e una per il testo. Una sola famiglia ben usata va benissimo.
- Su carta un serif per il testo lungo si legge bene. Sullo schermo un buon sans è altrettanto valido.
- La gerarchia si fa con dimensione e peso, non aggiungendo font.
- **Interlinea su carta**: 120–140% del corpo (testo da 10 pt, interlinea da 12–14 pt).
- **Interlinea sul web**: più ampia, 1,5–1,7 per il testo e 1,1–1,2 per i titoli.

```css
body { line-height: 1.6; }
h1, h2, h3 { line-height: 1.15; }
```

### 5. Virgolette, apostrofo, accenti

- **Caporali « »** per citazioni e dialoghi. Nessuno spazio dentro: «Andiamo», non « Andiamo ».
- **Virgolette alte “ ”** per una citazione dentro un’altra citazione e per parole in senso ironico o particolare.
- **Virgolette semplici ‘ ’** solo per un terzo livello.
- Mai le virgolette dritte `"` nel testo: sono un segno da codice.
- **Punto e virgolette**: se la frase citata è completa, il punto va dentro le caporali: Disse: «Andiamo.» Se la citazione è un frammento, il punto va fuori: Lo definì «un errore».
- **Apostrofo tipografico ’**, mai quello dritto `'`: l’uomo, un’idea, po’.
- **Lettere accentate vere**: è, perché, più, città. Mai e', perche', piu'. Maiuscola: È, non E'.
- Accento grave e acuto: è (verbo), perché, poiché, affinché, né, sé con l’acuto.
- **Puntini di sospensione**: un solo carattere `…`, sempre tre punti, mai quattro.

```css
:lang(it) q { quotes: "«" "»" "“" "”" "‘" "’"; }
```

## Checklist di revisione

Passala su ogni testo prima di consegnarlo.

1. Nessun doppio spazio e nessuno spazio prima della punteggiatura.
2. Apostrofi tipografici ’ e accenti veri (è, perché, È).
3. Caporali « » come virgolette principali, nessuna virgoletta dritta.
4. Trattini: breve per i composti, medio per gli intervalli, nessun trattino lungo.
5. Nessuna parola sganciata nei titoli e a fine paragrafo.
6. Nessuna vedova o orfana nei documenti a pagine.
7. Righe di 50–75 caratteri.
8. Interlinea 120–140% su carta, 1,5–1,7 sul web.
9. Al massimo due famiglie di caratteri.
10. Giustificato solo con sillabazione in italiano, senza fiumi bianchi.

Per trovare in fretta gli errori meccanici in un file di testo:

```bash
grep -nE "  |\"|'|e' |perche'|--|—" file.md
```

## Esempi

**Prima**

> Il progetto - avviato nel 2019-2021 - e' stato definito "un successo" ;  la sede e' a Roma - Milano...

**Dopo**

> Il progetto, avviato nel 2019–2021, è stato definito «un successo»; la sede è sulla tratta Roma–Milano…

Cosa è cambiato: incisi con le virgole invece dei trattini, trattino medio negli intervalli, accenti veri, caporali al posto delle virgolette dritte, niente spazio prima del punto e virgola, niente doppio spazio, puntini in un carattere solo.
