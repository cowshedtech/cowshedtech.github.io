import ContextMenus from './context_menus.js'
import Measure from './measure.js'

// Deep copy utility function
function deepCopy(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepCopy(item));
  }
  
  const copy = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copy[key] = deepCopy(obj[key]);
    }
  }
  return copy;
}

export default {
  data() {
    return {
      track: editor.track ? editor.track : null      
    }
  },

  mounted() {
    console.log(`editor mounted`)
    
    // Subscribe to metronome changes
    this.removeHandler = editorClickable?.addChangeHandler(() => {
      console.log(`editor - change`)
      this.track = deepCopy(editor.track)
      this.track.title = "Blah"
      this.$forceUpdate(); 
    })
  },

  beforeUnmount() {
      // Cleanup event handler
      if (this.removeHandler) this.removeHandler() 
  },

  components: {
    ContextMenus, Measure
  },

  template: `
    <div id="musicalInput" class="fullWidthEle edit-block">
      <div id="measureContainer">
        <template v-for="i in track.numberOfMeasures" :key="i">
          <Measure :track="track" :measureIndex="i"></Measure>
        </template>
      </div>
    <ContextMenus></ContextMenus>`
}
