import RightHandContent from './components/TheContentRightHand/vue/right_hand_content.js'
import TimeSignature from './components/SignatureTime/vue/picker.js'
import LeftNavigation from './components/TheNavigationLeft/vue/navigation.js'
import TopNavigation from './components/TheNavigationTop/vue/top_navigation.js'
import MidiPlayer from './components/Player/vue/controls.js'
import UrlSync from './components/UrlSync/vue/url_sync.js'
import { reactive, markRaw, provide as vueProvide } from 'vue'
import { onDocumentLoaded } from './helpers/on-document-loaded.js'

// Initialize core globals (moved from index.html) so they're part of the Vue app bundle
if (!window.editor) window.editor = { class_permutation_type: "none" };
if (!window.editorClickable) window.editorClickable = new EditorClickable();
if (!window.options) window.options = new Options();
if (!window.metronome) window.metronome = new Metronome();
if (!window.sheetMusic) window.sheetMusic = new SheetMusic();
if (!window.editor.track) window.editor.track = new Track();
if (!window.abcToSVGCallback) window.abcToSVGCallback = new SVGLibCallback(window.editor.track);

// Back-compat lightweight object for legacy calls
if (!window.myGrooveWriter) {
  window.myGrooveWriter = {
    updateFromURL: function(encodedURLData) {
      if (typeof window.updateFromURL === 'function') window.updateFromURL(encodedURLData);
    },
    get_FullURLForPage: function(url_destination) {
      return (typeof window.get_FullURLForPage === 'function')
        ? window.get_FullURLForPage(url_destination)
        : window.location.href;
    }
  };
}

// Define global URL helpers (moved from index.html)
if (typeof window.updateFromURL !== 'function') {
  window.updateFromURL = function(encodedURLData) {
    try {
      const track = window.getGrooveDataFromUrlString(
        encodedURLData,
        window.editor.track,
        window.options,
        window.midiPlayer,
        window.metronome,
        window.options && window.options.debugMode
      );
      if (window.editorClickable && typeof window.editorClickable.update === 'function') {
        window.editorClickable.update(window.editor.track);
      }
      // Relayout using existing Track API (mirrors usage elsewhere)
      if (window.editor && window.editor.track && typeof window.editor.track.changeDivision === 'function') {
        window.editor.track.changeDivision(window.editor.track.timeDivision);
      }
    } catch (e) {
      // no-op
    }
  };
}
if (typeof window.get_FullURLForPage !== 'function') {
  window.get_FullURLForPage = function(url_destination) {
    try {
      return window.getUrlStringFromGrooveData(
        window.editor.track,
        window.options,
        window.midiPlayer,
        window.metronome,
        url_destination
      );
    } catch (e) {
      return window.location.href;
    }
  };
}
// Attach helpers to legacy holders for back-compat
if (window.editor) window.editor.updateFromURL = window.updateFromURL;
if (window.myGrooveWriter) window.myGrooveWriter.updateFromURL = window.updateFromURL;
if (window.editor) window.editor.get_FullURLForPage = window.get_FullURLForPage;
if (window.myGrooveWriter) window.myGrooveWriter.get_FullURLForPage = window.get_FullURLForPage;

// Wrap Options in a reactive proxy and replace the global reference
if (window.options) window.options = reactive(window.options);
// Provide Metronome as a raw class instance plus a reactive state for reactivity
if (window.metronome) {
  const rawMetronome = markRaw(window.metronome);
  const metronomeState = reactive({ version: rawMetronome.version || 0 });
  window.metronome = rawMetronome;
  window.metronomeState = metronomeState;
}

// Ensure MIDI player exists and is initialised; run initial URL sync
if (!window.midiPlayer && typeof MIDIPlayer === 'function') {
  window.midiPlayer = new MIDIPlayer(window.editor.track.trackID);
}
if (window.midiPlayer && typeof midiEventCallbackClass === 'function') {
  window.midiPlayer.eventCallbacks = new midiEventCallbackClass();
}
// Delay initial URL load and player init until window load (ensures AudioContext/user gesture readiness).
// onDocumentLoaded also runs immediately if load already fired (Vite bundle may arrive late).
onDocumentLoaded(() => {
  try { window.updateFromURL(window.location.search); } catch (e) { /* no-op */ }
  if (window.midiPlayer && typeof window.midiPlayer.initialise === 'function') {
    window.midiPlayer.initialise();
  }
});

const KEYS = {
  Z: 'Z',
  Y: 'Y'
};

