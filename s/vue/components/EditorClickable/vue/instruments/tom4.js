import InstrumentMenu from './instrument_menu.js'

export default {
	name: 'Tom4Menu',
	components: {
		InstrumentMenu
	},
	data() {
    	return { 
		modes: [
			{ newState: 'off', label: 'Off' },
			{ newState: 'normal', label: 'On' }	
		],
		instrument: "tom4",
		element: "tom4ContextMenu",
	}	
  },
  template: `
	<InstrumentMenu :instrument="instrument" :element="element" :instrument-modes="modes"></InstrumentMenu>
  `
}