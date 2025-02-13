export default {
  data() {
    return {
      menuWidth: '200px'
    }
  },
  methods: {
    downloadSVG() { myGrooveWriter.SVGSaveAs() },
    downloadPNG() { myGrooveWriter.PNGSaveAs() },
    downloadMIDI() { myGrooveWriter.MIDISaveAs() }
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