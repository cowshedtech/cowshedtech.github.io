import InstrumentMenu from './base_instrument_menu.js'

export default {
	name: 'HighHatMenu',

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
			type: String
		},
		y: {
			type: String
		}
	},
	
	components: {
		InstrumentMenu
	},
	
	data() {
    	return { 
		modes: [
			{ newState: constant_ABC_OFF, label: 'Off' },
			{ newState: constant_ABC_HH_Normal, label: 'On' },
			{ newState: constant_ABC_HH_Open, label: 'Hi-hat open' },
			{ newState: constant_ABC_HH_Accent, label: 'Hi-hat closed' },
			{ newState: constant_ABC_HH_Crash, label: 'Crash' },
			{ newState: constant_ABC_HH_Ride, label: 'Ride' },
			{ newState: constant_ABC_HH_Ride_Bell, label: 'Ride Bell' },
			{ newState: constant_ABC_HH_Cow_Bell, label: 'Cow Bell' },
			{ newState: constant_ABC_HH_Stacker, label: 'Stacker' },
			{ newState: constant_ABC_HH_Metronome_Normal, label: 'Click' },
			{ newState: constant_ABC_HH_Metronome_Accent, label: 'Click - accent' }
		],
		instrument: "hh",
		element: "hhContextMenu",
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
			:instrument="instrument" 
			:element="element" 
			:instrument-modes="modes">
		</InstrumentMenu>
	`
}