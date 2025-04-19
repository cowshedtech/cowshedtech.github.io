
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
                    editor.track.setTomStateNoNotify(this.tomIndex, i, newMode)
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
		<ul :id="'tom' + tomIndex + 'LabelContextMenu'" class="list">
			<li @click="handleClick('all_of')">all Toms <b>Off</b></li>
			<li @click="handleClick('all_on')">all Toms <b>On</b></li>
			<li id='mute_tom1_menu_item' @click="handleClick('mute')">mute tom sound</li>
			<li @click="handleClick('cancel')">cancel</li>
		</ul>
	</div>
`
}