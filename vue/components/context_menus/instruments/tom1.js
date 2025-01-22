import InstrumentMenu from './instrument_menu.js'

export default {
	name: 'Tom1Menu',
	components: {
		InstrumentMenu
	},
	data() {
    	return { 
		modes: [
			{ newState: 'off', label: 'Off' },
			{ newState: 'normal', label: 'On' }	
		],
		instrument: "tom1",
		element: "tom1ContextMenu",
	}	
  },
  template: `
	<InstrumentMenu :instrument="instrument" :element="element" :instrument-modes="modes"></InstrumentMenu>
  `
}