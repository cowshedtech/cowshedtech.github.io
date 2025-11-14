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
			if (action !== "cancel") {

				// Determine start and end of loop based on action on single measure or all notes
				var startIndex = 0;
				var endIndex = editor.track.notesPerMeasure * editor.track.numberOfMeasures
				if (scope === 'measure') {
					startIndex = editor.track.notesPerMeasure * (this.measureIndex - 1);
					endIndex = startIndex + editor.track.notesPerMeasure;
				} 
				
				for (var i = startIndex; i < endIndex; i++) {
					let newState = constant_ABC_OFF;					
					switch (action) {
						case "off":
								newState = constant_ABC_OFF;
							break;
						case "right":						
							newState = constant_ABC_STICK_R;
							break;
						case "left":						
							newState = constant_ABC_STICK_L;
							break;
						case "alternate":
							newState = (i % 2 === 0) ? constant_ABC_STICK_R : constant_ABC_STICK_L;						
							break;	
						case "reverse":
							const note = editor.track.getInstrumentNote(Instruments.STICKING, i);	
							if (note === constant_ABC_STICK_R) {
								newState = constant_ABC_STICK_L;
							} else if (note === constant_ABC_STICK_L) {
								newState = constant_ABC_STICK_R;
							}
							break;							
						case "count":
							newState = constant_ABC_STICK_COUNT;
							break;					
					}
					editor.track.setInstrumentNoteNoNotify(Instruments.STICKING, i, newState);											
				}
				editor.track.notify();
			}			
		
			this.$emit('close')
		}
	},

	template: `
	<div class="noteContextMenuNew" v-if="isOpen" style="position: absolute; z-index: 9999; display: block"  :style="{ top: y + 'px', left: x + 'px' }">
		<ul id="stickingsLabelContextMenu" class="list">
			<li @click='handleClick("measure", "off")'>Measure <b>Off</b></li>
			<li @click='handleClick("measure", "alternate")'>Measure <b>R</b>/<b>L</b></li>
			<li @click='handleClick("measure", "right")'>Measure <b>R</b>s</li>
			<li @click='handleClick("measure", "left")'>Measure <b>L</b>s</li>
			<li @click='handleClick("measure", "count")'>Measure <b>C</b>ounts</li>
			<li @click='handleClick("measure", "reverse")'>Measure <b>R</b>everse</li>
			<li @click='handleClick("all", "off")'>All <b>Off</b></li>
			<li @click='handleClick("all", "alternate")'>All <b>R</b>/<b>L</b></li>
			<li @click='handleClick("all", "right")'>All <b>R</b>s</li>
			<li @click='handleClick("all", "left")'>All <b>L</b>s</li>
			<li @click='handleClick("all", "count")'>All <b>C</b>ounts</li>
			<li @click='handleClick("all", "reverse")'>All <b>R</b>everse</li>
			<li @click='handleClick("all", "cancel")'>Cancel</li>
		</ul>
	</div>
	`
}

	
