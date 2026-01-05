export default {
  props: {
    track: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      svg: sheetMusic ? sheetMusic.getSVG() : 0
     }
  },
  
  watch: {
    track: {
      deep: true,
      immediate: true,
      handler(v) {
         this.refreshSVG(v);                  
      }
    }
  },
  
  methods: {
    refreshSVG(v) {
      var renderWidth = 600;
      var svgTarget = document.getElementById("svgTarget");
      if (svgTarget) {
          renderWidth = svgTarget.offsetWidth - 100;
          renderWidth = Math.floor(renderWidth * 0.8);  // reduce width by 20% (This actually makes the notes bigger, because we scale up everything to max width)
      }
      var abc_source = generate_ABC_from_track(renderWidth, v);    
      var svg_return = renderABCtoSVG(v, abc_source);
      this.svg = svg_return.svg; 
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