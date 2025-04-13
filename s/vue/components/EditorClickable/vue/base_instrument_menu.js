import MenuItem from './base_instrument_menu_item.js'

export default {
	components: { MenuItem },
	props: ['instrument', 'element', 'instrumentModes'],

	props: {
		element: {
			type: String,
			required: true
		},
		instrumentModes: {
			type: Object,
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
		handleAction(action) {
			this.$emit('action', action)
		}
	},

	template: `
	  <div 
	  	v-if="isOpen" 
		:style="{ top: y + 'px', left: x + 'px' }" 
		class="noteContextMenuNew" >
		  	<ul :id="element" class="list">
				<MenuItem
				v-for="instrumentMode in instrumentModes"
				:key="instrumentMode.newState"
				:label="instrumentMode.label"
				:new-state="instrumentMode.newState"
				@action="handleAction"
				/>
		  	</ul>		  
	  </div>
  `
}

