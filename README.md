# claude-mods

I mods di Ale per Claude Code (terminale, scheda Code del desktop, VS Code).

## Installazione

Una volta sola, nel terminale:

```
claude plugin marketplace add StraordinaryAS/claude-mods
claude plugin install guardia-regole@ale-mods
claude plugin install scelta-modello@ale-mods
```

Dentro una sessione Claude Code: `/plugin install guardia-regole --marketplace StraordinaryAS/claude-mods`

App desktop senza terminale: **+** accanto al prompt › **Plugins** › **Add marketplace** › `StraordinaryAS/claude-mods` › **Add plugin**.

Aggiornare dopo nuove versioni: `claude plugin marketplace update ale-mods`, poi `/reload-plugins` nella sessione.

## Mods

| Mod | Cosa fa |
| --- | --- |
| `guardia-regole` | Blocca commit e push su `main`/`master` e i segreti in chiaro (token, chiavi, password) nei file scritti da Claude. I file `.env` sono ammessi. |
| `scelta-modello` | Per ogni messaggio sceglie Haiku (traduzioni, riassunti, formattazione), Opus (piani, architettura, bug, revisioni) o Sonnet (tutto il resto). Le conferme ("vai", "ok", "2") tengono il modello di prima. `@haiku`, `@sonnet`, `@opus` a inizio messaggio forzano la scelta. A conversazione lunga non scende di livello, per non perdere la cache. `/modello-auto off` lo spegne. Regole in `mods/scelta-modello/hooks/rules.ts`. |

## Aggiungere un mod

Nuova cartella `mods/<nome>/` con `.claude-plugin/plugin.json`, `hooks/hooks.json`, `hooks/register.ts` e test in `tests/`. Poi una voce in `.claude-plugin/marketplace.json`. Controllo: `claude plugin validate mods/<nome>` e `claude plugin test mods/<nome>`.
