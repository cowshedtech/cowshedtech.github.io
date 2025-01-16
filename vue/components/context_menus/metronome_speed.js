export default {
  data() {
    return { }
  },
  props: { },
  template: `
    <!-- this is used by the metronome auto speed up option menu, and is hidden by default -->
	<div id="metronomeAutoSpeedupConfiguration">
		<div id="metronomeAutoSpeedupOutputText">
			Increase <span id="metronomeAutoSpeedupTempoIncreaseAmountOutput">5</span> bpm in
			<span id="metronomeAutoSpeedupTempoIncreaseIntervalOutput">2</span> min
		</div>
		<div id="metronomeAutoSpeedupConfigurationKeepIncreasing">
			<input type="checkbox" checked id="metronomeAutoSpeedUpKeepGoingForever"><label for="metronomeAutoSpeedUpKeepGoingForever">Keep increasing after the first interval</label>
		</div>
		<div id="metronomeAutoSpeedupConfigurationSliders">
			<div id="metronomeAutoSpeedupConfigurationAmountLable">Amount in BPM</div>
			<input type=range min=1 max=100 value=5 class="metronomeAutoSpeedUpRange" id="metronomeAutoSpeedupTempoIncreaseAmount" oninput="myGrooveWriter.updateRangeLabel(event, 'metronomeAutoSpeedupTempoIncreaseAmountOutput');">
			<div id="metronomeAutoSpeedupConfigurationIntervalLable">Interval in Minutes</div>
			<input type=range min=1 max=20 value=2 class="metronomeAutoSpeedUpRange" id="metronomeAutoSpeedupTempoIncreaseInterval" step="1" oninput="myGrooveWriter.updateRangeLabel(event, 'metronomeAutoSpeedupTempoIncreaseIntervalOutput');">
		</div>
		<div id="metronomeAutoSpeedupCloseButtonDiv">
			<button id="metronomeAutoSpeedupConfigurationCloseButton" onclick="myGrooveWriter.close_MetronomeAutoSpeedupConfiguration('ok');">Done</button>
		</div>
	</div>
`
}