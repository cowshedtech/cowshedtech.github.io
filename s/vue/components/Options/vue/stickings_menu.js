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
			type: Number
		},
		y: {
			type: Number
		}
	},

	methods: {
        handleToggle() {
			options.setStickingVisible(!options.isStickingVisible()) 
            this.$emit('close');
        },
		handleReverse() {
			stickingsReverseRL();
            this.$emit('close');
        }
    },

	template: `
	<span class="noteContextMenuNew" v-if="isOpen" :style="{ top: y + 'px', left: x + 'px' }">
		<ul id="stickingsContextMenu" class="list" style="width: 200px;">
			<li @click="handleToggle"><b>Show or Hide stickings</b></li>
			<li @click="handleReverse"><b>Reverse stickings R/L</b></li>
		</ul>
	</span>
`
}