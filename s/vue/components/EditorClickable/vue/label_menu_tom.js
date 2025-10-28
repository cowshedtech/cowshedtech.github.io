
export default {
	props: {
		tomIndex: {
			type: Number,
			required: true
		},
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
        },
        midiNormal: {
            type: String,
            required: true
        }
	},

	methods: {
		handleClick(action) {
            if (action !== "cancel") {
                var startIndex = editor.track.notesPerMeasure * (this.measureIndex - 1);
                for (var i = startIndex; i - startIndex < editor.track.notesPerMeasure; i++) {
                    let newMode = constant_ABC_OFF;
        
                    if (action == "all_off") {
                        newMode = constant_ABC_OFF
                    } else if (action == "all_on") {
                        newMode = this.midiNormal
                    }
                    editor.track.setInstrumentNoteNoNotify(this.tomIndex == 1 ? Instruments.TOM1 : Instruments.TOM4, i, newMode)
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
	<div class="noteContextMenuNew" v-if="isOpen" style="position: absolute; z-index: 9999; display: block"  :style="{ top: y + 'px', left: x + 'px' }">
		<ul :id="'tom' + tomIndex + 'LabelContextMenu'" class="list">
			<li @click.stop.prevent="handleClick('all_of')">Measure off</li>
			<li @click.stop.prevent="handleClick('all_on')">Measure on</li>
			<li id='mute_tom1_menu_item' @click.stop.prevent="handleClick('mute')">Measure muted</li>
			<li @click.stop.prevent="handleClick('cancel')">Cancel</li>
		</ul>
	</div>
`
}