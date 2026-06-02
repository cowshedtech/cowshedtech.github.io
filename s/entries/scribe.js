import { createApp, reactive } from 'vue';
import Main from '../vue/main.js';

window.addEventListener('load', () => {
  const reactiveTrack = reactive(window.editor.track);
  window.editor.track = reactiveTrack;

  const app = createApp(Main, {
    eventBus: window.eventBus,
    track: reactiveTrack
  });
  app.mount('#vue-app');
});
