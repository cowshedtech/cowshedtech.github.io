export default {
  data() {
    return { }
  },
  props: { },
  template: `
    <!-- context menu that will pop up over notes in advaced edit mode or right click -->
	<div class="noteContextMenu">
		<ul id="metronomeOptionsContextMenu" class="list">
			<li class="metronomeOptionsContextMenuItem" id="metronomeOptionsContextMenuSolo"      onclick='metronome.optionsMenuPopupClick("Solo");'  title="Just hear the metronome." >Solo</li>
			<li class="metronomeOptionsContextMenuItem" id="metronomeOptionsContextMenuSpeedUp"   onclick='metronome.optionsMenuPopupClick("SpeedUp");' title="Increase the tempo automatically" >Auto speed up</li>
			<li class="metronomeOptionsContextMenuItem" id="metronomeOptionsContextMenuCountIn"   onclick='metronome.optionsMenuPopupClick("CountIn");' title="One measure of metronome count in at the start" >Count it in</li>
			<li class="metronomeOptionsContextMenuItem" id="metronomeOptionsContextMenuOffTheOne" onclick='metronome.optionsMenuPopupClick("OffTheOne");' title="Click on the e, &, or a">Offset click</li>
			<!--
			<li id="metronomeOptionsContextMenuDropper"   onclick='myGrooveWriter.optionsMenuPopupClick("Dropper")'  >Beat Dropper</li>
			-->
		</ul>
	</div>
    <div class="noteContextMenu">
		<ul id="metronomeOptionsOffsetClickContextMenu" class="list">
			<li class="metronomeOptionsOffsetClickContextMenuItem menuChecked" id="metronomeOptionsOffsetClickContextMenuOnThe1"   onclick='metronome.optionsMenuOffsetClickPopupClick("1");'>Start on "<b>1</b>"</li>
			<li class="metronomeOptionsOffsetClickContextMenuItem" id="metronomeOptionsOffsetClickContextMenuOnTheE"   onclick='metronome.optionsMenuOffsetClickPopupClick("E");'>Start on "<b>E</b>"</li>
			<li class="metronomeOptionsOffsetClickContextMenuItem" id="metronomeOptionsOffsetClickContextMenuOnTheAND" onclick='metronome.optionsMenuOffsetClickPopupClick("AND");'>Start on "<b>&amp;</b>"</li>
			<li class="metronomeOptionsOffsetClickContextMenuItem" id="metronomeOptionsOffsetClickContextMenuOnTheA"   onclick='metronome.optionsMenuOffsetClickPopupClick("A");'>Start on "<b>A</b>"</li>
			<li class="metronomeOptionsOffsetClickContextMenuItem" id="metronomeOptionsOffsetClickContextMenuOnTheROTATE"  onclick='metronome.optionsMenuOffsetClickPopupClick("ROTATE");'>Rotate through</li>
		</ul>
	</div>
	<div class="noteContextMenu">
		<ul id="metronomeOptionsOffsetClickForTripletsContextMenu" class="list">
			<li class="metronomeOptionsOffsetClickContextMenuItem menuChecked" id="metronomeOptionsOffsetClickContextMenuOnThe1Triplet"  onclick='metronome.optionsMenuOffsetClickPopupClick("1");'>Start on "<b>1</b>"</li>
			<li class="metronomeOptionsOffsetClickContextMenuItem" id="metronomeOptionsOffsetClickContextMenuOnTheTI" onclick='metronome.optionsMenuOffsetClickPopupClick("TI");'>Start on "<b>&amp;</b>"</li>
			<li class="metronomeOptionsOffsetClickContextMenuItem" id="metronomeOptionsOffsetClickContextMenuOnTheTA" onclick='metronome.optionsMenuOffsetClickPopupClick("TA");'>Start on "<b>A</b>"</li>
			<li class="metronomeOptionsOffsetClickContextMenuItem" id="metronomeOptionsOffsetClickContextMenuOnTheROTATE"   onclick='metronome.optionsMenuOffsetClickPopupClick("ROTATE");'>Rotate through</li>
		</ul>
	</div>
`
}