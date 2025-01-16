export default {
  data() {
    return { }
  },
  props: { },
  template: `
	<div class="noteContextMenu">
		<ul id="downloadContextMenu" class="list" style="width: 200px;">
			<li onclick='myGrooveWriter.SVGSaveAs();'><b>Download SVG Images</b></li>
			<li onclick='myGrooveWriter.PNGSaveAs();'><b>Download PNG Images</b></li>
			<li onclick='myGrooveWriter.MIDISaveAs();'><b>Download MIDI file</b></li>
		</ul>
	</div>	
`
}