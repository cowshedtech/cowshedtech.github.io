export default {
  data() {
    return {
      svg: sheetMusic ? sheetMusic.getSVG() : 0
     }
  },
  props: { },
  mounted() {
    // Subscribe to metronome changes
    this.removeHandler = sheetMusic?.addChangeHandler(() => {
        this.svg = sheetMusic ? sheetMusic.getSVG() : 0;
      })
  },
  beforeUnmount() {
      // Cleanup event handler
      if (this.removeHandler) this.removeHandler() 
  },
  template: `
    <div class="Printable">
      <!-- rendering area -->
      <div id="sheetMusicDiv" class="fullWidthEle">
        <div id="svgTarget" class="svgTarget" v-html="svg">         
        </div>
      </div>
    </div>
`
}