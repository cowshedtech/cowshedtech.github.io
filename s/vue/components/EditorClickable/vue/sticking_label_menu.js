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
		handleClick(action) {
			if (action !== "cancel") {

				// Determine start and end of loop based on action on single measure or all notes
				var startIndex = 0;
				var endIndex = editor.track.notesPerMeasure * editor.track.numberOfMeasures
				if (action !== 'all_alternate') {
					startIndex = editor.track.notesPerMeasure * (this.measureIndex - 1);
					endIndex = startIndex + editor.track.notesPerMeasure;
				} 
				
				for (var i = startIndex; i < endIndex; i++) {
					let newState = constant_ABC_STICK_OFF;					
					switch (action) {
						case "all_off":
							newState = constant_ABC_STICK_OFF;
							break;
						case "all_right":
							newState = constant_ABC_STICK_R;
							break;
						case "all_left":
							newState = constant_ABC_STICK_L;
							break;
						case "alternate":
							newState = (i % 2 === 0) ? constant_ABC_STICK_R : constant_ABC_STICK_L;						
							break;
						case "all_alternate":
							newState = (i % 2 === 0) ? constant_ABC_STICK_R : constant_ABC_STICK_L;						
							break;	
						case "all_count":
							newState = constant_ABC_STICK_COUNT;
							break;					
					}
					editor.track.setStickingStateNoNotify(i, newState);											
				}
				editor.track.notify();
			}			
		
			// if (action == "mute") {
			//     muteInstrument(instrument, measureForNoteLabelClick, true);
			//     return false;
			// }

			this.$emit('close')
		}
	},

	template: `
	<div class="noteContextMenuNew" v-if="isOpen" :style="{ top: y + 'px', left: x + 'px' }">
		<ul id="stickingsLabelContextMenu" class="list">
			<li @click='handleClick("all_off")'>measure <b>Off</b></li>
			<li @click='handleClick("alternate")'>measure <b>R</b>/<b>L</b></li>
			<li @click='handleClick("all_right")'>measure <b>R</b>s</li>
			<li @click='handleClick("all_left")'>measure <b>L</b>s</li>
			<li @click='handleClick("all_count")'>measure <b>C</b>ounts</li>
			<li @click='handleClick("all_alternate")'>all <b>R</b>/<b>L</b></li>
			<li @click='handleClick("cancel")'>cancel</li>
		</ul>
	</div>
	`
}

	
