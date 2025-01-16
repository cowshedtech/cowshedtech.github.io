export default {
  data() {
    return { }
  },
  props: { },
  template: `
	<div class="noteContextMenu">
		<ul id="kickContextMenu" class="list">
			<li onclick='myGrooveWriter.notePopupClick("kick", "off");'>Off</li>
			<li onclick='myGrooveWriter.notePopupClick("kick", "normal");'>Kick Normal</li>
			<li onclick='myGrooveWriter.notePopupClick("kick", "splash");'>Hi-hat foot</li>
			<li onclick='myGrooveWriter.notePopupClick("kick", "kick_and_splash");'>Kick &amp; Hi-hat foot</li>
		</ul>
	</div>
`
}