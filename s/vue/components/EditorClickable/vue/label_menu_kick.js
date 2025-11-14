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

			const track = editor.track;
			const notesPerMeasure = track.notesPerMeasure;
			const startIndex = scope === 'measure'
				? notesPerMeasure * (this.measureIndex - 1)
				: 0;
			const endIndex = scope === 'measure'
				? startIndex + notesPerMeasure
				: notesPerMeasure * track.numberOfMeasures;

			for (let i = startIndex; i < endIndex; i++) {
				let newState = constant_ABC_OFF;

				var numNotesPerCount = editor.track.timeDivision / editor.track.noteValue
				var currentState = 	editor.track.getInstrumentNote(Instruments.KICK, this.noteIndex);
				var kickIsOn = false;
				if (currentState == constant_ABC_KI_SandK || currentState == constant_ABC_KI_Normal)
					kickIsOn = true;

				if (action == "off") {
					newState = constant_ABC_OFF;
				} else if (action == "hh_foot_nums_on") {
					newState = (i % numNotesPerCount === 0 ? (kickIsOn ? constant_ABC_KI_SandK : constant_ABC_KI_Splash) : (kickIsOn ? constant_ABC_KI_Normal : constant_ABC_OFF))
				} else if (action == "hh_foot_ands_on") {
					newState = (i % numNotesPerCount === (numNotesPerCount / 2) ? (kickIsOn ? constant_ABC_KI_SandK: constant_ABC_KI_Splash) : (kickIsOn ? constant_ABC_KI_Normal : constant_ABC_OFF))
				} else if (action == "on") {
					newState = constant_ABC_KI_Normal;
				}
				editor.track.setInstrumentNoteNoNotify(Instruments.KICK, i, newState);       
			}

			editor.track.notify();
						
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
			<li @click='handleClick("measure", "off")'>Measure off</li>
			<li @click='handleClick("measure", "on")'>Measure on</li>
			<li @click='handleClick("measure", "hh_foot_nums_on")'>Measure hi-hat foot #'s on</li>
			<li @click='handleClick("measure", "hh_foot_ands_on")'>Measure hi-hat foot &'s on</li>
			<li id='mute_kick_menu_item' @click='handleClick("mute")'>Measure muted</li>
			<li @click='handleClick("all", "off")'>All off</li>
			<li @click='handleClick("all", "on")'>All on</li>
			<li @click='handleClick("all", "hh_foot_nums_on")'>All hi-hat foot #'s on</li>
			<li @click='handleClick("all", "hh_foot_ands_on")'>All hi-hat foot &'s on</li>
			<li id='mute_kick_menu_item' @click='handleClick("mute")'>All muted</li>
			<li @click='handleClick("cancel")'>Cancel</li>
		</ul>
	</div>
`
}



	

