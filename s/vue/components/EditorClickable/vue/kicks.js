import Kick from './kick.js'
import MuteButton from './all_button_mute.js'
import NoteSpacer from './all_note_spacer.js'
import KickMenu from './kick.js'
import KickLabelMenu from './kick_label_menu.js'

export default {
  
  props: {
    measureIndex: {
      type: Number,
      required: true
    }
  },

  components: {
   Kick, KickMenu, KickLabelMenu, MuteButton, NoteSpacer
  },

  setup(props) {
    const { notesPerMeasure, numBeats, noteValue } = editor.track;
    const startNoteIndex = (props.measureIndex - 1) * notesPerMeasure;
    return { startNoteIndex, notesPerMeasure}
  },

  template: `
    <div class="kick-container">
      <div class="opening_note_space"></div>
      <template v-for="i in notesPerMeasure" :key="i">
        <Kick :noteIndex="startNoteIndex + (i - 1)" />
         <NoteSpacer :noteIndex="i" />
      </template>
      <MuteButton instrument="kick" :measureIndex="measureIndex"></MuteButton>
    </div>
    <KickMenu />
    <KickLabelMenu />
  `
}