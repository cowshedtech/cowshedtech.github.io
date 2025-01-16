import RightHandContent from './components/right_hand_content.js'
import MetronomeMenu from './components/metronome_menu.js'


export default {
  data() {
    return {}
  },
  components: {
    RightHandContent, MetronomeMenu
  },
  template: `
    <RightHandContent></RightHandContent>		
    <MetronomeMenu></MetronomeMenu>
    <div class="noteContextMenu">
			<ul id="stickingContextMenu" class="list">
				<li onclick='myGrooveWriter.notePopupClick("sticking", "off");'>Off</li>
				<li onclick='myGrooveWriter.notePopupClick("sticking","right");'><b>R</b>ight</li>
				<li onclick='myGrooveWriter.notePopupClick("sticking","left");'><b>L</b>eft</li>
				<li onclick='myGrooveWriter.notePopupClick("sticking","both");'><b>R/L</b></li>
				<li onclick='myGrooveWriter.notePopupClick("sticking", "count");'>Count</li>
			</ul>
		</div>
		<div class="noteContextMenu">
			<ul id="hhContextMenu" class="list">
				<li onclick='myGrooveWriter.notePopupClick("hh", "off");'>Off</li>
				<li onclick='myGrooveWriter.notePopupClick("hh","normal");'>Hi-hat normal</li>
				<li onclick='myGrooveWriter.notePopupClick("hh","open");'>Hi-hat open</li>
				<!-- <li onclick='myGrooveWriter.notePopupClick("hh","close");'>Hi-hat closed</li> -->
				<li onclick='myGrooveWriter.notePopupClick("hh","accent");'>Hi-hat accent</li>
				<li onclick='myGrooveWriter.notePopupClick("hh","crash");'>Crash</li>
				<li onclick='myGrooveWriter.notePopupClick("hh","ride");'>Ride</li>
				<li onclick='myGrooveWriter.notePopupClick("hh","ride_bell");'>Ride Bell</li>
				<li onclick='myGrooveWriter.notePopupClick("hh","cow_bell");'>Cow Bell</li>
				<li onclick='myGrooveWriter.notePopupClick("hh","stacker");'>Stacker</li>
				<li onclick='myGrooveWriter.notePopupClick("hh","metronome_normal");'>Click</li>
				<li onclick='myGrooveWriter.notePopupClick("hh","metronome_accent");'>Click - accent</li>
			</ul>
		</div>
		<div class="noteContextMenu">
			<ul id="tom1ContextMenu" class="list">
				<li onclick='myGrooveWriter.notePopupClick("tom1", "off");'>Off</li>
				<li onclick='myGrooveWriter.notePopupClick("tom1", "normal");'>Tom Normal</li>
			</ul>
		</div>
		<div class="noteContextMenu">
			<ul id="tom4ContextMenu" class="list">
				<li onclick='myGrooveWriter.notePopupClick("tom4", "off");'>Off</li>
				<li onclick='myGrooveWriter.notePopupClick("tom4", "normal");'>Tom Normal</li>
			</ul>
		</div>
		<div class="noteContextMenu">
			<ul id="snareContextMenu" class="list">
				<li onclick='myGrooveWriter.notePopupClick("snare", "off");'>Off</li>
				<li onclick='myGrooveWriter.notePopupClick("snare", "normal");'>Snare Normal</li>
				<li onclick='myGrooveWriter.notePopupClick("snare", "accent");'>Snare Accent</li>
				<li onclick='myGrooveWriter.notePopupClick("snare", "ghost");'>Ghost Note</li>
				<li onclick='myGrooveWriter.notePopupClick("snare", "xstick");'>Cross Stick</li>
				<li onclick='myGrooveWriter.notePopupClick("snare", "buzz");'>Buzz Stroke</li>
				<li onclick='myGrooveWriter.notePopupClick("snare", "flam");'>Flam</li>
			</ul>
		</div>
		<div class="noteContextMenu">
			<ul id="kickContextMenu" class="list">
				<li onclick='myGrooveWriter.notePopupClick("kick", "off");'>Off</li>
				<li onclick='myGrooveWriter.notePopupClick("kick", "normal");'>Kick Normal</li>
				<li onclick='myGrooveWriter.notePopupClick("kick", "splash");'>Hi-hat foot</li>
				<li onclick='myGrooveWriter.notePopupClick("kick", "kick_and_splash");'>Kick &amp; Hi-hat foot</li>
			</ul>
		</div>
		<div class="noteContextMenu">
			<ul id="stickingsLabelContextMenu" class="list">
				<li onclick='myGrooveWriter.noteLabelPopupClick("stickings", "all_off");'>all <b>Off</b></li>
				<li onclick='myGrooveWriter.noteLabelPopupClick("stickings", "alternate");'>alternate <b>R</b>/<b>L</b></li>
				<li onclick='myGrooveWriter.noteLabelPopupClick("stickings", "all_right");'>all <b>R</b>s</li>
				<li onclick='myGrooveWriter.noteLabelPopupClick("stickings", "all_left");'>all <b>L</b>s</li>
				<li onclick='myGrooveWriter.noteLabelPopupClick("stickings", "all_count");'><b>C</b>ounts</li>
				<li onclick='myGrooveWriter.noteLabelPopupClick("stickings", "cancel");'>cancel</li>
			</ul>
		</div>
		<div class="noteContextMenu">
			<ul id="hhLabelContextMenu" class="list">
				<li onclick='myGrooveWriter.noteLabelPopupClick("hh", "all_off");'>all Hi-hats <b>Off</b></li>
				<li onclick='myGrooveWriter.noteLabelPopupClick("hh", "all_on");'>all Hi-hats <b>On</b></li>
				<li onclick='myGrooveWriter.noteLabelPopupClick("hh", "downbeats");'>downbeats</li>
				<li onclick='myGrooveWriter.noteLabelPopupClick("hh", "upbeats");'>upbeats</li>
				<li id='mute_hh_menu_item' onclick='myGrooveWriter.noteLabelPopupClick("hh", "mute");'>mute HH sound</li>
				<li onclick='myGrooveWriter.noteLabelPopupClick("hh", "cancel");'>cancel</li>
			</ul>
		</div>
		<div class="noteContextMenu">
			<ul id="tom1LabelContextMenu" class="list">
				<li onclick='myGrooveWriter.noteLabelPopupClick("tom1", "all_off");'>all Toms <b>Off</b></li>
				<li onclick='myGrooveWriter.noteLabelPopupClick("tom1", "all_on");'>all Toms <b>On</b></li>
				<li id='mute_tom1_menu_item' onclick='myGrooveWriter.noteLabelPopupClick("tom1", "mute");'>mute tom sound</li>
				<li onclick='myGrooveWriter.noteLabelPopupClick("tom1", "cancel");'>cancel</li>
			</ul>
		</div>
		<div class="noteContextMenu">
			<ul id="tom4LabelContextMenu" class="list">
				<li onclick='myGrooveWriter.noteLabelPopupClick("tom4", "all_off");'>all Toms <b>Off</b></li>
				<li onclick='myGrooveWriter.noteLabelPopupClick("tom4", "all_on");'>all Toms <b>On</b></li>
				<li id='mute_tom4_menu_item' onclick='myGrooveWriter.noteLabelPopupClick("tom4", "mute");'>mute tom sound</li>
				<li onclick='myGrooveWriter.noteLabelPopupClick("tom4", "cancel");'>cancel</li>
			</ul>
		</div>
		<div class="noteContextMenu">
			<ul id="snareLabelContextMenu" class="list">
				<li onclick='myGrooveWriter.noteLabelPopupClick("snare", "all_off");'>all Snares <b>Off</b></li>
				<li onclick='myGrooveWriter.noteLabelPopupClick("snare", "all_on");'>all <b>Accented</b></li>
				<li onclick='myGrooveWriter.noteLabelPopupClick("snare", "all_on_normal");'>all <b>Normal</b></li>
				<li onclick='myGrooveWriter.noteLabelPopupClick("snare", "all_on_ghost");'>all <b>Ghosts</b></li>
				<li id='mute_snare_menu_item' onclick='myGrooveWriter.noteLabelPopupClick("snare", "mute");'>mute snare sound</li>
				<li onclick='myGrooveWriter.noteLabelPopupClick("snare", "cancel");'>cancel</li>
			</ul>
		</div>
		<div class="noteContextMenu">
			<ul id="kickLabelContextMenu" class="list">
				<li onclick='myGrooveWriter.noteLabelPopupClick("kick", "all_off");'>all Kicks <b>Off</b></li>
				<li onclick='myGrooveWriter.noteLabelPopupClick("kick", "all_on");'>all Kicks <b>On</b></li>
				<li onclick='myGrooveWriter.noteLabelPopupClick("kick", "hh_foot_nums_on");'>HH foot #'s <b>On</b></li>
				<li onclick='myGrooveWriter.noteLabelPopupClick("kick", "hh_foot_ands_on");'>HH foot &'s <b>On</b></li>
				<li id='mute_kick_menu_item' onclick='myGrooveWriter.noteLabelPopupClick("kick", "mute");'>mute kick sound</li>
				<li onclick='myGrooveWriter.noteLabelPopupClick("kick", "cancel");'>cancel</li>
			</ul>
		</div>
		<div class="noteContextMenu">
			<ul id="permutationContextMenu" class="list">
				<li onclick='myGrooveWriter.permutationPopupClick("none");'><b>None</b></li>
				<li onclick='myGrooveWriter.permutationPopupClick("kick_16ths");'><b>Kick</b> Permutation</li>
				<li onclick='myGrooveWriter.permutationPopupClick("snare_16ths");'><b>Snare</b> Permutation</li>
			</ul>
		</div>
		<div class="noteContextMenu">
			<ul id="helpContextMenu" class="list">
				<li onclick='myGrooveWriter.helpMenuPopupClick("undo");'>Undo (Ctrl-Z)</li>
				<li onclick='myGrooveWriter.helpMenuPopupClick("redo");'>Redo (Ctrl-Y)</li>
				<li onclick='myGrooveWriter.helpMenuPopupClick("help");'>Help</li>
				<li onclick='myGrooveWriter.helpMenuPopupClick("about");'>About</li>
			</ul>
		</div>
		<div class="noteContextMenu">
			<ul id="stickingsContextMenu" class="list" style="width: 200px;">
				<li onclick='myGrooveWriter.stickingsShowHideToggle();'><b>Show or Hide stickings</b></li>
				<li onclick='myGrooveWriter.stickingsReverseRL();'><b>Reverse stickings R/L</b></li>
			</ul>
		</div>
		<div class="noteContextMenu">
			<ul id="downloadContextMenu" class="list" style="width: 200px;">
				<li onclick='myGrooveWriter.SVGSaveAs();'><b>Download SVG Images</b></li>
				<li onclick='myGrooveWriter.PNGSaveAs();'><b>Download PNG Images</b></li>
				<li onclick='myGrooveWriter.MIDISaveAs();'><b>Download MIDI file</b></li>
			</ul>
		</div>	
		<div id="grooveListWrapper">
			<script>
				document.write(grooves.getGroovesAsHTML());
			</script>
		</div>
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
