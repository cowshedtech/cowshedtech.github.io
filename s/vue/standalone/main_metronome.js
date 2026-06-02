import { reactive, provide as vueProvide } from 'vue'
import MetronomeNavigation from '../components/Metronome/vue/menu_main.js'

// Standalone metronome page root (see index_metronome.html).
// The metronome UI (menu_main -> menu_options -> offset-click/speed menus) injects
// metronome/metronomeState/midiPlayer/track and emits on the shared eventBus, so we
// create those globals here (if a host page hasn't already) and provide them.
export default {
  components: {
    MetronomeNavigation
  },

  setup() {
    if (typeof Metronome === 'function' && !window.metronome) window.metronome = new Metronome();
    if (!window.metronomeState) window.metronomeState = reactive({ version: 0 });
    if (typeof Track === 'function' && !window.track) window.track = reactive(new Track());
    if (typeof MIDIPlayer === 'function' && !window.midiPlayer) {
      window.midiPlayer = new MIDIPlayer(window.track ? window.track.trackID : 0);
    }

    vueProvide('metronome', window.metronome);
    vueProvide('metronomeState', window.metronomeState);
    vueProvide('track', window.track);
    vueProvide('midiPlayer', window.midiPlayer);

    return { eventBus: window.eventBus }
  },

  template: `
    <div id="TopNav" class="fullWidthEle">
      <span id="upperLeft">
        <MetronomeNavigation :eventBus="eventBus"></MetronomeNavigation>
      </span>
    </div>
	`
  }