export default {
  props: {
    eventBus: {
      type: Object,
      required: true
    },
    track: {
      type: Object,
      required: false
    }
  },
  
  inject: ['midiPlayer', 'metronome', 'metronomeState', 'options'],

  // Extra-safe global provides using Composition API to ensure availability to all descendants
  setup(props) {
    try {
      vueProvide('options', window.options);
      vueProvide('metronome', window.metronome);
      vueProvide('metronomeState', window.metronomeState);
      vueProvide('midiPlayer', window.midiPlayer);
      vueProvide('track', props.track || window.editor.track);
    } catch (e) {
      // no-op
    }
    return {};
  },

  provide() {
    return {
      options: window.options,
      metronome: window.metronome,
      metronomeState: window.metronomeState,
      midiPlayer: window.midiPlayer,
      track: this.track || window.editor.track
    };
  },

  watch: {
    'track.version': function() {
      if (window.midiPlayer && typeof window.midiPlayer.noteHasChanged === 'function') {
        window.midiPlayer.noteHasChanged();
      }
      if (window.editorClickable && typeof window.editorClickable.update === 'function') {
        window.editorClickable.update(this.track);
      }
    }
    ,
    'metronomeState.version': function() {
      if (window.midiPlayer && typeof window.midiPlayer.noteHasChanged === 'function') {
        window.midiPlayer.noteHasChanged();
      }
      if (typeof updateCurrentURL === 'function') {
        updateCurrentURL();
      }
    }
  },

  mounted() {
    document.addEventListener('keydown', this.handleKeyDown);   
    document.addEventListener('click', this.handleClickOutside);
    // Bind handlers to preserve component context for eventBus callbacks
    this._onPlayState = (data) => this.handlePlayState(data);
    this._onPlayProgress = (data) => this.handlePlayProgress(data);
    this._onLoadMidi = (data) => this.handleLoadMidi(data);
    if (window.eventBus) {
      window.eventBus.$on('playState', this._onPlayState);
      window.eventBus.$on('playProgress', this._onPlayProgress);
      window.eventBus.$on('loadMidi', this._onLoadMidi);
    }
  },

  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);          
    document.removeEventListener('click', this.handleClickOutside);
    if (window.eventBus) {
      if (this._onPlayState) window.eventBus.$off('playState', this._onPlayState);
      if (this._onPlayProgress) window.eventBus.$off('playProgress', this._onPlayProgress);
      if (this._onLoadMidi) window.eventBus.$off('loadMidi', this._onLoadMidi);
    }
  },

  methods: {
    handleKeyDown(event) {
      if (event.target.type == "range" || (event.target.tagName.toUpperCase() != "INPUT" && event.target.tagName.toUpperCase() != "TEXTAREA")) {       
        switch (event.code) {
          case KEYS.Z:
            if (e.ctrlKey) {
							root.undoCommand();
							return false;
						}
            break;
          case KEYS.Y:
            if (e.ctrlKey) {
							root.redoCommand();
							return false;
						}
						break;
        }
      }
      return true;
    },

    handleClickOutside(event){
      this.eventBus.$emit('close-all-menus');
		},

    handlePlayState() {
      try {
        if (window.midiPlayer && typeof window.midiPlayer.getState === 'function' && window.midiPlayer.getState() === 'Stopped') {
          if (window.sheetMusic && typeof window.sheetMusic.stop === 'function') {
            window.sheetMusic.stop();
          }
          if (window.editorClickable && typeof window.editorClickable.stop === 'function') {
            window.editorClickable.stop();
          }
        }
      } catch (e) {
        // no-op
      }
    },

    handlePlayProgress(data) {
      try {
        const percentComplete = data && data.percentComplete;
        const highlightOn = window.options && window.options.highlightOn;
        if (percentComplete && highlightOn) {
          if (window.sheetMusic && typeof window.sheetMusic.highlightNote === 'function') {
            window.sheetMusic.highlightNote(percentComplete);
          }
          if (window.editor && window.editorClickable && typeof window.editorClickable.hilight_note === 'function') {
            const t = window.editor.track;
            const classType = window.editor.class_permutation_type;
            const useTriplets = typeof window.usingTriplets === 'function' ? window.usingTriplets() : false;
            window.editorClickable.hilight_note(
              null,
              percentComplete,
              classType,
              t.numBeats,
              t.noteValue,
              t.numberOfMeasures,
              t.notesPerMeasure,
              t.repeatedMeasures,
              useTriplets
            );
          }
        }
      } catch (e) {
        // no-op
      }
    },

    handleLoadMidi(data) {
      try {
        let midiURL;
        const playStarting = data && data.playStarting;
        if (playStarting && window.metronome && typeof window.metronome.getCountInActive === 'function' && window.metronome.getCountInActive()) {
          if (typeof window.buildMIDICountInTrack !== 'function') return;
          midiURL = window.buildMIDICountInTrack(window.editor.track.numBeats, window.editor.track.noteValue, window.midiPlayer.getTempo());
          if (window.midiPlayer && typeof window.midiPlayer.noteHasChanged === 'function') {
            window.midiPlayer.noteHasChanged();
          }
          if (window.metronome && typeof window.metronome.setCountInIsPlaying === 'function') {
            window.metronome.setCountInIsPlaying(true);
          }
        } else {
          if (window.metronome && window.metronome.countInIsPlaying) {
            if (typeof window.metronome.setCountInIsPlaying === 'function') {
              window.metronome.setCountInIsPlaying(false);
            }
            if (typeof window.metronome.resetOptionsOffsetClickStartRotation === 'function') {
              window.metronome.resetOptionsOffsetClickStartRotation();
            }
          }
          if (typeof window.createMidiUrlFromClickableUI !== 'function') return;
          midiURL = window.createMidiUrlFromClickableUI("our_MIDI");
          if (window.midiPlayer && typeof window.midiPlayer.resetNoteHasChanged === 'function') {
            window.midiPlayer.resetNoteHasChanged();
          }
        }
        if (window.midiPlayer && typeof window.midiPlayer.loadFromURL === 'function') {
          window.midiPlayer.loadFromURL(midiURL, window.midiPlayer.getTempo());
        }
      } catch (e) {
        // no-op
      }
    },
  },
  
  components: {
    LeftNavigation, RightHandContent, TimeSignature, TopNavigation, MidiPlayer, UrlSync
  },
  
  template: `
    <div class="nonPrintable">
			<LeftNavigation></LeftNavigation>
      <TopNavigation
        :eventBus="eventBus">
      </TopNavigation>		      
      <MidiPlayer></MidiPlayer>
    </div>			
    <RightHandContent :track="track"></RightHandContent>
    <UrlSync></UrlSync>		    
	`
}