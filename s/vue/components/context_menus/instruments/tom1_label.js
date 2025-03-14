
export default {
  data() {
    return { }
  },
  props: { },
  template: `
	<div class="noteContextMenu">
		<ul id="tom1LabelContextMenu" class="list">
			<li onclick='noteLabelPopupClick("tom1", "all_off");'>all Toms <b>Off</b></li>
			<li onclick='noteLabelPopupClick("tom1", "all_on");'>all Toms <b>On</b></li>
			<li id='mute_tom1_menu_item' onclick='noteLabelPopupClick("tom1", "mute");'>mute tom sound</li>
			<li onclick='noteLabelPopupClick("tom1", "cancel");'>cancel</li>
		</ul>
	</div>
`
}