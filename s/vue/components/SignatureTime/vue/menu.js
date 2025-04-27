export default {
	props: {
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

	data() {
		return {
			timeSigTop: '4',
			timeSigBottom: '4'
		}
	},

	methods: {
		handleTimeSig(action) {
			if (usingTriplets() && this.timeSigBottom != 4) {
				editor.track.changeDivision(16);  // switch to a non triplet division since they are not supported in this time signature
			}

			editor.track.numBeats = this.timeSigTop;
			editor.track.noteValue = this.timeSigBottom;
			var newNotesPerMeasure = calc_notes_per_measure(editor.track.timeDivision, editor.track.numBeats, editor.track.noteValue);
			
			// If new_notes_per_measure is greater it will cause the changeDivision code to error
			// as it tries to read the notes from the UI.   Setting it lower will allow the code to truncate
			// the groove properly to something smaller rather than interpolating the groove into something weird
			if (newNotesPerMeasure < editor.track.notesPerMeasure)
				editor.track.notesPerMeasure = newNotesPerMeasure;
			
			editor.track.changeDivision(editor.track.timeDivision);   // use this function because it will relayout everything						
			
			this.$emit('close-clicked');
		},

		/*
		 *
		*/
		close() {
			this.$emit('close-clicked');
		}
	},

	template: `
	<!-- dialog for the TIME label, hidden by default -->
	<div id="timeSigPopup" v-if="isOpen" style="position: absolute; z-index: 9999; display: block"  :style="{ top: y + 'px', left: x + 'px' }">
		<div id="timeSigPopupTitle">Choose a Time Signature</div>
		<div id="timeSigPopupOptions">
			<select id="timeSigPopupTimeSigTop" v-model="timeSigTop">
			<option value="2">2</option>
			<option value="3">3</option>
			<option selected value="4">4</option>
			<option value="5">5</option>
			<option value="6">6</option>
			<option value="7">7</option>
			<option value="8">8</option>
			<option value="9">9</option>
			<option value="10">10</option>
			<option value="11">11</option>
			<option value="12">12</option>
			<option value="13">13</option>
			<option value="14">14</option>
			<option value="15">15</option>
		</select>
		<b id="timeSigPopupSlash">/</b>
		<select id="timeSigPopupTimeSigBottom" v-model="timeSigBottom">
			<option selected value="4">4</option>
			<option value="8">8</option>
			<option value="16">16</option>
		</select>
		</div>
		<div id="timeSigPopupButtons">
		<button id="timeSigPopupCancel"  @click="close();">Cancel</button>
		<button id="timeSigPopupOK" @click="handleTimeSig">Done</button>
		</div>
	</div>
`
}