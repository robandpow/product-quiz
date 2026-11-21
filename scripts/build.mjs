import { cp, mkdir, readFile, stat, rm } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
const rounds = JSON.parse(await readFile('content/rounds.json','utf8'));
if (rounds.length !== 8) throw new Error('Expected eight rounds.');
for (const round of rounds) {
  if (round.products.length !== 4) throw new Error(`${round.id}: expected four products`);
  for (const p of round.products) {
    if (!(await stat(p.image)).size) throw new Error(`Empty image: ${p.image}`);
    if (p.real && (!p.sourceUrl || !p.evidenceUrl)) throw new Error(`Missing evidence: ${p.id}`);
  }
}
const output = resolve('dist');
if (dirname(output) !== resolve(process.cwd())) throw new Error('Build output must stay directly inside the workspace.');
// Remove only the verified generated output directory, so retired images do not ship.
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const assets = [...new Set(rounds.flatMap(round => round.products.map(p => p.image))), 'assets/favicon.svg', 'assets/fonts'];
for (const path of ['index.html','styles.css','app.js','quiz.mjs','content/rounds.json', ...assets]) {
  await mkdir(resolve('dist', path, '..'), { recursive:true });
  await cp(path, resolve('dist',path), { recursive:true });
}
console.log('Built dist/: 8 rounds, 32 local images.');
