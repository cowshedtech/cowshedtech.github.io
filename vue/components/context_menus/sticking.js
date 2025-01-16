export default {
  data() {
    return { }
  },
  props: { },
  template: `
  <div class="noteContextMenu">
		<ul id="stickingContextMenu" class="list">
			<li onclick='myGrooveWriter.notePopupClick("sticking", "off");'>Off</li>
			<li onclick='myGrooveWriter.notePopupClick("sticking","right");'><b>R</b>ight</li>
			<li onclick='myGrooveWriter.notePopupClick("sticking","left");'><b>L</b>eft</li>
			<li onclick='myGrooveWriter.notePopupClick("sticking","both");'><b>R/L</b></li>
			<li onclick='myGrooveWriter.notePopupClick("sticking", "count");'>Count</li>
		</ul>
	</div>
`
}