export default {
  data() {
    return { }
  },
  props: { },
  template: `
	<div class="noteContextMenu">
		<ul id="helpContextMenu" class="list">
			<li onclick='myGrooveWriter.helpMenuPopupClick("undo");'>Undo (Ctrl-Z)</li>
			<li onclick='myGrooveWriter.helpMenuPopupClick("redo");'>Redo (Ctrl-Y)</li>
			<li onclick='myGrooveWriter.helpMenuPopupClick("help");'>Help</li>
			<li onclick='myGrooveWriter.helpMenuPopupClick("about");'>About</li>
		</ul>
	</div>
`
}