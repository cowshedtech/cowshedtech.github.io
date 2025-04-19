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
					let newMode = constant_ABC_OFF;
			
					if (action == "all_off") {
						newMode = constant_ABC_OFF;
					} else if (action == "all_on") {
						newMode = constant_ABC_SN_Accent;            
					} else if (action == "all_on_normal") {
						newMode = constant_ABC_SN_Normal;
					} else if (action == "all_on_ghost") {
						newMode = constant_ABC_SN_Ghost;            
					}        
					editor.track.setSnareStateNoNotify(i, newMode)
				}
				editor.track.notify();
			}
			
			// if (action == "mute") {
			// 	muteInstrument(instrument, measureForNoteLabelClick, true);
			// 	return false;
			// }

			
			this.$emit('close')
		}
	},

	template: `
	<div class="noteContextMenuNew" v-if="isOpen" :style="{ top: y + 'px', left: x + 'px' }">
		<ul id="snareLabelContextMenu" class="list">
			<li @click='handleClick("all_off")'>all Snares <b>Off</b></li>
			<li @click='handleClick("all_on")'>all <b>Accented</b></li>
			<li @click='handleClick("all_on_normal")'>all <b>Normal</b></li>
			<li @click='handleClick("all_on_ghost")'>all <b>Ghosts</b></li>
			<li id='mute_snare_menu_item' @click='handleClick("mute")'>mute snare sound</li>
			<li @click='handleClick("cancel")'>cancel</li>
		</ul>
	</div>
`
}

