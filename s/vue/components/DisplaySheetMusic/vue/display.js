export default {
  data() {
    return {
      svg: sheetMusic ? sheetMusic.getSVG() : 0
     }
  },
  
  mounted() {
    eventBus.$on('sheet-music-updated', () => {
      this.svg = sheetMusic ? sheetMusic.getSVG() : 0;
    })
  },

  beforeUnmount() {
    eventBus.$off('sheet-music-updated');
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