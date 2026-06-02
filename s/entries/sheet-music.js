import { createApp, reactive } from 'vue';
import Main from '../vue/standalone/main_sheet_music.js';

/**
 * Mount a sheet-music-only Vue app for an embedded instance (see display_sheet_music.js).
 */
export function mountSheetMusicApp(elementId, inst) {
  const mountId = elementId || 'vue-app';
  const reactiveTrack = reactive(inst.track);
  inst.track = reactiveTrack;
  if (inst.editor) inst.editor.track = reactiveTrack;
  window.GrooveDisplay.activateInstance(inst);

  const app = createApp(Main, {
    track: reactiveTrack,
    instanceId: inst.id
  });
  app.mount('#' + mountId);
}

if (typeof window !== 'undefined') {
  window.mountSheetMusicApp = mountSheetMusicApp;
}
