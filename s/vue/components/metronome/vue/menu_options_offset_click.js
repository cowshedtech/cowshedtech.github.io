export default {
  data() {
    return { }
  },
  props: { },
  template: `
    <div class="noteContextMenu">
		<ul id="metronomeOptionsOffsetClickContextMenu" class="list">
			<li class="metronomeOptionsOffsetClickContextMenuItem menuChecked" id="metronomeOptionsOffsetClickContextMenuOnThe1"   onclick='metronome.optionsMenuOffsetClickPopupClick("1");'>Start on "<b>1</b>"</li>
			<li class="metronomeOptionsOffsetClickContextMenuItem" id="metronomeOptionsOffsetClickContextMenuOnTheE"   onclick='metronome.optionsMenuOffsetClickPopupClick("E");'>Start on "<b>E</b>"</li>
			<li class="metronomeOptionsOffsetClickContextMenuItem" id="metronomeOptionsOffsetClickContextMenuOnTheAND" onclick='metronome.optionsMenuOffsetClickPopupClick("AND");'>Start on "<b>&amp;</b>"</li>
			<li class="metronomeOptionsOffsetClickContextMenuItem" id="metronomeOptionsOffsetClickContextMenuOnTheA"   onclick='metronome.optionsMenuOffsetClickPopupClick("A");'>Start on "<b>A</b>"</li>
			<li class="metronomeOptionsOffsetClickContextMenuItem" id="metronomeOptionsOffsetClickContextMenuOnTheROTATE"  onclick='metronome.optionsMenuOffsetClickPopupClick("ROTATE");'>Rotate through</li>
		</ul>
	</div>
`
}