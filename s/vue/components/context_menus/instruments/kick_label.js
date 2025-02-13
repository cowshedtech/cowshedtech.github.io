export default {
  data() {
    return { }
  },
  props: { },
  template: `
	<div class="noteContextMenu">
		<ul id="kickLabelContextMenu" class="list">
			<li onclick='myGrooveWriter.noteLabelPopupClick("kick", "all_off");'>all Kicks <b>Off</b></li>
			<li onclick='myGrooveWriter.noteLabelPopupClick("kick", "all_on");'>all Kicks <b>On</b></li>
			<li onclick='myGrooveWriter.noteLabelPopupClick("kick", "hh_foot_nums_on");'>HH foot #'s <b>On</b></li>
			<li onclick='myGrooveWriter.noteLabelPopupClick("kick", "hh_foot_ands_on");'>HH foot &'s <b>On</b></li>
			<li id='mute_kick_menu_item' onclick='myGrooveWriter.noteLabelPopupClick("kick", "mute");'>mute kick sound</li>
			<li onclick='myGrooveWriter.noteLabelPopupClick("kick", "cancel");'>cancel</li>
		</ul>
	</div>
`
}