export default {
  data() {
    return { }
  },
  props: { },
  template: `
	<div class="noteContextMenu">
		<ul id="permutationContextMenu" class="list">
			<li onclick='myGrooveWriter.permutationPopupClick("none");'><b>None</b></li>
			<li onclick='myGrooveWriter.permutationPopupClick("kick_16ths");'><b>Kick</b> Permutation</li>
			<li onclick='myGrooveWriter.permutationPopupClick("snare_16ths");'><b>Snare</b> Permutation</li>
		</ul>
	</div>
`
}