import ContextMenus from './context_menus.js'
import Measure from './measure.js'
import TextFields from './text_fields.js'

export default {
  data() {
    return {
      track: editor.track ? editor.track : null,
      midiPlayer: midiPlayer ? midiPlayer : null,
      options: options ? options : null,      
    }
  },

  mounted() {
    eventBus.$on('track-updated', () => {
      if (editor.track) {
        this.track = deepCopy(editor.track)            
      }
    });	

   eventBus.$on('options-updated', () => {
      this.options = deepCopy(options)      
    });
  },

  components: {
    ContextMenus, Measure, TextFields
  },

  template: `
    <TextFields></TextFields>
    <div id="musicalInput" class="fullWidthEle">
      <div id="measureContainer">
        <template v-for="i in track.numberOfMeasures" :key="i">
          <Measure :options="options" :midiPlayer="midiPlayer" :track="track" :measureIndex="i"></Measure>
        </template>
      </div>
      <ContextMenus></ContextMenus>
    </div>
    `
}
