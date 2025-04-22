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
		handleGSLink() {
			let url = get_GSURLForPage();
			window.open(url, '_blank');
			this.$emit('close')
		},

		
	},

	mounted() {
		this.removeHandler = options?.addChangeHandler(() => {
			this.highlight = options.isHighlightOn()
		})
	},
	beforeUnmount() {
		if (this.removeHandler) this.removeHandler()
	},

	template: `
	<span class="noteContextMenuNew" v-if="isOpen" :style="{ top: y + 'px', left: x + 'px' }">
		<ul id="trackContextMenu" class="list">
			<li 
				class="metronometrackContextMenuItem" 
				id="trackContextMenuHighlight" 
				@click="handleGSLink"
			>
				<b>GrooveScribe Link</b>
			</li>
		</ul>
	</span>
`
}