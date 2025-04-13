export default {
  props: {
	isOpen: {
		type: Boolean,
		default: false
	},
	x: {
		type: Number
	},
	y: {
		type: Number
	}
},

template: `
	<span class="noteContextMenuNew" v-if="isOpen" :style="{ top: y + 'px', left: x + 'px' }">
		<ul id="permutationContextMenu" class="list">
			<li onclick='myGrooveWriter.permutationPopupClick("none");'><b>None</b></li>
			<li onclick='myGrooveWriter.permutationPopupClick("kick_16ths");'><b>Kick</b> Permutation</li>
			<li onclick='myGrooveWriter.permutationPopupClick("snare_16ths");'><b>Snare</b> Permutation</li>
		</ul>
	</span>
`
}