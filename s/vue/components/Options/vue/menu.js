export default {
	
	inject: ['options'],
	
	computed: {
		highlight() {
			return !!this.options.highlightOn;
		}
	},

	methods: {
		handleToggleHighlight() {
			this.options.highlightOn = !this.options.highlightOn;
		},
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