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

	inject: ['track'],

	computed: {
		isMeasureMuted() {
			this.track && this.track.version;
			return this.track.isInstrumentMutedInMeasure(Instruments.KICK, this.measureIndex);
		},
		isInstrumentMuted() {
			this.track && this.track.version;
			return this.track.isInstrumentMuted(Instruments.KICK);
		},
		isInstrumentMutedEverywhere() {
			this.track && this.track.version;
			return this.track.isInstrumentMutedEverywhere(Instruments.KICK);
		}	
	},

	methods: {
		handleClick(scope, action) {
			const track = this.track;
			
			if (action === "cancel") {
				this.$emit('close');
				return;
			}

			if (scope === 'measure' && action === "mute") {
				this.track.muteInstrumentForMeasure(Instruments.KICK, this.measureIndex);				
			}

			if (scope === 'measure' && action === "unmute") {
				this.track.unmuteInstrumentForMeasure(Instruments.KICK, this.measureIndex);				
			}

			if (scope === 'all' && action === "mute") {
				for (let i = 1; i <= track.numberOfMeasures; i++) {
					this.track.muteInstrumentForMeasure(Instruments.KICK, i);				
				}								
			}

			if (scope === 'all' && action === "unmute") {
				for (let i = 1; i <= track.numberOfMeasures; i++) {
					this.track.unmuteInstrumentForMeasure(Instruments.KICK, i);				
				}								
			}

			if (action === "unmute" || action === "mute") {
				this.track.notify();						
				this.$emit('close');
				return;
			}
		
			const notesPerMeasure = track.notesPerMeasure;
			const startIndex = scope === 'measure'
				? notesPerMeasure * (this.measureIndex - 1)
				: 0;
			const endIndex = scope === 'measure'
				? startIndex + notesPerMeasure
				: notesPerMeasure * track.numberOfMeasures;

			for (let i = startIndex; i < endIndex; i++) {
				let newState = constant_ABC_OFF;

				var numNotesPerCount = this.track.timeDivision / this.track.noteValue
				var currentState = 	this.track.getInstrumentNote(Instruments.KICK, this.noteIndex);
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
				this.track.setInstrumentNoteNoNotify(Instruments.KICK, i, newState);       
			}

			this.track.notify();
						
			this.$emit('close')
		}
	},	

  template: `
	<div class="noteContextMenuNew" v-if="isOpen" style="position: absolute; z-index: 9999; display: block"  :style="{ top: y + 'px', left: x + 'px' }">
    <ul id="kickLabelContextMenu" class="list" :style="{ top: y + 'px', left: x + 'px' }">
			<li @click='handleClick("measure", "off")'>Measure off</li>
			<li @click='handleClick("measure", "on")'>Measure on</li>
			<li @click='handleClick("measure", "hh_foot_nums_on")'>Measure hi-hat foot #'s on</li>
			<li @click='handleClick("measure", "hh_foot_ands_on")'>Measure hi-hat foot &'s on</li>
			<li v-if="!isMeasureMuted" @click='handleClick("measure", "mute")'>Measure muted</li>
			<li v-else @click='handleClick("measure", "unmute")'>Measure unmuted</li>
			<li @click='handleClick("all", "off")'>All off</li>
			<li @click='handleClick("all", "on")'>All on</li>
			<li @click='handleClick("all", "hh_foot_nums_on")'>All hi-hat foot #'s on</li>
			<li @click='handleClick("all", "hh_foot_ands_on")'>All hi-hat foot &'s on</li>
			<li v-if="!isInstrumentMutedEverywhere" @click='handleClick("all", "mute")'>All muted</li>
			<li v-if="isInstrumentMuted" @click='handleClick("all", "unmute")'>All unmuted</li>
			<li @click='handleClick("cancel")'>Cancel</li>
		</ul>
	</div>
`
}


	

