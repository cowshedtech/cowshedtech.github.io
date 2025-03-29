export default {
	data() {
		return {}
	},

	props: {
		isOpen: {
			type: Boolean,
			default: false
		},
		x: {
			type: String
		},
		y: {
			type: String
		}
	},

	template: `
	<span class="noteContextMenuNew" v-if="isOpen" :style="{ top: y + 'px', left: x + 'px' }">
		<ul id="stickingsContextMenu" class="list" style="width: 200px;">
			<li onclick='stickingsShowHideToggle();'><b>Show or Hide stickings</b></li>
			<li onclick='stickingsReverseRL();'><b>Reverse stickings R/L</b></li>
		</ul>
	</span>
`
}