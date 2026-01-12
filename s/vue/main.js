import RightHandContent from './components/TheContentRightHand/vue/right_hand_content.js'
import TimeSignature from './components/SignatureTime/vue/picker.js'
import LeftNavigation from './components/TheNavigationLeft/vue/navigation.js'
import TopNavigation from './components/TheNavigationTop/vue/top_navigation.js'
import MidiPlayer from './components/Player/vue/controls.js'
import UrlSync from './components/UrlSync/vue/url_sync.js'

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

  watch: {
    'track.version': function() {
      if (this.midiPlayer && typeof this.midiPlayer.noteHasChanged === 'function') {
        this.midiPlayer.noteHasChanged();
      }
      if (window.editorClickable && typeof window.editorClickable.update === 'function') {
        window.editorClickable.update(this.track);
      }
    }
    ,
    'metronomeState.version': function() {
      if (this.midiPlayer && typeof this.midiPlayer.noteHasChanged === 'function') {
        this.midiPlayer.noteHasChanged();
      }
      if (typeof updateCurrentURL === 'function') {
        updateCurrentURL();
      }
    }
  },

  mounted() {
    document.addEventListener('keydown', this.handleKeyDown);   
    document.addEventListener('click', this.handleClickOutside);
    this.eventBus.$on('playState', this.handlePlayState);
    this.eventBus.$on('playProgress', this.handlePlayProgress);
    this.eventBus.$on('loadMidi', this.handleLoadMidi);
  },

  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);          
    document.removeEventListener('click', this.handleClickOutside);
    this.eventBus.$off('playState', this.handlePlayState);
    this.eventBus.$off('playProgress', this.handlePlayProgress);
    this.eventBus.$off('loadMidi', this.handleLoadMidi);
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
        if (this.midiPlayer && typeof this.midiPlayer.getState === 'function' && this.midiPlayer.getState() === 'Stopped') {
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
        const highlightOn = this.options && this.options.highlightOn;
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
        if (playStarting && this.metronome && typeof this.metronome.getCountInActive === 'function' && this.metronome.getCountInActive()) {
          if (typeof window.buildMIDICountInTrack === 'function') {
            midiURL = window.buildMIDICountInTrack(window.editor.track.numBeats, window.editor.track.noteValue, this.midiPlayer.getTempo());
          } else {
            midiURL = createMidiUrlFromClickableUI("our_MIDI");
          }
          if (this.midiPlayer && typeof this.midiPlayer.noteHasChanged === 'function') {
            this.midiPlayer.noteHasChanged();
          }
          if (this.metronome && typeof this.metronome.setCountInIsPlaying === 'function') {
            this.metronome.setCountInIsPlaying(true);
          }
        } else {
          if (this.metronome && this.metronome.countInIsPlaying) {
            if (typeof this.metronome.setCountInIsPlaying === 'function') {
              this.metronome.setCountInIsPlaying(false);
            }
            if (typeof this.metronome.resetOptionsOffsetClickStartRotation === 'function') {
              this.metronome.resetOptionsOffsetClickStartRotation();
            }
          }
          if (typeof window.createMidiUrlFromClickableUI === 'function') {
            midiURL = window.createMidiUrlFromClickableUI("our_MIDI");
          } else {
            midiURL = createMidiUrlFromClickableUI("our_MIDI");
          }
          if (this.midiPlayer && typeof this.midiPlayer.resetNoteHasChanged === 'function') {
            this.midiPlayer.resetNoteHasChanged();
          }
        }
        if (this.midiPlayer && typeof this.midiPlayer.loadFromURL === 'function') {
          this.midiPlayer.loadFromURL(midiURL, this.midiPlayer.getTempo());
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