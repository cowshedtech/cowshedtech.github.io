import HighHat from './highhat.js'
import MuteButton from './all_button_mute.js'
import NoteSpacer from './all_note_spacer.js'
import HighHatMenu from './highhat_menu.js'

export default {
  
  data() {
    return {
      trackData: editor.track ? editor.track : null,
      startNoteIndex: editor.track ? (this.measureIndex - 1) * editor.track.notesPerMeasure : 0
    }
  },
  
  props: {
    track: {
      type: Object,
      required: true
    },
    measureIndex: {
      type: Number,
      required: true
    }
  },

  watch: { 
    track: {
      handler(newVal, oldVal) { 
        this.trackData = newVal;
        this.startNoteIndex = (this.measureIndex - 1) * this.trackData.notesPerMeasure;        
      },
      deep: true
    },    
  },

  components: {
    HighHat, MuteButton, NoteSpacer, HighHatMenu
  },

  template: `
    <div class="hi-hat-container">
      <div class="opening_note_space"></div>
      <template v-for="i in trackData.notesPerMeasure" :key="i">
        <HighHat :noteIndex="startNoteIndex + (i - 1)" />
        <NoteSpacer :track="track" :noteIndex="i" />
      </template>
      <MuteButton instrument="hh" :measureIndex="measureIndex"></MuteButton>
    </div>
    <HighHatMenu />    
  `
}