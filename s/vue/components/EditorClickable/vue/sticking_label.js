export default {
  data() {
    return { }
  },
  props: { },
  template: `
	<div class="noteContextMenu">
		<ul id="stickingsLabelContextMenu" class="list">
			<li onclick='noteLabelPopupClick("stickings", "all_off");'>all <b>Off</b></li>
			<li onclick='noteLabelPopupClick("stickings", "alternate");'>alternate <b>R</b>/<b>L</b></li>
			<li onclick='noteLabelPopupClick("stickings", "all_right");'>all <b>R</b>s</li>
			<li onclick='noteLabelPopupClick("stickings", "all_left");'>all <b>L</b>s</li>
			<li onclick='noteLabelPopupClick("stickings", "all_count");'><b>C</b>ounts</li>
			<li onclick='noteLabelPopupClick("stickings", "cancel");'>cancel</li>
		</ul>
	</div>
`
}