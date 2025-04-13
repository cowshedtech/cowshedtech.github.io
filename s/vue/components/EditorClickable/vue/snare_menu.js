import InstrumentMenu from './base_instrument_menu.js'

export default {
	name: 'SnareMenu',
	
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
				{ newState: constant_ABC_SN_Normal, label: 'Snare Normal' },
				{ newState: constant_ABC_SN_Accent, label: 'Snare Accent' },
				{ newState: constant_ABC_SN_Ghost, label: 'Ghost Note' },			
				{ newState: constant_ABC_SN_XStick, label: 'Cross Stick' },
				{ newState: constant_ABC_SN_Buzz, label: 'Buzz Stroke' },
				{ newState: constant_ABC_SN_Flam, label: 'Flam' },			
			],
			element: "snareContextMenu",
		}	
	},

	methods: {
		handleAction(action) {
			this.$emit('action', action)
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