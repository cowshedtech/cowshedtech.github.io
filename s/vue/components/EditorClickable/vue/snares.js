import Snare from './snare.js'
import NoteSpacer from './all_note_spacer.js'
import MuteButton from './all_button_mute.js'
import SnareMenu from './snare_menu.js'
import SnareLabelMenu from './snare_label_menu.js'

export default {
  
  props: {
    measureIndex: {
      type: Number,
      required: true
    }
  },

  components: {
    Snare, SnareMenu, SnareLabelMenu, MuteButton, NoteSpacer
  },

  setup(props) {
    const { notesPerMeasure, numBeats, noteValue } = editor.track;
    const startNoteIndex = (props.measureIndex - 1) * notesPerMeasure;
    return { startNoteIndex, notesPerMeasure}
  },

  template: `
    <div class="snare-container">
      <div class="opening_note_space"></div>
      <template v-for="i in notesPerMeasure" :key="i">
        <Snare :noteIndex="startNoteIndex + (i - 1)" />
        <NoteSpacer :noteIndex="i" />
      </template>
      <MuteButton instrument="snare" :measureIndex="measureIndex"></MuteButton>
    </div>
    <SnareMenu />
    <SnareLabelMenu />
  `
}