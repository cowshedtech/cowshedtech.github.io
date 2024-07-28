export default {
  data() {
    return { }
  },
  props: { },
  template: `
    <!-- context menu that will pop up over notes in advaced edit mode or right click -->
		<div class="noteContextMenu">
			<ul id="metronomeOptionsContextMenu" class="list">
				<li class="metronomeOptionsContextMenuItem" id="metronomeOptionsContextMenuSolo"      onclick='myGrooveWriter.metronomeOptionsMenuPopupClick("Solo");'  title="Just hear the metronome." >Solo</li>
				<li class="metronomeOptionsContextMenuItem" id="metronomeOptionsContextMenuSpeedUp"   onclick='myGrooveWriter.metronomeOptionsMenuPopupClick("SpeedUp");' title="Increase the tempo automatically" >Auto speed up</li>
				<li class="metronomeOptionsContextMenuItem" id="metronomeOptionsContextMenuCountIn"   onclick='myGrooveWriter.metronomeOptionsMenuPopupClick("CountIn");' title="One measure of metronome count in at the start" >Count it in</li>
				<li class="metronomeOptionsContextMenuItem" id="metronomeOptionsContextMenuOffTheOne" onclick='myGrooveWriter.metronomeOptionsMenuPopupClick("OffTheOne");' title="Click on the e, &, or a">Offset click</li>
				<!--
				<li id="metronomeOptionsContextMenuDropper"   onclick='myGrooveWriter.metronomeOptionsMenuPopupClick("Dropper")'  >Beat Dropper</li>
				-->
			</ul>
		</div>
    <div class="noteContextMenu">
			<ul id="metronomeOptionsOffsetClickContextMenu" class="list">
				<li class="metronomeOptionsOffsetClickContextMenuItem menuChecked" id="metronomeOptionsOffsetClickContextMenuOnThe1"   onclick='myGrooveWriter.metronomeOptionsMenuOffsetClickPopupClick("1");'>Start on "<b>1</b>"</li>
				<li class="metronomeOptionsOffsetClickContextMenuItem" id="metronomeOptionsOffsetClickContextMenuOnTheE"   onclick='myGrooveWriter.metronomeOptionsMenuOffsetClickPopupClick("E");'>Start on "<b>E</b>"</li>
				<li class="metronomeOptionsOffsetClickContextMenuItem" id="metronomeOptionsOffsetClickContextMenuOnTheAND" onclick='myGrooveWriter.metronomeOptionsMenuOffsetClickPopupClick("AND");'>Start on "<b>&amp;</b>"</li>
				<li class="metronomeOptionsOffsetClickContextMenuItem" id="metronomeOptionsOffsetClickContextMenuOnTheA"   onclick='myGrooveWriter.metronomeOptionsMenuOffsetClickPopupClick("A");'>Start on "<b>A</b>"</li>
				<li class="metronomeOptionsOffsetClickContextMenuItem" id="metronomeOptionsOffsetClickContextMenuOnTheROTATE"  onclick='myGrooveWriter.metronomeOptionsMenuOffsetClickPopupClick("ROTATE");'>Rotate through</li>
			</ul>
		</div>
		<div class="noteContextMenu">
			<ul id="metronomeOptionsOffsetClickForTripletsContextMenu" class="list">
				<li class="metronomeOptionsOffsetClickContextMenuItem menuChecked" id="metronomeOptionsOffsetClickContextMenuOnThe1Triplet"  onclick='myGrooveWriter.metronomeOptionsMenuOffsetClickPopupClick("1");'>Start on "<b>1</b>"</li>
				<li class="metronomeOptionsOffsetClickContextMenuItem" id="metronomeOptionsOffsetClickContextMenuOnTheTI" onclick='myGrooveWriter.metronomeOptionsMenuOffsetClickPopupClick("TI");'>Start on "<b>&amp;</b>"</li>
				<li class="metronomeOptionsOffsetClickContextMenuItem" id="metronomeOptionsOffsetClickContextMenuOnTheTA" onclick='myGrooveWriter.metronomeOptionsMenuOffsetClickPopupClick("TA");'>Start on "<b>A</b>"</li>
				<li class="metronomeOptionsOffsetClickContextMenuItem" id="metronomeOptionsOffsetClickContextMenuOnTheROTATE"   onclick='myGrooveWriter.metronomeOptionsMenuOffsetClickPopupClick("ROTATE");'>Rotate through</li>
			</ul>
		</div>
`
}