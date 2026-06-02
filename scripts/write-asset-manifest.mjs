import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const manifestPath = path.join(repoRoot, 's/dist/.vite/manifest.json');
const outPath = path.join(repoRoot, 's/dist/assets.json');

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

const entryKeys = {
  scribe: 'entries/scribe.js',
  metronome: 'entries/metronome.js',
  'groove-display': 'entries/groove-display.js',
  'sheet-music': 'entries/sheet-music.js'
};

const assets = {};
for (const [name, key] of Object.entries(entryKeys)) {
  const entry = manifest[key];
  if (!entry) {
    throw new Error(`Missing manifest entry for ${key}`);
  }
  assets[name] = entry.file;
}

writeFileSync(outPath, JSON.stringify(assets, null, 2) + '\n');
console.log('Wrote', outPath, assets);
