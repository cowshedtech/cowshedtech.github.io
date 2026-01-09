import ContextMenus from './context_menus.js'
import Measure from './measure.js'
import TextFields from './text_fields.js'

export default {
  inject: ['options', 'midiPlayer', 'track'],

  watch: {
     'options.highlightOn': function(newVal) {
      if (typeof newVal === 'boolean') {
        if (!newVal) editorClickable.clearHighlight();        
      }
    }
  },

  components: {
    ContextMenus, Measure, TextFields
  },

  template: `
    <TextFields></TextFields>
    <div id="musicalInput" class="fullWidthEle">
      <div id="measureContainer">
        <template v-for="i in track.numberOfMeasures" :key="i">
          <Measure :measureIndex="i"></Measure>
        </template>
      </div>
      <ContextMenus></ContextMenus>
    </div>
    `
}
