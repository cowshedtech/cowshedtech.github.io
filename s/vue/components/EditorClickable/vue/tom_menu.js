import InstrumentMenu from './base_instrument_menu.js'

export default {
	name: 'Tom1Menu',
	
	components: {
		InstrumentMenu
	},

	props: {
		tomIndex: {
			type: Number,
			required: true
		},
		abcOn: {
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

	data() {
		return {
			modes: [
				{ newState: constant_ABC_OFF, label: 'Off' },
				{ newState: this.abcOn, label: 'On' }
			],
			element: "tom1ContextMenu",
		}
	},

	template: `
		<InstrumentMenu 
			:is-open="isOpen" 
			:x="x" 
			:y="y"
			@action="closeMenu"
			:element="element" 
			:instrument-modes="modes">
		</InstrumentMenu>
  	`
}