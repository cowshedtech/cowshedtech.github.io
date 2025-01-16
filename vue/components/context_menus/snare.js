export default {
  data() {
    return { }
  },
  props: { },
  template: `
	<div class="noteContextMenu">
		<ul id="snareContextMenu" class="list">
			<li onclick='myGrooveWriter.notePopupClick("snare", "off");'>Off</li>
			<li onclick='myGrooveWriter.notePopupClick("snare", "normal");'>Snare Normal</li>
			<li onclick='myGrooveWriter.notePopupClick("snare", "accent");'>Snare Accent</li>
			<li onclick='myGrooveWriter.notePopupClick("snare", "ghost");'>Ghost Note</li>
			<li onclick='myGrooveWriter.notePopupClick("snare", "xstick");'>Cross Stick</li>
			<li onclick='myGrooveWriter.notePopupClick("snare", "buzz");'>Buzz Stroke</li>
			<li onclick='myGrooveWriter.notePopupClick("snare", "flam");'>Flam</li>
		</ul>
	</div>
`
}