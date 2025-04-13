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
			type: Number
		},
		y: {
			type: Number
		}
	},

	methods: {
		handleClick(action) {
			noteLabelPopupClick("hh", action, this.measureIndex)
			this.$emit('close')
		}
	},

  template: `
	<div class="noteContextMenuNew" v-if="isOpen" :style="{ top: y + 'px', left: x + 'px' }">
		<ul id="hhLabelContextMenu" class="list">
			<li @click='handleClick("all_off")'>all Hi-hats <b>Off</b></li>
			<li @click='handleClick("all_on")'>all Hi-hats <b>On</b></li>
			<li @click='handleClick("downbeats")'>downbeats</li>
			<li @click='handleClick("upbeats")'>upbeats</li>
			<li id='mute_hh_menu_item' @click='handleClick("mute")'>mute HH sound</li>
			<li @click='handleClick("cancel")'>cancel</li>
		</ul>
	</div>
`
}