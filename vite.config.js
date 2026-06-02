import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import inject from '@rollup/plugin-inject';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sRoot = path.resolve(__dirname, 's');
const globalsInjectPath = path.resolve(sRoot, 'build/runtime-globals.js');

function buildInjectMap() {
  const injectMap = {
    eventBus: [path.resolve(sRoot, 'vue/helpers/event-bus-esm.js'), 'eventBus'],
    EventTypes: [path.resolve(sRoot, 'vue/helpers/event-types.js'), 'EventTypes'],
    addInlineMetronomeSVG: [path.resolve(sRoot, 'vue/helpers/metronome-inline-svg.js'), 'addInlineMetronomeSVG'],
    Instruments: [globalsInjectPath, 'Instruments']
  };

  const constsSrc = readFileSync(path.resolve(sRoot, 'vue/consts.js'), 'utf8');
  for (const match of constsSrc.matchAll(/var (constant_\w+) =/g)) {
    injectMap[match[1]] = [globalsInjectPath, match[1]];
  }

  return injectMap;
}

export default defineConfig({
  root: sRoot,
  base: '/s/dist/',
  // Components use inline `template:` strings (not .vue SFCs). The default Vue export is
  // runtime-only and renders empty in production — match dev's CDN full build via esm-bundler.
  resolve: {
    alias: {
      vue: path.resolve(__dirname, 'node_modules/vue/dist/vue.esm-bundler.js')
    }
  },
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false
  },
  plugins: [
    {
      name: 'inject-legacy-globals',
      apply: 'build',
      config() {
        return {
          build: {
            rollupOptions: {
              plugins: [inject(buildInjectMap())]
            }
          }
        };
      }
    }
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: {
        scribe: path.resolve(sRoot, 'entries/scribe.js'),
        metronome: path.resolve(sRoot, 'entries/metronome.js'),
        'groove-display': path.resolve(sRoot, 'entries/groove-display.js'),
        'sheet-music': path.resolve(sRoot, 'entries/sheet-music.js')
      }
    }
  }
});
