export default {
  data() {
    return {
      menuWidth: '200px'
    }
  },
  methods: {
    downloadSVG() { SVGSaveAs() },
    downloadPNG() { PNGSaveAs() },
    downloadMIDI() { 
      var midi_url = createMidiUrlFromClickableUI("general_MIDI");
      document.location = midi_url;
     }
  },
  template: `
	<div class="noteContextMenu">
		<ul id="downloadContextMenu" class="list" :style="{ width: menuWidth }">
			<li @click="downloadSVG"><b>Download SVG Images</b></li>
			<li @click="downloadPNG"><b>Download PNG Images</b></li>
			<li @click="downloadMIDI"><b>Download MIDI file</b></li>
		</ul>
	</div>	
`
}