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
					} else if (action == "downbeats") {
						newMode = i % 2 === 0 ? constant_ABC_HH_Normal : constant_ABC_OFF;
					} else if (action == "upbeats") {
						newMode = i % 2 === 0 ? constant_ABC_OFF : constant_ABC_HH_Normal;						
					} else if (action == "all_on") {
						newMode = constant_ABC_HH_Normal;
					}
					editor.track.setHighHatStateNoNotify(i, newMode);
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
		<ul id="hhLabelContextMenu" class="list">
			<li @click='handleClick("all_off")'>Measure off</li>
			<li @click='handleClick("all_on")'>Measure on</li>
			<li @click='handleClick("downbeats")'>Measure downbeats</li>
			<li @click='handleClick("upbeats")'>Measure upbeats</li>
			<li id='mute_hh_menu_item' @click='handleClick("mute")'>Measure muted</li>
			<li @click='handleClick("cancel")'>Cancel</li>
		</ul>
	</div>
`
}


    