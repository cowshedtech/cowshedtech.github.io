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
			// Fast path: cancel just closes the menu
			if (action === "cancel") {
				this.$emit('close');
				return;
			}

			// Cache track and computed bounds
			const track = editor.track;
			const notesPerMeasure = track.notesPerMeasure;
			const startIndex = scope === 'measure'
				? notesPerMeasure * (this.measureIndex - 1)
				: 0;
			const endIndex = scope === 'measure'
				? startIndex + notesPerMeasure
				: notesPerMeasure * track.numberOfMeasures;
			
			// Bind setter once to avoid repeated property lookups
			const setNoteNoNotify = track.setInstrumentNoteNoNotify.bind(track, Instruments.STICKING);
			
			// Simple action lookup to avoid switch overhead in the loop
			const simpleActions = {
				off: constant_ABC_OFF,
				right: constant_ABC_STICK_R,
				left: constant_ABC_STICK_L,
				count: constant_ABC_STICK_COUNT,
			};
			
			if (simpleActions[action] !== undefined) {
				const value = simpleActions[action];
				for (let i = startIndex; i < endIndex; i++) {
					setNoteNoNotify(i, value);
				}
				track.notify();
				this.$emit('close');
				return;
			}
			
			if (action === 'alternate') {
				for (let i = startIndex; i < endIndex; i++) {
					const value = (i % 2 === 0) ? constant_ABC_STICK_R : constant_ABC_STICK_L;
					setNoteNoNotify(i, value);
				}
				track.notify();
				this.$emit('close');
				return;
			}
			
			if (action === 'reverse') {
				for (let i = startIndex; i < endIndex; i++) {
					const note = track.getInstrumentNote(Instruments.STICKING, i);
					const value = note === constant_ABC_STICK_R
						? constant_ABC_STICK_L
						: (note === constant_ABC_STICK_L ? constant_ABC_STICK_R : note);
					setNoteNoNotify(i, value);
				}
				track.notify();
				this.$emit('close');
				return;
			}
		
			this.$emit('close')
		}
	},

	template: `
	<div class="noteContextMenuNew" v-if="isOpen" style="position: absolute; z-index: 9999; display: block"  :style="{ top: y + 'px', left: x + 'px' }">
		<ul id="stickingsLabelContextMenu" class="list" :style="{ top: y + 'px', left: x + 'px' }">
			<li @click='handleClick("measure", "off")'>Measure <b>Off</b></li>
			<li @click='handleClick("measure", "alternate")'>Measure <b>R</b>/<b>L</b></li>
			<li @click='handleClick("measure", "right")'>Measure <b>R</b>s</li>
			<li @click='handleClick("measure", "left")'>Measure <b>L</b>s</li>
			<li @click='handleClick("measure", "count")'>Measure <b>C</b>ounts</li>
			<li @click='handleClick("measure", "reverse")'>Measure <b>R</b>everse</li>
			<li @click='handleClick("all", "off")'>All <b>Off</b></li>
			<li @click='handleClick("all", "alternate")'>All <b>R</b>/<b>L</b></li>
			<li @click='handleClick("all", "right")'>All <b>R</b>s</li>
			<li @click='handleClick("all", "left")'>All <b>L</b>s</li>
			<li @click='handleClick("all", "count")'>All <b>C</b>ounts</li>
			<li @click='handleClick("all", "reverse")'>All <b>R</b>everse</li>
			<li @click='handleClick("all", "cancel")'>Cancel</li>
		</ul>
	</div>
	`
}

	
