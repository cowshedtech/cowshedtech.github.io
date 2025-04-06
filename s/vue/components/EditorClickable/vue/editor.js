import ContextMenus from './context_menus.js'
import Measure from './measure.js'

export default {
  data() {
    return {
      track: editor.track ? editor.track : null
    }
  },

  mounted() {
    console.log(`editor mounted`)
    
    // Subscribe to metronome changes
    this.removeHandler = sheetMusic?.addChangeHandler(() => {
      this.track = editor.track
      console.log(this.track.numberOfMeasures)
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
        <Measure measureIndex="1"></Measure>        
      </div>
    <ContextMenus></ContextMenus>`
}
