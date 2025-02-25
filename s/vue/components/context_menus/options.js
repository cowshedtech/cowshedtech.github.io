export default {
  data() {
    return { }
  },
  props: { },
  template: `
	<div class="noteContextMenu">
		<ul id="optionsContextMenu" class="list">
			<li class="metronomeOptionsContextMenuItem" id="optionsContextMenuHighlight" onclick='myGrooveWriter.optionsHighlightPopupClick("highlight");'><b>Highlighting</b></li>
		</ul>
	</div>
`
}