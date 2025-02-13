import InstrumentMenu from './instrument_menu.js'

export default {
	name: 'StickingMenu',
	components: {
		InstrumentMenu
	},
	data() {
    	return { 
		modes: [
			{ newState: 'off', label: 'Off' },
			{ newState: 'right', label: 'Right' },
			{ newState: 'left', label: 'Left' },
			{ newState: 'both', label: 'Both' },			
			{ newState: 'count', label: 'Count' },			
		],
		instrument: "sticking",
		element: "stickingContextMenu",
	}	
  },
  template: `
	<InstrumentMenu :instrument="instrument" :element="element" :instrument-modes="modes"></InstrumentMenu>
  `
}