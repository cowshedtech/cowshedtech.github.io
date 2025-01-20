import Item from './tom_item.js'

export default {
	data() {
		return {
			modes: [
			{ newState: 'off', label: 'off' },
			{ newState: 'normal', label: 'on'  },		  
			]
		}
	},
	props: {
		drum: String,
		elementId: String
	 },
	mounted() {},
	methods: { },
	components: {
		Item
	},
  	template: `
		<div class="noteContextMenu">
			<ul :id="elementId" class="list">
				<Item :drum="drum" :newState="mode.newState" :label="mode.label" v-for="mode in this.modes"></Item>			
			</ul>			
		</div>
`
}


{/* <ul id="tom1ContextMenu" class="list"> */}