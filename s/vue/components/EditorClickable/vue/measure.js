import { h, isReactive } from 'vue'
import MeasureButtonAddStart from './measure_button_add_start.js'
import MeasureControls from './measure_controls.js'
import Stickings from './stickings.js'
import LineLabels from './line_labels.js'
import HighHats from './highhats.js'
import Toms from './toms.js'
import Snares from './snares.js'
import Kick from './kicks.js'
import Highlights from './highlights.js'
import StaffLines from './staff_line.js'

export default {
  data() {
    return {
      trackData: editor.track ? editor.track : null,
      constants: {
        TOM1_ON: constant_ABC_T1_Normal,
        TOM1_MIDI_NORMAL: constant_OUR_MIDI_TOM1_NORMAL,
        TOM4_ON: constant_ABC_T4_Normal,
        TOM4_MIDI_NORMAL: constant_OUR_MIDI_TOM4_NORMAL,
      },
    }
  },
  
  props: {
    midiPlayer: {
      type: Object,
      required: false
    }, 
    track: {
      type: Object,
      required: true
    },
    measureIndex: {
      type: Number,
      required: true
    },    
  },

  watch: { 
    track: {
      handler(newVal, oldVal) { 
        this.trackData = newVal;                
      },
      deep: true
    },    
  },

  components: {
    MeasureButtonAddStart, MeasureControls, Stickings, LineLabels, HighHats, Toms, Snares, Kick, Highlights, StaffLines
  },

  template: `
    <div>
      <MeasureButtonAddStart :measureIndex="measureIndex" />
      <div class="staff-container" id="staff-container1">
        <Stickings :track="track" :measureIndex="measureIndex" />
        <span class="notes-row-container">
          <span>
            <LineLabels :measureIndex="measureIndex" />
            <div class="music-line-container">
              <div class="notes-container">
                <StaffLines />
                <Highlights :track="track" :measureIndex="measureIndex" />
                <HighHats :track="track" :measureIndex="measureIndex" :midiPlayer="midiPlayer"/>
                <Toms :track="track" :measureIndex="measureIndex" :tomIndex="1" :abcOn="constants.TOM1_ON" :midiPlayer="midiPlayer" midiNormal="constants.TOM1_MIDI_NORMAL"/>                
                <Snares :track="track" :measureIndex="measureIndex" :midiPlayer="midiPlayer"/>
                <Toms :track="track" :measureIndex="measureIndex" :tomIndex="4" :abcOn="constants.TOM4_ON" :midiPlayer="midiPlayer" midiNormal="constants.TOM4_MIDI_NORMAL"/>                
                <Kick :track="track" :measureIndex="measureIndex" :midiPlayer="midiPlayer"/>                
              </div>
            </div>
          </span>
        </span>
      </div>
      <MeasureControls :measureIndex="measureIndex"/>
    </div>
  `
}