export default {
  data() {
    return { }
  },
  props: { },
  template: `
	<div class="noteContextMenu">
		<ul id="kickLabelContextMenu" class="list">
			<li onclick='noteLabelPopupClick("kick", "all_off");'>all Kicks <b>Off</b></li>
			<li onclick='noteLabelPopupClick("kick", "all_on");'>all Kicks <b>On</b></li>
			<li onclick='noteLabelPopupClick("kick", "hh_foot_nums_on");'>HH foot #'s <b>On</b></li>
			<li onclick='noteLabelPopupClick("kick", "hh_foot_ands_on");'>HH foot &'s <b>On</b></li>
			<li id='mute_kick_menu_item' onclick='noteLabelPopupClick("kick", "mute");'>mute kick sound</li>
			<li onclick='noteLabelPopupClick("kick", "cancel");'>cancel</li>
		</ul>
	</div>
`
}