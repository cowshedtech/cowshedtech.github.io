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
		}
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
	<InstrumentMenu :instrument="'tom' + tomIndex" :element="element" :instrument-modes="modes"></InstrumentMenu>
  `
}