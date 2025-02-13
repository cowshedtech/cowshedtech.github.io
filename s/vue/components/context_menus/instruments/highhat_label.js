export default {
  data() {
    return { }
  },
  props: { },
  template: `
	<div class="noteContextMenu">
		<ul id="hhLabelContextMenu" class="list">
			<li onclick='myGrooveWriter.noteLabelPopupClick("hh", "all_off");'>all Hi-hats <b>Off</b></li>
			<li onclick='myGrooveWriter.noteLabelPopupClick("hh", "all_on");'>all Hi-hats <b>On</b></li>
			<li onclick='myGrooveWriter.noteLabelPopupClick("hh", "downbeats");'>downbeats</li>
			<li onclick='myGrooveWriter.noteLabelPopupClick("hh", "upbeats");'>upbeats</li>
			<li id='mute_hh_menu_item' onclick='myGrooveWriter.noteLabelPopupClick("hh", "mute");'>mute HH sound</li>
			<li onclick='myGrooveWriter.noteLabelPopupClick("hh", "cancel");'>cancel</li>
		</ul>
	</div>
`
}