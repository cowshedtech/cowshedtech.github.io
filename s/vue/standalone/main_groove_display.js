// Standalone "groove display" root component.
// Renders read-only sheet music together with the MIDI player controls.
// Mirrors the MIDI event wiring that the full app performs in vue/main.js, but
// trimmed down to what an embedded groove display needs (no clickable editor,
// navigation, or URL syncing).
//
// This component is multi-instance aware: several groove displays can live on a
// single page (see GrooveMultiDisplay.html). Each one owns its own track,
// options, sheetMusic, midiPlayer and metronome. The shared abc2svg / MIDI
// helpers read module globals, so before we render or build MIDI for an instance
// we "activate" it (swap those globals onto this instance). Player events travel
// on a shared event bus, so each handler ignores events that did not originate
// from its own midiPlayer.
import SheetMusic from '../components/DisplaySheetMusic/vue/display.js'
import MidiPlayer from '../components/Player/vue/controls.js'
import { provide as vueProvide, markRaw } from 'vue'

export default {
  components: {
    SheetMusic,
    MidiPlayer
  },

  props: {
    track: {
      type: Object,
      required: true
    },
    instanceId: {
      type: [Number, String],
      required: true
    }
  },

  setup(props) {
    const inst = window.GrooveDisplay && window.GrooveDisplay.__instances
      ? window.GrooveDisplay.__instances[props.instanceId]
      : null

    if (inst) {
      vueProvide('options', inst.options)
      vueProvide('track', props.track)
      vueProvide('midiPlayer', inst.midiPlayer)
      vueProvide('metronome', inst.metronome)
      vueProvide('sheetMusic', inst.sheetMusic)
      vueProvide('gsActivate', () => window.GrooveDisplay.activateInstance(inst))
      vueProvide('gsUid', '_' + inst.id)
    }

    return { inst: inst ? markRaw(inst) : null }
  },

  mounted() {
    this._onPlayState = () => this.handlePlayState()
    this._onPlayProgress = (data) => this.handlePlayProgress(data)
    this._onLoadMidi = (data) => this.handleLoadMidi(data)
    if (window.eventBus) {
      window.eventBus.$on('playState', this._onPlayState)
      window.eventBus.$on('playProgress', this._onPlayProgress)
      window.eventBus.$on('loadMidi', this._onLoadMidi)
    }
    // Load the soundfont / MIDI plugin once for the whole page, then mark this
    // instance's player ready so its play button enables.
    const player = this.inst ? this.inst.midiPlayer : window.midiPlayer
    if (window.GrooveDisplay && typeof window.GrooveDisplay.ensureMidiLoaded === 'function') {
      window.GrooveDisplay.ensureMidiLoaded(() => {
        if (player && typeof player.setState === 'function') player.setState('Stopped')
      })
    } else if (player && typeof player.initialise === 'function') {
      player.initialise()
    }
  },

  beforeUnmount() {
    if (window.eventBus) {
      if (this._onPlayState) window.eventBus.$off('playState', this._onPlayState)
      if (this._onPlayProgress) window.eventBus.$off('playProgress', this._onPlayProgress)
      if (this._onLoadMidi) window.eventBus.$off('loadMidi', this._onLoadMidi)
    }
  },

  methods: {
    // True when an event belongs to this instance's player (or carries no source).
    _isMine(data) {
      if (!data || !data.player) return true
      return !this.inst || data.player === this.inst.midiPlayer
    },

    _activate() {
      if (this.inst && window.GrooveDisplay && typeof window.GrooveDisplay.activateInstance === 'function') {
        window.GrooveDisplay.activateInstance(this.inst)
      }
    },

    handlePlayState() {
      try {
        const player = this.inst ? this.inst.midiPlayer : window.midiPlayer
        const sheet = this.inst ? this.inst.sheetMusic : window.sheetMusic
        if (player && typeof player.getState === 'function' && player.getState() === 'Stopped') {
          if (sheet && typeof sheet.stop === 'function') sheet.stop()
        }
      } catch (e) {
        // no-op
      }
    },

    handlePlayProgress(data) {
      try {
        if (!this._isMine(data)) return
        const sheet = this.inst ? this.inst.sheetMusic : window.sheetMusic
        const opts = this.inst ? this.inst.options : window.options
        const percentComplete = data && data.percentComplete
        const highlightOn = opts && opts.highlightOn
        if (percentComplete && highlightOn) {
          if (sheet && typeof sheet.highlightNote === 'function') sheet.highlightNote(percentComplete)
        }
      } catch (e) {
        // no-op
      }
    },

    handleLoadMidi(data) {
      try {
        if (!this._isMine(data)) return

        // Point the shared globals (editor.track/options/metronome/midiPlayer) at this
        // instance so the global MIDI builder reads the right groove.
        this._activate()

        const player = this.inst ? this.inst.midiPlayer : window.midiPlayer
        const metronome = this.inst ? this.inst.metronome : window.metronome
        const track = this.inst ? this.inst.track : this.track

        let midiURL
        const playStarting = data && data.playStarting
        if (playStarting && metronome && typeof metronome.getCountInActive === 'function' && metronome.getCountInActive()) {
          if (typeof window.buildMIDICountInTrack !== 'function') return
          midiURL = window.buildMIDICountInTrack(track.numBeats, track.noteValue, player.getTempo())
          if (player && typeof player.noteHasChanged === 'function') player.noteHasChanged()
          if (typeof metronome.setCountInIsPlaying === 'function') metronome.setCountInIsPlaying(true)
        } else {
          if (metronome && metronome.countInIsPlaying) {
            if (typeof metronome.setCountInIsPlaying === 'function') metronome.setCountInIsPlaying(false)
            if (typeof metronome.resetOptionsOffsetClickStartRotation === 'function') metronome.resetOptionsOffsetClickStartRotation()
          }
          if (typeof window.createMidiUrlFromClickableUI !== 'function') return
          midiURL = window.createMidiUrlFromClickableUI('our_MIDI')
          if (player && typeof player.resetNoteHasChanged === 'function') player.resetNoteHasChanged()
        }
        if (player && typeof player.loadFromURL === 'function') {
          player.loadFromURL(midiURL, player.getTempo())
        }
      } catch (e) {
        // no-op
      }
    }
  },

  template: `
    <SheetMusic></SheetMusic>
    <div class="nonPrintable">
      <MidiPlayer></MidiPlayer>
    </div>
	`
}
