import ContextMenus from './context_menus.js'
import Measure from './measure.js'

export default {
  data() {
    return {
      track: editor.track ? editor.track : null,
      midiPlayer: midiPlayer ? midiPlayer : null
    }
  },

  mounted() {
    this.removeHandler = editorClickable?.addChangeHandler(() => {
      this.track = deepCopy(editor.track)            
    })
  },

  beforeUnmount() {
      if (this.removeHandler) this.removeHandler() 
  },

  components: {
    ContextMenus, Measure
  },

  template: `
    <div id="musicalInput" class="fullWidthEle edit-block">
      <div id="measureContainer">
        <template v-for="i in track.numberOfMeasures" :key="i">
          <Measure :midiPlayer="midiPlayer" :track="track" :measureIndex="i"></Measure>
        </template>
      </div>
      <ContextMenus></ContextMenus>
    </div>
    `
}
