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

	mounted() {
		this.removeHandler = eventBus.$on('options-updated', () => {
			this.highlight = options.isHighlightOn()
		});		
	},

	beforeUnmount() {
        if (this.removeHandler) this.removeHandler() 
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