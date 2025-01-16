export default {
  data() {
    return { }
  },
  props: { },
  template: `
	<div class="noteContextMenu">
		<ul id="tom4ContextMenu" class="list">
			<li onclick='myGrooveWriter.notePopupClick("tom4", "off");'>Off</li>
			<li onclick='myGrooveWriter.notePopupClick("tom4", "normal");'>Tom Normal</li>
		</ul>
	</div>
`
}