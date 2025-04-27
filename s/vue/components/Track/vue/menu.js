

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

			if (editor.track.timeDivision < newTrack.timeDivision) {
				editor.track.changeDivision(newTrack.timeDivision)
			} else {
				newTrack.changeDivision(editor.track.timeDivision)
			}

			editor.track.appendTrack(newTrack);
			this.urlInput = '';
			this.$emit('close');
		},

		handleImportTrack() {
			if (!this.urlImportInput) return;

			let urlParts = this.urlImportInput.split('?');
			let queryString = urlParts.length > 1 ? '?' + urlParts[1] : '';
			let newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryString;
			window.open(newUrl, "_self");
			this.$emit('close');
		}	
	},

	mounted() {
		eventBus.$on('options-updated', () => {
            this.highlight = options.isHighlightOn()
        });	
	},
	beforeUnmount() {
		eventBus.$off('options-updated');
	},

	template: `
	<span class="noteContextMenuNew" id="trackContextMenuContainter" v-if="isOpen" style="position: absolute; z-index: 9999; display: block" :style="{ top: y + 'px', left: x + 'px' }">
		<ul id="trackContextMenu" class="list">
			<li 
				class="metronometrackContextMenuItem" 
				id="trackContextMenuHighlight" 
				@click.stop.prevent="handleGSLink"
			>
				<b>Export to GrooveScribe</b>
			</li>
			<li class="metronometrackContextMenuItem">
				<b>Import from GrooveSrcibe</b>
				<div style="display: flex; gap: 4px; padding: 4px;">
					<input 
						type="text" 
						v-model="urlImportInput" 
						placeholder="Enter URL" 
						style="flex: 1; padding: 4px;"
						@keyup.enter="handleImportTrack"
					>
					<button 
						@click.stop.prevent="handleImportTrack"
						style="padding: 4px 8px;"
					>
						Add
					</button>
				</div>
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
						@click.stop.prevent="handleAppendTrack"
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