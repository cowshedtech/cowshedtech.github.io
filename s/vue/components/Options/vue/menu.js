export default {
	
	data() {
		return {
			highlight: this.options ? this.options.isHighlightOn() : false
		}
	},
	
	inject: ['options'],
	
	methods: {
		handleToggleHighlight() {
			let higlightOn = this.options.isHighlightOn();
			this.options.setHighlightOn(!higlightOn)
		},
	},

	mounted() {
		this.removeHandler = eventBus.$on('options-updated', () => {
			this.highlight = this.options.isHighlightOn()
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