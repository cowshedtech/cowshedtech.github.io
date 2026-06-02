export default {
  inject: {
    options: { default: () => (typeof window !== 'undefined' ? window.options : null) },
    track: { default: () => (typeof window !== 'undefined' ? window.track : null) },
    // The owning groove-display instance's sheet music + a function that swaps the shared
    // globals (abcToSVGCallback/options/render width) onto this instance before rendering.
    // The full editor doesn't provide these, so we fall back to the single global instance.
    sheetMusic: { default: () => (typeof window !== 'undefined' ? window.sheetMusic : null) },
    gsActivate: { default: null },
    gsUid: { default: '' }
  },

  data() {
    return {
      svg: this.sheetMusic ? this.sheetMusic.getSVG() : 0
     }
  },

  computed: {
    svgTargetId() { return 'svgTarget' + (this.gsUid || ''); },
    sheetMusicDivId() { return 'sheetMusicDiv' + (this.gsUid || ''); }
  },
  
  watch: {
    // Render when the version counter changes (avoids deep-watch loops)
    'track.version': {
      immediate: true,
      handler() {
        if (this.track) this.refreshSVG(this.track);
      }
    },
    'options.highlightOn': function(newVal) {
      if (typeof newVal === 'boolean') {
        if (!newVal && this.sheetMusic) this.sheetMusic.clearHighlight();
      }
    }
  },

  methods: {
    refreshSVG(v) {
      // Make sure the shared globals (abcToSVGCallback, options, render width) point at this
      // instance before we touch the abc2svg helpers, which read those globals.
      if (typeof this.gsActivate === 'function') this.gsActivate();

      var renderWidth;
      // Embeds (e.g. GrooveEmbed/GrooveEmbedSingle/GrooveMultiDisplay) pin a fixed render width
      // so the layout matches the standalone GrooveScribe display regardless of how wide the
      // host page/container is. The full editor leaves this unset and stays responsive.
      if (typeof window.GROOVE_DISPLAY_RENDER_WIDTH === "number" && window.GROOVE_DISPLAY_RENDER_WIDTH > 0) {
          renderWidth = window.GROOVE_DISPLAY_RENDER_WIDTH;
      } else {
          renderWidth = 600;
          var svgTarget = document.getElementById(this.svgTargetId);
          if (svgTarget) {
              renderWidth = svgTarget.offsetWidth - 100;
              renderWidth = Math.floor(renderWidth * 0.8);  // reduce width by 20% (This actually makes the notes bigger, because we scale up everything to max width)
          }
      }
      var abc_source = generate_ABC_from_track(renderWidth, v);    
      var svg_return = renderABCtoSVG(v, abc_source);
      this.svg = svg_return.svg; 

      // Hand the just-rendered track (now carrying noteMappingArray + matching trackID)
      // to sheetMusic so highlightNote() can map playback progress onto these SVG notes.
      if (this.sheetMusic && typeof this.sheetMusic.attachTrack === 'function') {
        this.sheetMusic.attachTrack(v);
      }
    }
  },
  
  mounted() {
    this._onSheetMusicUpdated = () => {
      this.svg = this.sheetMusic ? this.sheetMusic.getSVG() : 0;
    };
    eventBus.$on('sheet-music-updated', this._onSheetMusicUpdated);

    // The immediate `track.version` watcher renders once during setup, before this
    // component's DOM exists. At that point #svgTarget can't be measured, so the
    // responsive editor falls back to the default width and the music renders far
    // too large. Re-render now that the container has a real width. (Embeds use a
    // fixed GROOVE_DISPLAY_RENDER_WIDTH, so this is a harmless no-op re-render.)
    this.$nextTick(() => {
      if (this.track) this.refreshSVG(this.track);
    });
  },

  beforeUnmount() {
    if (this._onSheetMusicUpdated) eventBus.$off('sheet-music-updated', this._onSheetMusicUpdated);
  },

  template: `
    <div class="Printable">
      <!-- rendering area -->
      <div :id="sheetMusicDivId" class="fullWidthEle">
        <div :id="svgTargetId" class="svgTarget" v-html="svg">         
        </div>
      </div>
    </div>
`
}
