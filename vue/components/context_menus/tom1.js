export default {
  data() {
    return { }
  },
  props: { },
  template: `
	<div class="noteContextMenu">
		<ul id="tom1ContextMenu" class="list">
			<li onclick='myGrooveWriter.notePopupClick("tom1", "off");'>Off</li>
			<li onclick='myGrooveWriter.notePopupClick("tom1", "normal");'>Tom Normal</li>
		</ul>
	</div>
`
}