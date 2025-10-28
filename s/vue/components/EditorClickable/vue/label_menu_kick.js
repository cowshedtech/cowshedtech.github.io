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
					let newState = constant_ABC_OFF;

					var numNotesPerCount = editor.track.timeDivision / editor.track.noteValue
					var currentState = 	editor.track.getInstrumentNote(Instruments.KICK, this.noteIndex);
					var kickIsOn = false;
					if (currentState == constant_ABC_KI_SandK || currentState == constant_ABC_KI_Normal)
						kickIsOn = true;

					if (action == "all_off") {
						newState = constant_ABC_OFF;
					} else if (action == "hh_foot_nums_on") {
						newState = (i % numNotesPerCount === 0 ? (kickIsOn ? constant_ABC_KI_SandK : constant_ABC_KI_Splash) : (kickIsOn ? constant_ABC_KI_Normal : constant_ABC_OFF))
					} else if (action == "hh_foot_ands_on") {
						newState = (i % numNotesPerCount === (numNotesPerCount / 2) ? (kickIsOn ? constant_ABC_KI_SandK: constant_ABC_KI_Splash) : (kickIsOn ? constant_ABC_KI_Normal : constant_ABC_OFF))
					} else if (action == "all_on") {
						newState = constant_ABC_KI_Normal;
					}
					editor.track.setInstrumentNoteNoNotify(Instruments.KICK, i, newState);       
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
	<div class="noteContextMenuNew" v-if="isOpen" style="position: absolute; z-index: 9999; display: block"  :style="{ top: y + 'px', left: x + 'px' }">
		<ul id="kickLabelContextMenu" class="list">
			<li @click='handleClick("all_off")'>Measure off</li>
			<li @click='handleClick("all_on")'>Measure on</li>
			<li @click='handleClick("hh_foot_nums_on")'>Measure hi-hat foot #'s on</li>
			<li @click='handleClick("hh_foot_ands_on")'>Measure hi-hat foot &'s on</li>
			<li id='mute_kick_menu_item' @click='handleClick("mute")'>Measure muted</li>
			<li @click='handleClick("cancel")'>Cancel</li>
		</ul>
	</div>
`
}



	

