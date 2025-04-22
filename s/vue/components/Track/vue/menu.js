export default {

	data() {
		return {
			highlight: options ? options.isHighlightOn() : false,
			urlInput: ''
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

		handleAppendTrack() {
			if (!this.urlInput) return;

			let newTrack = new Track();
			var newMidiPlayer = new MIDIPlayer(newTrack.trackID);
			var newMetronome = new Metronome();
			var newOptions = new Options();

			getGrooveDataFromUrlString(
				this.urlInput, 
				newTrack, 
				newOptions, 
				newMidiPlayer, 
				newMetronome, 
				newOptions.debugMode);

			editor.track.appendTrack(newTrack);
			this.urlInput = '';
			this.$emit('close');
		}		
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
			<li class="metronometrackContextMenuItem">
				<b>Append Track</b>
				<div style="display: flex; gap: 4px; padding: 4px;">
					<input 
						type="text" 
						v-model="urlInput" 
						placeholder="Enter URL" 
						style="flex: 1; padding: 4px;"
						@keyup.enter="handleAppendTrack"
					>
					<button 
						@click="handleAppendTrack"
						style="padding: 4px 8px;"
					>
						Add
					</button>
				</div>
			</li>
		</ul>
	</span>
`
}