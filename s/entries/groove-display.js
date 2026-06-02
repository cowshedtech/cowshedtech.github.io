import { createApp, reactive } from 'vue';
import Main from '../vue/standalone/main_groove_display.js';

/**
 * Mount a groove-display Vue app for an embedded instance (see display_sheet_music.js).
 */
export function mountGrooveDisplayApp(elementId, inst) {
  const mountId = elementId || 'vue-app';
  const reactiveTrack = reactive(inst.track);
  inst.track = reactiveTrack;
  inst.editor.track = reactiveTrack;
  window.GrooveDisplay.activateInstance(inst);

  const app = createApp(Main, {
    track: reactiveTrack,
    instanceId: inst.id
  });
  app.mount('#' + mountId);
}

if (typeof window !== 'undefined') {
  window.mountGrooveDisplayApp = mountGrooveDisplayApp;
}
