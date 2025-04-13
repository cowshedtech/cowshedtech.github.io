import InstrumentMenu from './base_instrument_menu.js'

export default {
	name: 'KickMenu',
	
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

	components: {
		InstrumentMenu
	},
	
	data() {
    	return { 
			modes: [
				{ newState: constant_ABC_OFF, label: 'Off' },
				{ newState: constant_ABC_KI_Normal, label: 'Kick Normal' },
				{ newState: constant_ABC_KI_Splash, label: 'Hi-hat foot' },
				{ newState: constant_ABC_KI_SandK, label: 'Kick & Hi-hat foot' },			
			],
			element: "kickContextMenu",
		}	
	},

	template: `
		<InstrumentMenu 
			:is-open="isOpen" 
			:x="x" 
			:y="y"
			:element="element" 
			:instrument-modes="modes">
		</InstrumentMenu>
  	`
}