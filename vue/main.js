import RightHandContent from './components/right_hand_content.js'
import MetronomeMenu from './components/metronome_menu.js'
import Sticking from './components/context_menus/sticking.js'
import HighHat from './components/context_menus/high_hat.js'
import Tom1 from './components/context_menus/tom1.js'
import Tom4 from './components/context_menus/tom4.js'
import Snare from './components/context_menus/snare.js'
import Kick from './components/context_menus/kick.js'
import StickingsLabel from './components/context_menus/sticking_label.js'
import HighHatLabel from './components/context_menus/highhat_label.js'

import Tom1Label from './components/context_menus/tom1_label.js'
import Tom4Label from './components/context_menus/tom4_label.js'
import SnareLabel from './components/context_menus/snare_label.js'
import KickLabel from './components/context_menus/kick_label.js'
import PermutationLabel from './components/context_menus/permutation_label.js'
import Help from './components/context_menus/help.js'
import Stickings from './components/context_menus/Stickings.js'
import Download from './components/context_menus/Download.js'
import TimeSignature from './components/context_menus/time_signature.js'

export default {
  data() {
    return {}
  },
  components: {
    RightHandContent, MetronomeMenu, Sticking, HighHat, Tom1, Tom4, Snare, Kick, StickingsLabel, HighHatLabel, Tom1Label, Tom4Label, SnareLabel, KickLabel, PermutationLabel, Help, Stickings, Download, TimeSignature
  },
  template: `
    <RightHandContent></RightHandContent>		
    <MetronomeMenu></MetronomeMenu>
	<Sticking></Sticking>
	<HighHat></HighHat>
	<Tom1></Tom1>
	<Tom4></Tom4>
	<Snare></Snare>
	<Kick></Kick>
	<StickingsLabel></StickingsLabel>
	<HighHatLabel></HighHatLabel>
	<Tom1Label></Tom1Label>
	<Tom4Label></Tom4Label>
	<SnareLabel></SnareLabel>
	<KickLabel></KickLabel>
	<PermutationLabel></PermutationLabel>
	<Help></Help>
	<Stickings></Stickings>
	<Download></Download>
	<div id="grooveListWrapper">
		<script>
			document.write(grooves.getGroovesAsHTML());
		</script>
	</div>
	<TimeSignature></TimeSignature>
	
	<!-- this is used by the share/save button, and is hidden by default -->
	<div id="fullURLPopup">
		<span id="fullURLPopupCloseButton" onclick="myGrooveWriter.close_FullURLPopup();"><i class="fa fa-lg fa-times-circle"></i></span>
		<div id="fullURLPopupTitle">Share Your Groove</div>
		<div id="fullURLPopupSubTitle">Use this URL to share or save this groove</div>
		<div id="fullURLPopupSubSubTitle">(You can also bookmark this page)</div>
		<div id="fullURLPopupCheckboxes">
			<span><label  id="shortURLLabel" class="fullURLPopupCheckboxLabel"><input type="checkbox" id="shortenerCheckbox" onchange="myGrooveWriter.shortenerCheckboxChanged();">Short URL</label></span>
			<span><label id="embedCodeLabel" class="fullURLPopupCheckboxLabel"><input type="checkbox" id="embedCodeCheckbox" onchange="myGrooveWriter.embedCodeCheckboxChanged();">Embed Code</label></span>
		</div>
		<div id="fullURLPopupTextFieldContainer"><input type="text" id="fullURLPopupTextField"></div>
		<br>
		<div id="shareButtonContainer">
			<button id="fullURLPopupCopyButton" onclick="myGrooveWriter.copyShareURLToClipboard();">&nbsp;<i class="fa fa-copy"></i> &nbsp;COPY&nbsp;</button>
			&nbsp; &nbsp; &nbsp;
			<share-button id="shareButton"></share-button>
		</div>
	</div>


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
