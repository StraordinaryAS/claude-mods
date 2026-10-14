# claude-mods

I mods di Ale per Claude Code (terminale, scheda Code del desktop, VS Code).

## Installazione

Una volta sola, nel terminale:

```
claude plugin marketplace add StraordinaryAS/claude-mods
claude plugin install guardia-regole@ale-mods
claude plugin install tipografia-it@ale-mods
```

Dentro una sessione Claude Code: `/plugin install guardia-regole --marketplace StraordinaryAS/claude-mods`

App desktop senza terminale: **+** accanto al prompt › **Plugins** › **Add marketplace** › `StraordinaryAS/claude-mods` › **Add plugin**.

Aggiornare dopo nuove versioni: `claude plugin marketplace update ale-mods`, poi `/reload-plugins` nella sessione.

## Mods

| Mod | Cosa fa |
| --- | --- |
| `guardia-regole` | Blocca commit e push su `main`/`master` e i segreti in chiaro (token, chiavi, password) nei file scritti da Claude. I file `.env` sono ammessi. |
| `tipografia-it` | Skill con le regole di tipografia italiana per documenti, PDF e web: righe isolate, spazi, trattini, caporali, apostrofo ’, accenti, font e interlinea. |

## Skill nella chat claude.ai

I plugin non arrivano nella chat di claude.ai. Per avere `tipografia-it` anche lì, comprimi la cartella `mods/tipografia-it/skills/tipografia-it` in uno zip e caricalo da **Impostazioni › Funzionalità › Skill › Carica skill**.

## Aggiungere un mod

Nuova cartella `mods/<nome>/` con `.claude-plugin/plugin.json`, `hooks/hooks.json`, `hooks/register.ts` e test in `tests/`. Poi una voce in `.claude-plugin/marketplace.json`. Controllo: `claude plugin validate mods/<nome>` e `claude plugin test mods/<nome>`.
