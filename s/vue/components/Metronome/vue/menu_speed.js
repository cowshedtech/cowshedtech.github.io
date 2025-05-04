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
			keepIncreasingForever: metronome ? metronome.getAutoSpeedUpForever() : false,
			tempoIncrease: metronome ? metronome.getAutoSpeedUpTempoIncreaseAmount() : 5,
			tempoIncreaseInterval: metronome ? metronome.getAutoSpeedUpTempoIncreaseInterval() : 2
		}
	},

	watch: {
		keepIncreasingForever(newValue) {
			if (metronome) {
				metronome.setAutoSpeedUpForever(newValue);
			}
		},
		tempoIncrease(newValue) {
			if (metronome) {
				metronome.setAutoSpeedUpTempoIncreaseAmount(newValue);
			}
		},
		tempoIncreaseInterval(newValue) {
			if (metronome) {
				metronome.setAutoSpeedUpTempoIncreaseInterval(newValue);
			}
		}
	},

	methods: {
		handleClose() {
			this.$emit('close');
		}
	},

	mounted() {
        eventBus.$on('metronome-updated', () => {
			this.keepIncreasingForever = metronome ? metronome.getAutoSpeedUpForever() : false
			this.tempoIncrease = metronome ? metronome.getAutoSpeedUpTempoIncreaseAmount() : 5
			this.tempoIncreaseInterval = metronome ? metronome.getAutoSpeedUpTempoIncreaseInterval() : 2			
		})
    },
    
    beforeUnmount() {
        eventBus.$off('metronome-updated');
    },
  
  	template: `
		<div id="metronomeAutoSpeedupConfiguration" v-if="isOpen" :style="{ top: y + 'px', left: x + 'px' }">
			<div id="metronomeAutoSpeedupOutputText">
				Increase <span id="metronomeAutoSpeedupTempoIncreaseAmountOutput">{{ tempoIncrease }}</span> bpm in
				<span id="metronomeAutoSpeedupTempoIncreaseIntervalOutput">{{ tempoIncreaseInterval }}</span> min
			</div>
			<div id="metronomeAutoSpeedupConfigurationKeepIncreasing">
				<input type="checkbox" v-model="keepIncreasingForever" checked id="metronomeAutoSpeedUpKeepGoingForever"><label for="metronomeAutoSpeedUpKeepGoingForever">Keep increasing after the first interval</label>
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