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
				var startIndex = editor.track.notesPerMeasure * (this.measureIndex - 1);
				for (var i = startIndex; i - startIndex < editor.track.notesPerMeasure; i++) {
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
			<li @click='handleClick("all_off")'>all <b>Off</b></li>
			<li @click='handleClick("alternate")'>alternate <b>R</b>/<b>L</b></li>
			<li @click='handleClick("all_right")'>all <b>R</b>s</li>
			<li @click='handleClick("all_left")'>all <b>L</b>s</li>
			<li @click='handleClick("all_count")'><b>C</b>ounts</li>
			<li @click='handleClick("cancel")'>cancel</li>
		</ul>
	</div>
	`
}

	
