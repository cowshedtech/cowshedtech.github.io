
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

	data() {
		return {
			refreshCounter: 0,
			removeHandler: null
		}
	},

	inject: ['track'],

	computed: {
		isMeasureMuted() {
			this.track && this.track.version;
			return this.track.isInstrumentMutedInMeasure(this.tomIndex == 1 ? Instruments.TOM1 : Instruments.TOM4, this.measureIndex);
		},
		isInstrumentMuted() {
			this.track && this.track.version;
			return this.track.isInstrumentMuted(this.tomIndex == 1 ? Instruments.TOM1 : Instruments.TOM4);
		},
		isInstrumentMutedEverywhere() {
			this.track && this.track.version;
			return this.track.isInstrumentMutedEverywhere(this.tomIndex == 1 ? Instruments.TOM1 : Instruments.TOM4);
		}	
	},

	methods: {
		handleClick(scope, action) {
			const track = editor.track;
			
			if (action === "cancel") {
				this.$emit('close');
				return;
			}

            if (scope === 'measure' && action === "mute") {
				editor.track.muteInstrumentForMeasure(this.tomIndex == 1 ? Instruments.TOM1 : Instruments.TOM4, this.measureIndex);				
			}

			if (scope === 'measure' && action === "unmute") {
				editor.track.unmuteInstrumentForMeasure(this.tomIndex == 1 ? Instruments.TOM1 : Instruments.TOM4, this.measureIndex);				
			}

			if (scope === 'all' && action === "mute") {
				for (let i = 1; i <= track.numberOfMeasures; i++) {
					editor.track.muteInstrumentForMeasure(this.tomIndex == 1 ? Instruments.TOM1 : Instruments.TOM4, i);				
				}								
			}

			if (scope === 'all' && action === "unmute") {
				for (let i = 1; i <= track.numberOfMeasures; i++) {
					editor.track.unmuteInstrumentForMeasure(this.tomIndex == 1 ? Instruments.TOM1 : Instruments.TOM4, i);				
				}								
			}

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
        
            this.$emit('close')
        }
    },

	template: `
	<div class="noteContextMenuNew" v-if="isOpen" style="position: absolute; z-index: 9999; display: block"  :style="{ top: y + 'px', left: x + 'px' }">
		<ul :id="'tom' + tomIndex + 'LabelContextMenu'" class="list" :style="{ top: y + 'px', left: x + 'px' }">
			<li @click.stop.prevent="handleClick('measure','off')">Measure off</li>
			<li @click.stop.prevent="handleClick('measure','on')">Measure on</li>
			<li v-if="!isMeasureMuted" @click='handleClick("measure", "mute")'>Measure muted</li>
			<li v-else @click='handleClick("measure", "unmute")'>Measure unmuted</li>
            <li @click.stop.prevent="handleClick('all','off')">All off</li>
			<li @click.stop.prevent="handleClick('all','on')">All on</li>
			<li v-if="!isInstrumentMutedEverywhere" @click='handleClick("all", "mute")'>All muted</li>
			<li v-if="isInstrumentMuted" @click='handleClick("all", "unmute")'>All unmuted</li>
			<li @click.stop.prevent="handleClick('cancel')">Cancel</li>
		</ul>
	</div>
`
}