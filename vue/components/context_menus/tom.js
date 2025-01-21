import Item from './tom_item.js'

export default {
	data() {
		return {
			modes: [
				{ newState: 'off', label: 'Off' },
				{ newState: 'normal', label: 'On' }
			]
		}
	},
	props: ['drum', 'elementId'],
	components: { Item },
	template: `
		<div class="noteContextMenu">
			<ul :id="elementId" class="list">
				<Item
					v-for="mode in modes"
					:key="mode.newState"
					:drum="drum"
					:new-state="mode.newState"
					:label="mode.label"
				/>
			</ul>
		</div>
	`
}