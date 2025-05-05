import BaseContextMenu from '../../BaseContextMenu/base_context_menu.js'

export default {
	
	data() {
		return {
			highlight: options ? options.isHighlightOn() : false
		}
	},
	
	methods: {
		handleToggleHighlight() {
			let higlightOn = options.isHighlightOn();
			options.setHighlightOn(!higlightOn)
		},
	},

	beforeDestroy() {
		eventBus.$off('options-updated');
	},

	mounted() {
		eventBus.$on('options-updated', () => {
			this.highlight = options.isHighlightOn()
		});		
	},

	template: `
		<ul id="optionsContextMenu" class="list">
			<li 
				class="metronomeOptionsContextMenuItem" 
				:class="{ 'menuChecked': highlight }"
				id="optionsContextMenuHighlight" 
				@click.stop.prevent="handleToggleHighlight"
			>
				<b>Highlighting</b>
			</li>
		</ul>	
`
}