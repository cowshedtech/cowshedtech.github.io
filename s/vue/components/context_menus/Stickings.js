export default {
  data() {
    return { }
  },
  props: { },
  template: `
	<div class="noteContextMenu">
		<ul id="stickingsContextMenu" class="list" style="width: 200px;">
			<li onclick='myGrooveWriter.stickingsShowHideToggle();'><b>Show or Hide stickings</b></li>
			<li onclick='myGrooveWriter.stickingsReverseRL();'><b>Reverse stickings R/L</b></li>
		</ul>
	</div>
`
}