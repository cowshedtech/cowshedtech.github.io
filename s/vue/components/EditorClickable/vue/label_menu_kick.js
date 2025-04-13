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
			noteLabelPopupClick("kick", action, this.measureIndex)
			this.$emit('close')
		}
	},

  template: `
	<div class="noteContextMenuNew" v-if="isOpen" :style="{ top: y + 'px', left: x + 'px' }">
		<ul id="kickLabelContextMenu" class="list">
			<li @click='handleClick("all_off")'>all Kicks <b>Off</b></li>
			<li @click='handleClick("all_on")'>all Kicks <b>On</b></li>
			<li @click='handleClick("hh_foot_nums_on")'>HH foot #'s <b>On</b></li>
			<li @click='handleClick("hh_foot_ands_on")'>HH foot &'s <b>On</b></li>
			<li id='mute_kick_menu_item' @click='handleClick("mute")'>mute kick sound</li>
			<li @click='handleClick("cancel")'>cancel</li>
		</ul>
	</div>
`
}