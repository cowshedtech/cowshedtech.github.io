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
				{ newState: constant_ABC_T1_Normal, label: 'On' }
			],
			instrument: "tom1",
			element: "tom1ContextMenu",
		}
	},

	template: `
		<InstrumentMenu 
			:is-open="isOpen" 
			:x="x" 
			:y="y"
			@action="closeMenu"
			:instrument="instrument" 
			:element="element" 
			:instrument-modes="modes">
		</InstrumentMenu>
  	`
}