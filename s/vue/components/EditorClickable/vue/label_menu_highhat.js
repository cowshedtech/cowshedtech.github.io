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
				let newMode = constant_ABC_OFF;
				if (action == "off") {
					newMode = constant_ABC_OFF;
				} else if (action == "downbeats") {
					newMode = i % 2 === 0 ? constant_ABC_HH_Normal : constant_ABC_OFF;
				} else if (action == "upbeats") {
					newMode = i % 2 === 0 ? constant_ABC_OFF : constant_ABC_HH_Normal;						
				} else if (action == "on") {
					newMode = constant_ABC_HH_Normal;
				}
				editor.track.setInstrumentNoteNoNotify(Instruments.HIGH_HAT, i, newMode);
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
		<ul id="hhLabelContextMenu" class="list">
			<li @click='handleClick("measure", "off")'>Measure off</li>
			<li @click='handleClick("measure", "on")'>Measure on</li>
			<li @click='handleClick("measure", "downbeats")'>Measure downbeats</li>
			<li @click='handleClick("measure", "upbeats")'>Measure upbeats</li>
			<li id='mute_hh_menu_item' @click='handleClick("mute")'>Measure muted</li>
			<li @click='handleClick("all", "off")'>All off</li>
			<li @click='handleClick("all", "on")'>All on</li>
			<li @click='handleClick("all", "downbeats")'>All downbeats</li>
			<li @click='handleClick("all", "upbeats")'>All upbeats</li>
			<li @click='handleClick("all", "cancel")'>Cancel</li>
		</ul>
	</div>
`
}


    