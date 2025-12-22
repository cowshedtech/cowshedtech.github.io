export default {
	
	props: {
		measureIndex: {
			type: Number,
			required: true
		},
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
		handleClick(scope, action) {
			if (action === "cancel") {
				this.$emit('close');
				return;
			}

			if (action === "mute") {
				editor.track.muteInstrumentForMeasure(Instruments.SNARE, this.measureIndex);
				editor.track.notify();						
				this.$emit('close');
				return;
			}

			const track = editor.track;
			const notesPerMeasure = track.notesPerMeasure;
			const startIndex = scope === 'measure'
				? notesPerMeasure * (this.measureIndex - 1)
				: 0;
			const endIndex = scope === 'measure'
				? startIndex + notesPerMeasure
				: notesPerMeasure * track.numberOfMeasures;

			for (let i = startIndex; i < endIndex; i++) {
				let newMode = constant_ABC_OFF;
		
				if (action == "off") {
					newMode = constant_ABC_OFF;
				} else if (action == "on") {
					newMode = constant_ABC_SN_Accent;            
				} else if (action == "on_normal") {
					newMode = constant_ABC_SN_Normal;
				} else if (action == "on_ghost") {	
					newMode = constant_ABC_SN_Ghost;            
				}        
				editor.track.setInstrumentNoteNoNotify(Instruments.SNARE, i, newMode)
			}
			editor.track.notify();
			
			this.$emit('close')
		}
	},

	template: `
	<div class="noteContextMenuNew" v-if="isOpen" style="position: absolute; z-index: 9999; display: block" :style="{ top: y + 'px', left: x + 'px' }">
		<ul id="snareLabelContextMenu" class="list" :style="{ top: y + 'px', left: x + 'px' }">
			<li @click='handleClick("measure","off")'>Measure off</li>
			<li @click='handleClick("measure","on")'>Measure accented</li>
			<li @click='handleClick("measure","on_normal")'>Measure normal</li>
			<li @click='handleClick("measure","on_ghost")'>Measure ghosts</li>
			<li @click='handleClick("measure","mute")'>Measure muted</li>
			<li @click='handleClick("all","off")'>All off</li>
			<li @click='handleClick("all","on")'>All accented</li>
			<li @click='handleClick("all","on_normal")'>All normal</li>
			<li @click='handleClick("all","on_ghost")'>All ghosts</li>
			<li @click='handleClick("all","cancel")'>Cancel</li>
		</ul>
	</div>
`
}

