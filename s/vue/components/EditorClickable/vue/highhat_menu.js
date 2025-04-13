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
			{ newState: 'off', label: 'Off' },
			{ newState: 'normal', label: 'On' },
			{ newState: 'open', label: 'Hi-hat open' },
			{ newState: 'accent', label: 'Hi-hat closed' },
			{ newState: 'crash', label: 'Crash' },
			{ newState: 'ride', label: 'Ride' },
			{ newState: 'ride_bell', label: 'Ride Bell' },
			{ newState: 'cow_bell', label: 'Cow Bell' },
			{ newState: 'stacker', label: 'Stacker' },
			{ newState: 'metronome_normal', label: 'Click' },
			{ newState: 'metronome_accent', label: 'Click - accent' }
		],
		instrument: "hh",
		element: "hhContextMenu",
		}	
	},

	methods: {
		closeMenu() {
			this.$emit('close')
		}
	},

	template: `
		<InstrumentMenu 
			:is-open="isOpen" 
			:x="x" 
			:y="y"
			@close="closeMenu"
			:instrument="instrument" 
			:element="element" 
			:instrument-modes="modes">
		</InstrumentMenu>
	`
}