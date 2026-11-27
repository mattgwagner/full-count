# Full Count

A baseball math game in one HTML file. Every pitch comes with a problem: solve it and swing, or read the strike zone and take a ball. The faster the right answer, the harder the contact, and home runs mostly come from answering in the first fifth of the pitch clock. In the top half you field, and a right answer makes the play.

- **Leagues:** Sandlot (add/subtract, times tables, missing numbers), Rookie (negatives, squares, one-step equations, total bases), Minor League (two-step equations, percents, batting average, K/BB), The Show (x on both sides, ERA, slugging, hits needed, reaction time), Hall of Fame (the hardest set on a 25% faster clock). Answers are whole numbers and can be negative.
- **Play Ball:** 3, 6 or 9 innings against a CPU team, 5-run limit per half-inning, walk-offs, sac flies, double plays.
- **Home Run Derby:** 10 outs, every pitch a strike. Records are kept per league.
- **Season Pass:** XP from hits, outs, wins and daily challenges; 20 tiers (400 XP each) unlock bats, jerseys, home run fireworks, home run songs and titles in the Locker.
- **Stats:** a real career batting line (AVG/OBP/SLG/OPS) and math accuracy by skill. The **Flex Board** ranks every player on the device.
- Weaker skills come up more often.

Progress lives in localStorage (`fullcount.players`, `fullcount.p.<id>`). Art and sound are drawn and synthesized in code (Canvas 2D + Web Audio).

Keyboard: digits, `-` for the sign, Backspace, Enter to swing, `T` to take, Esc to pause.

## Run locally

```sh
bun server.ts                # http://127.0.0.1:4849
```

`?debug&speed=6` runs the game clock 6× faster. `node e2e/play.mjs <outDir>` plays a full game and a Derby headless and saves screenshots.

## Deploy

```sh
npm install
npm run deploy
```
