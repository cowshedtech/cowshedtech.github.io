import HighHat from './highhat.js'
import MuteButton from './all_button_mute.js'
import NoteSpacer from './all_note_spacer.js'
import HighHatMenu from './highhat_menu.js'
import HighHatLabelMenu from './highhat_label_menu.js'

export default {
  
  props: {
    measureIndex: {
      type: Number,
      required: true
    }
  },

  components: {
   HighHat, MuteButton, NoteSpacer, HighHatMenu, HighHatLabelMenu
  },

  setup(props) {
    const { notesPerMeasure, numBeats, noteValue } = editor.track;
    const startNoteIndex = (props.measureIndex - 1) * notesPerMeasure;
    return { startNoteIndex, notesPerMeasure}
  },

  template: `
    <div class="hi-hat-container">
      <div class="opening_note_space"></div>
      <template v-for="i in notesPerMeasure" :key="i">
        <HighHat :noteIndex="startNoteIndex + (i - 1)" />
        <NoteSpacer :noteIndex="i" />
      </template>
      <MuteButton instrument="hh" :measureIndex="measureIndex"></MuteButton>
    </div>
    <HighHatMenu />
    <HighHatLabelMenu />
  `
}