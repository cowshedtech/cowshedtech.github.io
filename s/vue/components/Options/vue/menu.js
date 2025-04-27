

export default {

	data() {
		return {
			highlight: options ? options.isHighlightOn() : false
		}
	},

	props: {
		isOpen: {
			type: Boolean,
			default: false
		},
		x: {
			type: Number
		},
		y: {
			type: Number
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
	<span class="noteContextMenuNew" v-if="isOpen" style="position: absolute; z-index: 9999; display: block"  :style="{ top: y + 'px', left: x + 'px' }">
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
	</span>
`
}