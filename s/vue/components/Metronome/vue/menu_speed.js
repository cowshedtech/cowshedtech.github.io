/**
 * @typedef {Object} MenuSpeedProps
 * @property {boolean} isOpen - Whether the menu is open
 * @property {number} x - X coordinate for menu positioning
 * @property {number} y - Y coordinate for menu positioning
 * @property {Object} midiPlayer - The MIDI player instance
 * @property {Object} eventBus - The event bus instance
 */

export default {
	props: {
		eventBus: {
			type: Object,
			required: true
		}
	},

	inject: ['midiPlayer'],

	data() {
		return {
			keepIncreasingForever: this.midiPlayer?.getAutoSpeedUpForever() ?? false,
			tempoIncrease: this.midiPlayer?.getTempoIncreaseAmount() ?? 5,
			tempoIncreaseInterval: this.midiPlayer?.getTempoIncreaseInterval() ?? 2
		}
	},

	watch: {
		keepIncreasingForever(newValue) {
			try {
				this.midiPlayer.setAutoSpeedUpForever(newValue);
			} catch (error) {
				console.error('Failed to set auto speed up forever:', error);
			}
		},
		tempoIncrease(newValue) {
			try {
				const value = Number(newValue);
				if (isNaN(value) || value < 1 || value > 100) {
					throw new Error('Tempo increase must be between 1 and 100');
				}
				this.midiPlayer.setAutoSpeedUpTempoIncreaseAmount(value);
			} catch (error) {
				console.error('Failed to set tempo increase:', error);
			}
		},
		tempoIncreaseInterval(newValue) {
			try {
				const value = Number(newValue);
				if (isNaN(value) || value < 1 || value > 20) {
					throw new Error('Tempo increase interval must be between 1 and 20');
				}
				this.midiPlayer.setAutoSpeedUpTempoIncreaseInterval(value);
			} catch (error) {
				console.error('Failed to set tempo increase interval:', error);
			}
		}
	},

	methods: {
		handleClose() {
			this.$emit('close');
		},

		updateParameters() {
			this.keepIncreasingForever = this.midiPlayer?.getAutoSpeedUpForever() ?? false;
			this.tempoIncrease = this.midiPlayer?.getTempoIncreaseAmount() ?? 5;
			this.tempoIncreaseInterval = this.midiPlayer?.getTempoIncreaseInterval() ?? 2;
		}
	},

	mounted() {
		this.eventBus.$on('parametersUpdate', this.updateParameters);
	},
    
	beforeUnmount() {
		this.eventBus.$off('parametersUpdate', this.updateParameters);
	},
  
	template: `
		<div id="metronomeAutoSpeedupConfiguration">
			<div id="metronomeAutoSpeedupOutputText">
				Increase <span id="metronomeAutoSpeedupTempoIncreaseAmountOutput">{{ tempoIncrease }}</span> bpm in
				<span id="metronomeAutoSpeedupTempoIncreaseIntervalOutput">{{ tempoIncreaseInterval }}</span> min
			</div>
			<div id="metronomeAutoSpeedupConfigurationKeepIncreasing">
				<input type="checkbox" v-model="keepIncreasingForever" checked id="metronomeAutoSpeedUpKeepGoingForever">
				<label for="metronomeAutoSpeedUpKeepGoingForever">Keep increasing after the first interval</label>
			</div>
			<div id="metronomeAutoSpeedupConfigurationSliders">
				<div id="metronomeAutoSpeedupConfigurationAmountLable">Amount in BPM</div>
				<input type="range" min="1" max="100" v-model="tempoIncrease" class="metronomeAutoSpeedUpRange" id="metronomeAutoSpeedupTempoIncreaseAmount">
				<div id="metronomeAutoSpeedupConfigurationIntervalLable">Interval in Minutes</div>
				<input type="range" min="1" max="20" v-model="tempoIncreaseInterval" class="metronomeAutoSpeedUpRange" id="metronomeAutoSpeedupTempoIncreaseInterval" step="1">
			</div>
			<div id="metronomeAutoSpeedupCloseButtonDiv">
				<button id="metronomeAutoSpeedupConfigurationCloseButton" @click="handleClose">Done</button>
			</div>
		</div>
	`
}