import MenuItem from './base_instrument_menu_item.js'

export default {
	components: { MenuItem },
	props: ['instrument', 'element', 'instrumentModes'],

	props: {
		instrument: {
			type: String,
			required: true
		},
		element: {
			type: String,
			required: true
		},
		instrumentModes: {
			type: String,
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

	template: `
	  <div v-if="isOpen" :style="{ top: y + 'px', left: x + 'px' }" class="noteContextMenuNew" >
		  <ul :id="element" class="list">
			 <MenuItem
				v-for="instrumentMode in instrumentModes"
				:key="instrumentMode.newState"
				:instrument="instrument"
				:new-state="instrumentMode.newState"
				:label="instrumentMode.label"
				/>
		  </ul>		  
	  </div>
  `
}
