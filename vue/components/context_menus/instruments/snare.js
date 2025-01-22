import InstrumentMenu from './instrument_menu.js'

export default {
	name: 'SnareMenu',
	components: {
		InstrumentMenu
	},
	data() {
    	return { 
		modes: [
			{ newState: 'off', label: 'Off' },
			{ newState: 'normal', label: 'Snare Normal' },
			{ newState: 'accent', label: 'Snare Accent' },
			{ newState: 'ghost', label: 'Ghost Note' },			
			{ newState: 'xstick', label: 'Cross Stick' },
			{ newState: 'buzz', label: 'Buzz Stroke' },
			{ newState: 'flam', label: 'Flam' },			
		],
		instrument: "snare",
		element: "snareContextMenu",
	}	
  },
  template: `
	<InstrumentMenu :instrument="instrument" :element="element" :instrument-modes="modes"></InstrumentMenu>
  `
}