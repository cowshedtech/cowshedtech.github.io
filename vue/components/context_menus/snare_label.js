export default {
  data() {
    return { }
  },
  props: { },
  template: `
	<div class="noteContextMenu">
		<ul id="snareLabelContextMenu" class="list">
			<li onclick='myGrooveWriter.noteLabelPopupClick("snare", "all_off");'>all Snares <b>Off</b></li>
			<li onclick='myGrooveWriter.noteLabelPopupClick("snare", "all_on");'>all <b>Accented</b></li>
			<li onclick='myGrooveWriter.noteLabelPopupClick("snare", "all_on_normal");'>all <b>Normal</b></li>
			<li onclick='myGrooveWriter.noteLabelPopupClick("snare", "all_on_ghost");'>all <b>Ghosts</b></li>
			<li id='mute_snare_menu_item' onclick='myGrooveWriter.noteLabelPopupClick("snare", "mute");'>mute snare sound</li>
			<li onclick='myGrooveWriter.noteLabelPopupClick("snare", "cancel");'>cancel</li>
		</ul>
	</div>
`
}