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
			noteLabelPopupClick("stickings", action, this.measureIndex)
			this.$emit('close')
		}
	},

	template: `
	<div class="noteContextMenuNew" v-if="isOpen" :style="{ top: y + 'px', left: x + 'px' }">
		<ul id="stickingsLabelContextMenu" class="list">
			<li @click='handleClick("all_off")'>all <b>Off</b></li>
			<li @click='handleClick("alternate")'>alternate <b>R</b>/<b>L</b></li>
			<li @click='handleClick("all_right")'>all <b>R</b>s</li>
			<li @click='handleClick("all_left")'>all <b>L</b>s</li>
			<li @click='handleClick("all_count")'><b>C</b>ounts</li>
			<li @click='handleClick("cancel")'>cancel</li>
		</ul>
	</div>
	`
}