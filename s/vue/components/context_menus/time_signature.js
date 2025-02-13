export default {
  data() {
    return { }
  },
  props: { },
  template: `
	<!-- dialog for the TIME label, hidden by default -->
	<div id="timeSigPopup">
		<div id="timeSigPopupTitle">Choose a Time Signature</div>
		<div id="timeSigPopupOptions">
			<select id="timeSigPopupTimeSigTop">
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
		<select id="timeSigPopupTimeSigBottom">
			<option selected value="4">4</option>
			<option value="8">8</option>
			<option value="16">16</option>
		</select>
		</div>
		<div id="timeSigPopupButtons">
		<button id="timeSigPopupCancel" onclick="myGrooveWriter.timeSigPopupClose('cancel');">Cancel</button>
		<button id="timeSigPopupOK" onclick="myGrooveWriter.timeSigPopupClose('ok');">Done</button>
		</div>
	</div>
`
}