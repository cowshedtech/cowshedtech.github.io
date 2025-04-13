
export default {
	props: {
		tomIndex: {
			type: Number,
			required: true
		},
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
            noteLabelPopupClick("tom" + this.tomIndex, action, this.measureIndex)
            this.$emit('close')
        }
    },

	template: `
	<div class="noteContextMenuNew" v-if="isOpen" :style="{ top: y + 'px', left: x + 'px' }">
		<ul :id="'tom' + tomIndex + 'LabelContextMenu'" class="list">
			<li @click="handleClick('all_of')">all Toms <b>Off</b></li>
			<li @click="handleClick('all_on')">all Toms <b>On</b></li>
			<li id='mute_tom1_menu_item' @click="handleClick('mute')">mute tom sound</li>
			<li @click="handleClick('cancel')">cancel</li>
		</ul>
	</div>
`
}

