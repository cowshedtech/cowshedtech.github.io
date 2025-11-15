
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
                    newMode = constant_ABC_OFF
                } else if (action == "on") {
                    newMode = this.midiNormal
                }
                editor.track.setInstrumentNoteNoNotify(this.tomIndex == 1 ? Instruments.TOM1 : Instruments.TOM4, i, newMode)
            }
    
            editor.track.notify();
        
            // if (action == "mute") {
            //     muteInstrument(instrument, measureForNoteLabelClick, true);
            //     return false;
            // }

            this.$emit('close')
        }
    },

	template: `
	<div class="noteContextMenuNew" v-if="isOpen" style="position: absolute; z-index: 9999; display: block"  :style="{ top: y + 'px', left: x + 'px' }">
		<ul :id="'tom' + tomIndex + 'LabelContextMenu'" class="list" :style="{ top: y + 'px', left: x + 'px' }">
			<li @click.stop.prevent="handleClick('measure','off')">Measure off</li>
			<li @click.stop.prevent="handleClick('measure','on')">Measure on</li>
			<li id='mute_tom1_menu_item' @click.stop.prevent="handleClick('mute')">Measure muted</li>
            <li @click.stop.prevent="handleClick('all','off')">All off</li>
			<li @click.stop.prevent="handleClick('all','on')">All on</li>
			<li @click.stop.prevent="handleClick('cancel')">Cancel</li>
		</ul>
	</div>
`
}