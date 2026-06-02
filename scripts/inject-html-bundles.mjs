import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const assets = JSON.parse(readFileSync(path.join(repoRoot, 's/dist/assets.json'), 'utf8'));

const replacements = [
  {
    file: path.join(repoRoot, 's/index.html'),
    marker: 'VITE_SCRIBE_ENTRY',
    script: `		<script type="module" crossorigin src="/s/dist/${assets.scribe}"></script>`
  },
  {
    file: path.join(repoRoot, 's/index_metronome.html'),
    marker: 'VITE_METRONOME_ENTRY',
    script: `		<script type="module" crossorigin src="/s/dist/${assets.metronome}"></script>`
  }
];

for (const { file, marker, script } of replacements) {
  const src = readFileSync(file, 'utf8');
  const re = new RegExp(
    `<!-- ${marker} -->[\\s\\S]*?<!-- /${marker} -->`,
    'm'
  );
  if (!re.test(src)) {
    throw new Error(`Marker <!-- ${marker} --> not found in ${file}`);
  }
  const next = src.replace(re, script);
  writeFileSync(file, next);
  console.log(`Injected ${marker} into ${path.relative(repoRoot, file)}`);
}
