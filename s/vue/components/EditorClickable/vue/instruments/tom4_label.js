export default {
  data() {
    return { }
  },
  props: { },
  template: `
	<div class="noteContextMenu">
		<ul id="tom4LabelContextMenu" class="list">
			<li onclick='noteLabelPopupClick("tom4", "all_off");'>all Toms <b>Off</b></li>
			<li onclick='noteLabelPopupClick("tom4", "all_on");'>all Toms <b>On</b></li>
			<li id='mute_tom4_menu_item' onclick='noteLabelPopupClick("tom4", "mute");'>mute tom sound</li>
			<li onclick='noteLabelPopupClick("tom4", "cancel");'>cancel</li>
		</ul>
	</div>
	
`
}