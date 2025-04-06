export default {
	
	props: {
		measureIndex: {
			type: Number,
			required: true
		},
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

	methods: {
		handleClick(action) {
			noteLabelPopupClick("snare", action, this.measureIndex)
			this.$emit('close')
		}
	},

	template: `
	<div class="noteContextMenuNew" v-if="isOpen" :style="{ top: y + 'px', left: x + 'px' }">
		<ul id="snareLabelContextMenu" class="list">
			<li @click='handleClick("all_off")'>all Snares <b>Off</b></li>
			<li @click='handleClick("all_on")'>all <b>Accented</b></li>
			<li @click='handleClick("all_on_normal")'>all <b>Normal</b></li>
			<li @click='handleClick("all_on_ghost")'>all <b>Ghosts</b></li>
			<li id='mute_snare_menu_item' @click='handleClick("mute")'>mute snare sound</li>
			<li @click='handleClick("cancel")'>cancel</li>
		</ul>
	</div>
`
}

