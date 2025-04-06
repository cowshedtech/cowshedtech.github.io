import InstrumentMenu from './instrument_menu.js'

export default {
	name: 'KickMenu',
	components: {
		InstrumentMenu
	},
	data() {
    	return { 
		modes: [
			{ newState: 'off', label: 'Off' },
			{ newState: 'normal', label: 'Kick Normal' },
			{ newState: 'splash', label: 'Hi-hat foot' },
			{ newState: 'kick_and_splash', label: 'Kick & Hi-hat foot' },			
		],
		instrument: "kick",
		element: "kickContextMenu",
	}	
  },
  template: `
	<InstrumentMenu :instrument="instrument" :element="element" :instrument-modes="modes"></InstrumentMenu>
  `
}