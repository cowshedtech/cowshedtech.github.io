import ContextMenus from './context_menus.js'
import Measure from './measure.js'

export default {
  data() {
    return {
      track: editor.track ? editor.track : null,
      midiPlayer: midiPlayer ? midiPlayer : null,
      options: options ? options : null,
      isViewMode : options ? options.isViewMode() : true,
    }
  },

  mounted() {
    this.removeHandler = editorClickable?.addChangeHandler(() => {
      this.track = deepCopy(editor.track)            
    })

   eventBus.$on('options-updated', () => {
      this.options = deepCopy(options)
      this.isViewMode = options.isViewMode()
    });
  },

  beforeUnmount() {
      if (this.removeHandler) this.removeHandler() 
  },

  components: {
    ContextMenus, Measure
  },

  template: `
    <div v-if="isViewMode === false" id="musicalInput" class="fullWidthEle">
      <div id="measureContainer">
        <template v-for="i in track.numberOfMeasures" :key="i">
          <Measure :options="options" :midiPlayer="midiPlayer" :track="track" :measureIndex="i"></Measure>
        </template>
      </div>
      <ContextMenus></ContextMenus>
    </div>
    `
}
