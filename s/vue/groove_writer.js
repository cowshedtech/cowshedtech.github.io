// Javascript for the Groove Scribe HTML application
// Groove Scribe is for drummers and helps create sheet music with an easy to use WYSIWYG groove editor.
//
// Author: Lou Montulli
// Original Creation date: Feb 2015.
//
//  Copyright 2015-2020 Lou Montulli, Mike Johnston
//
//  This file is part of Project Groove Scribe.
//
//  Groove Scribe is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 2 of the License, or
//  (at your option) any later version.
//
//  Groove Scribe is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with Groove Scribe.  If not, see <http://www.gnu.org/licenses/>.

/*jshint multistr: true */
/*jslint browser:true devel:true */

/*global GrooveUtils, Midi, Share */
/*global MIDI, constant_MAX_MEASURES, constant_DEFAULT_TEMPO, constant_ABC_STICK_R, constant_ABC_STICK_L, constant_ABC_STICK_BOTH, constant_ABC_STICK_OFF, constant_ABC_STICK_COUNT, constant_ABC_HH_Ride, constant_ABC_HH_Ride_Bell, constant_ABC_HH_Cow_Bell, constant_ABC_HH_Crash, constant_ABC_HH_Stacker, constant_ABC_HH_Open, constant_ABC_HH_Close, constant_ABC_HH_Accent, constant_ABC_HH_Normal, constant_ABC_SN_Ghost, constant_ABC_SN_Accent, constant_ABC_SN_Normal, constant_ABC_SN_XStick, constant_ABC_SN_Buzz, constant_ABC_SN_Flam, constant_ABC_SN_Drag, constant_ABC_KI_SandK, constant_ABC_KI_Splash, constant_ABC_KI_Normal, constant_ABC_T1_Normal, constant_ABC_T2_Normal, constant_ABC_T3_Normal, constant_ABC_T4_Normal, constant_NUMBER_OF_TOMS, constant_ABC_OFF, constant_OUR_MIDI_VELOCITY_NORMAL, constant_OUR_MIDI_VELOCITY_ACCENT, constant_OUR_MIDI_VELOCITY_GHOST, constant_OUR_MIDI_METRONOME_1, constant_OUR_MIDI_METRONOME_NORMAL, constant_OUR_MIDI_HIHAT_NORMAL, constant_OUR_MIDI_HIHAT_OPEN, constant_OUR_MIDI_HIHAT_ACCENT, constant_OUR_MIDI_HIHAT_CRASH, constant_OUR_MIDI_HIHAT_STACKER, constant_OUR_MIDI_HIHAT_RIDE, constant_OUR_MIDI_HIHAT_FOOT, constant_OUR_MIDI_SNARE_NORMAL, constant_OUR_MIDI_SNARE_ACCENT, constant_OUR_MIDI_SNARE_GHOST, constant_OUR_MIDI_SNARE_XSTICK, constant_OUR_MIDI_SNARE_XSTICK, constant_OUR_MIDI_SNARE_FLAM, onstant_OUR_MIDI_SNARE_DRAG, constant_OUR_MIDI_KICK_NORMAL, constant_OUR_MIDI_TOM1_NORMAL, constant_OUR_MIDI_TOM2_NORMAL, constant_OUR_MIDI_TOM4_NORMAL, constant_OUR_MIDI_TOM4_NORMAL */

// GrooveWriter class.   The only one in this file.


var midiPlayer;
var metronome;
var editor;
var editorClickable;
var options;
var abcToSVGCallback;
var sheetMusic;
	

function GrooveWriter() {
	"use strict";

	var root = this;
	editor = this;
	editorClickable = new EditorClickable();
	options = new Options();
	metronome = new Metronome();
	sheetMusic = new SheetMusic();
	root.track = new Track();
	midiPlayer = new MIDIPlayer(root.track.trackID);
	abcToSVGCallback = new SVGLibCallback(root.track);
	var changeCallbackTimeout = null;	

	// private vars in the scope of the class
	root.class_permutation_type = "none";
	
	// set debugMode immediately so we can use it in index.html
	options.debugMode = parseInt(getQueryVariableFromURL("Debug", "0"), 10);
	options.grooveDBAuthoring = parseInt(getQueryVariableFromURL("GDB_Author", "0"), 10);


	/*
	 * This function initializes the data for the groove Scribe web page
	 */	
	root.runsOnPageLoad = function () {

		root.track?.addChangeHandler(() => {
            console.log(`here`)
			updateCurrentURL(); 
        })
		
		metronome?.addChangeHandler(() => {
            if (midiPlayer) midiPlayer.noteHasChanged();
			updateCurrentURL();      
        })
	
 		// initialise our midi player
		midiPlayer.eventCallbacks = new midiEventCallbackClass();
		midiPlayer?.subscribe(EventTypes.PARAMETERS_UPDATE, () => {
			// if there is a timeout running clear it
			if (this.changeCallbackTimeout != null)
				window.clearTimeout(this.changeCallbackTimeout);

			// set a new timeout
			this.changeCallbackTimeout = window.setTimeout(function () {
				this.changeCallbackTimeout = null
				updateCurrentURL();
			}, 300);
		})

		midiPlayer?.subscribe(EventTypes.PLAY_STATE, () => {
			if (midiPlayer.getState() == PlayerState.STOPPED) {
				sheetMusic.stop();
				editorClickable.stop();
			}
		})

		midiPlayer?.subscribe(EventTypes.PLAY_PROGRESS, (data) => {			
			if (data?.percentComplete && options.isHighlightOn()) {
				sheetMusic.highlightNote(data.percentComplete)			
				editorClickable.hilight_note(null, data?.percentComplete, root.class_permutation_type, root.track.numBeats, root.track.noteValue, root.track.numberOfMeasures, root.track.notesPerMeasure, root.track.repeatedMeasures, usingTriplets());
			} 
		})

		midiPlayer.eventCallbacks.notePlaying = function (note_type, percent_complete) {
			if (note_type !== "complete") return
			if (!metronome.isAutoSpeedUpActive()) return
			// reload with new tempo
			midiPlayer.noteHasChanged();
			root.metronomeAutoSpeedUpTempoUpdate();			
		};

		midiPlayer.eventCallbacks.loadMidiDataEvent = function (playStarting) {
			var midiURL;

			if (playStarting && metronome.getCountInActive()) {

				midiURL = buildMIDICountInTrack(root.track.numBeats, root.track.noteValue, midiPlayer.getTempo());
				midiPlayer.noteHasChanged();
				metronome.setCountInIsPlaying(true);
			} else {
				if (metronome.countInIsPlaying) {
					// we saved the state above so that we could reset the Offset click start, otherwise it starts on the 'e'
					metronome.setCountInIsPlaying(false);
					metronome.resetOptionsOffsetClickStartRotation();
				}
				midiURL = createMidiUrlFromClickableUI("our_MIDI");
				midiPlayer.resetNoteHasChanged();
			}
			midiPlayer.loadFromURL(midiURL, midiPlayer.getTempo());
			updateGrooveDBSource();
		};

		options.addChangeHandler(() => {
			if (!options.isHighlightOn()) {
				sheetMusic.clearHighlight();
				editorClickable.clearHighlight();
			}
			// showHideToms(true, options.areTomsVisible(), true);
			updateCurrentURL();
		})
		
		// load the groove from the URL data if it was passed in.
		root.updateFromURL(window.location.search);
		root.updateSheetMusic();
		// editorClickable.update(editor.track);

		// TODO
		setupPermutationMenu();
		// setTimeSigLabel();

		// if Mode != "view" put into edit mode  (we default to view mode to prevent screen flicker)
		// if ("view" != getQueryVariableFromURL("Mode", "edit"))
		root.updateViewEdit(true);
		
		// set the background and text color of the current subdivision
		// selectButton(document.getElementById("subdivision_" + root.track.notesPerMeasure + "ths"));
		// buttonSelected

		midiPlayer.initialise();

		// enable or disable swing
		// midiPlayer.swingEnabled(midiPlayer.doesDivisionSupportSwing(root.track.notesPerMeasure));

		window.onresize = root.updateSheetMusic();

		root.browserInfo = getBrowserInfo();
		if (root.browserInfo.browser == "MSIE" && root.browserInfo.version < 10) {
			window.alert("This browser has been detected as: " + root.browserInfo.browser + " ver: " + root.browserInfo.version + ".\n" + 'This version of IE is unsupported.   Please use Chrome or Firefox instead');
		} else if (root.browserInfo.browser == "Safari" && root.browserInfo.platform == "windows" && root.browserInfo.version < 535) {
			window.alert("This browser has been detected as: " + root.browserInfo.browser + " ver: " + root.browserInfo.version + ".\n" + 'This version of Safari is unsupported.   Please use Chrome instead');
		}
		if (options.debugMode) {
			var debugOutput = document.getElementById("debugOutput");
			if (debugOutput) {
				debugOutput.innerHTML += "<div>This browser has been detected as: " + root.browserInfo.browser + " ver: " + root.browserInfo.version + ".<br>" + root.browserInfo.uastring + "<br>Running on: " + root.browserInfo.platform + "</div>";
			}
		}

		if (isTouchDevice()) {
			setTimeout(function () {
				window.scrollTo(0, 1);
			}, 1000);
		}

		// get updates when the tempo changes
		// root.track.tempoChangeCallback = root.tempoChangeCallback
	};

	// called right before the midi reloads for the next replay
	// set the new tempo based on the delta required for the time interval
	var class_our_midi_start_time = null;
	var class_our_midi_start_tempo = 0;
	var class_our_last_midi_tempo_increase_time = null;
	var class_our_last_midi_tempo_increase_remainder = 0;
	root.metronomeAutoSpeedUpTempoUpdate = function () {

		var totalTempoIncreaseAmount = 1;
		if (document.getElementById("metronomeAutoSpeedupTempoIncreaseAmount"))
			totalTempoIncreaseAmount = parseInt(document.getElementById("metronomeAutoSpeedupTempoIncreaseAmount").value, 10);
		var tempoIncreaseInterval = 60;
		if (document.getElementById("metronomeAutoSpeedupTempoIncreaseInterval")) {
			tempoIncreaseInterval = parseInt(document.getElementById("metronomeAutoSpeedupTempoIncreaseInterval").value, 10);
			tempoIncreaseInterval = tempoIncreaseInterval * 60; // turn mins to secs
		}

		var keepIncreasingForever = false;
		if (document.getElementById("metronomeAutoSpeedUpKeepGoingForever"))
			keepIncreasingForever = document.getElementById("metronomeAutoSpeedUpKeepGoingForever").checked;

		var curTempo = root.track.getTempo();

		var midiStartTime = midiPlayer.getStartTime();
		if (class_our_midi_start_time != midiStartTime) {
			class_our_midi_start_time = midiStartTime;
			class_our_last_midi_tempo_increase_remainder = 0;
			class_our_last_midi_tempo_increase_time = new Date(0);
			class_our_midi_start_tempo = curTempo;

		} else if (!keepIncreasingForever) {
			if (curTempo >= class_our_midi_start_tempo + totalTempoIncreaseAmount) {
				return; // don't increase any more after we have gone up the total amount
			}
		}
		var totalMidiPlayTime = midiPlayer.getPlayTimeThisPlay();
		var timeDiffMilliseconds = totalMidiPlayTime.getTime() - class_our_last_midi_tempo_increase_time.getTime();
		var tempoDiffFloat = (totalTempoIncreaseAmount) * (timeDiffMilliseconds / (tempoIncreaseInterval * 1000));

		// round the number down, but keep track of the remainder so we carry it forward.   Otherwise
		// rounding errors cause us to be way off.
		tempoDiffFloat += class_our_last_midi_tempo_increase_remainder;
		var tempoDiffInt = Math.floor(tempoDiffFloat);
		class_our_last_midi_tempo_increase_remainder = tempoDiffFloat - tempoDiffInt;

		class_our_last_midi_tempo_increase_time = totalMidiPlayTime;

		if (!keepIncreasingForever) {
			if (curTempo + tempoDiffInt > class_our_midi_start_tempo + totalTempoIncreaseAmount) {
				// increase to the total max amount, then we are done
				tempoDiffInt = (class_our_midi_start_tempo + totalTempoIncreaseAmount) - curTempo;
			}
		}

		if (tempoDiffInt > 0)
			root.track.setTempo(root.track.getTempo() + tempoDiffInt);
	};


	// this is called by a bunch of places anytime we modify the musical notes on the page
	// this will recreate the ABC code and will then use the ABC to rerender the sheet music
	// on the page.
	root.updateSheetMusic = function () {
		var renderWidth = 600;
		var svgTarget = document.getElementById("svgTarget");
		if (svgTarget) {
			renderWidth = svgTarget.offsetWidth - 100;
			renderWidth = Math.floor(renderWidth * 0.8);  // reduce width by 20% (This actually makes the notes bigger, because we scale up everything to max width)
		}

		var fullABC = generate_ABC(renderWidth);

		document.getElementById("ABCsource").value = fullABC;
		
		// TODO
		// updateGrooveDBSource();

		midiPlayer.noteHasChanged();
		editorClickable.update(editor.track);

		// update the current URL so that reloads and history traversal and link shares and bookmarks work correctly
		updateCurrentURL();

		sheetMusic.update(editor.track, fullABC);
	}
	
	root.updateViewEdit = function (dontUpdateURL) {
		var view_edit_button = document.getElementById("view-edit-switch");

		if (options.viewMode) {

			toggleDisplayByClass(".edit-block", true, false, "block"); // hide

			if (view_edit_button)
				view_edit_button.innerHTML = "Switch to EDIT mode";
			options.viewMode = true;
			if (!dontUpdateURL)
				updateCurrentURL();
			
		} else {
			toggleDisplayByClass(".edit-block", true, true, "block"); // show

			if (view_edit_button)
				view_edit_button.innerHTML = "Switch to VIEW mode";
			options.viewMode = false;

			if (!dontUpdateURL)
				updateCurrentURL();			
		}
	};


	// get a really long URL that encodes all of the notes and the rest of the state of the page.
	// this will allow us to bookmark or reference a groove and handle undo/redo.
	//
	root.get_FullURLForPage= function (url_destination) {
		var track = grooveDataFromClickableUI()
		return getUrlStringFromGrooveData(track, options, midiPlayer, metronome, url_destination)
	}
	

	root.updateRangeLabel = function (event, idToUpdate) {
		var element = document.getElementById(idToUpdate);

		if (element) {
			element.innerHTML = event.currentTarget.value;
		}
	};


	root.updateFromURL = function (encodedURLData) {

		var track = getGrooveDataFromUrlString(encodedURLData, root.track, options, midiPlayer, metronome, options.debugMode);
		editorClickable.update(editor.track);

		root.changeDivisionWithNotes(track.timeDivision);
		
		if (options.isStickingVisible())
			stickingsShowHide(true, true, true);
				
	}

	

	

	// change the base division to something else.
	// eg  16th to 8ths or   32nds to 8th note triplets
	// need to re-layout the html notes, change any globals and then reinitialize
	//
	// OMG this needs to be refactored really bad.   There is a GrooveData struct from groove utils that
	//      would make this whole thing much easier.  :(
	root.changeDivisionWithNotes = function(newDivision, Stickings, HH, Tom1, Tom4, Snare, Kick) {
		var oldDivision = root.track.timeDivision;
		var wasStickingsVisable = options.isStickingVisible();
		var wasTomsVisable = options.areTomsVisible();

		root.track.timeDivision = newDivision;
		root.track.notesPerMeasure = calc_notes_per_measure(root.track.timeDivision, root.track.numBeats, root.track.noteValue);

		editorClickable.update(editor.track);		

		var newHTML = "";
		// change the Permutation options too
		newHTML = HTMLforPermutationOptions(root.class_permutation_type, usingTriplets());
		document.getElementById("PermutationOptions").innerHTML = newHTML;

		if (wasStickingsVisable)
			stickingsShowHide(true, true, true);

		// if (wasTomsVisable)
		// 	showHideToms(true, true, true);

		// now set the right notes on and off
		if (Stickings && HH && Tom1 && Tom4 && Snare && Kick) {
			setNotesFromURLData("Stickings", Stickings, root.track.numberOfMeasures);
			setNotesFromURLData("H", HH, root.track.numberOfMeasures);
			setNotesFromURLData("T1", Tom1, root.track.numberOfMeasures);
			setNotesFromURLData("T4", Tom4, root.track.numberOfMeasures);
			setNotesFromURLData("S", Snare, root.track.numberOfMeasures);
			setNotesFromURLData("K", Kick, root.track.numberOfMeasures);
		}

		// un-highlight the old div
		// unselectButton(document.getElementById("subdivision_" + oldDivision + "ths"));

		// highlight the new div
		// selectButton(document.getElementById("subdivision_" + root.track.timeDivision + "ths"));

		// This may disable or enable the menu
		setupPermutationMenu();

		// may turn on or off triplets and 1/4 or 1/8th notes based on time signature
		setTimeDivisionSelectionOnOrOff();

		// change the time label
		// setTimeSigLabel();

		// enable or disable swing
		// midiPlayer.swingEnabled(midiPlayer.doesDivisionSupportSwing(newDivision));
	}

	root.expandAuthoringViewWhenNecessary = function (numNotesPerMeasure, numberOfMeasures) {

		// set the size of the musicalInput authoring element based on the number of notes
		if (numNotesPerMeasure > 16 ||
			(numNotesPerMeasure > 4 && root.track.numberOfMeasures > 1) ||
			(root.track.numberOfMeasures > 2)) {
			addOrRemoveKeywordFromClassById("musicalInput", "expanded", true);

		} else {
			addOrRemoveKeywordFromClassById("musicalInput", "expanded", false);

		}
	};

	// change the base division to something else.
	// eg  16th to 8ths or   32nds to 8th note triplets
	// need to re-layout the html notes, change any globals and then reinitialize
	var have_shown_mixed_division_message = false;
	root.changeDivision = function (newDivision) {
		var uiStickings = "|";
		var uiHH = "|";
		var uiTom1 = "|";
		var uiTom4 = "|";
		var uiSnare = "|";
		var uiKick = "|";

		if (newDivision == 48 && !have_shown_mixed_division_message) {
			have_shown_mixed_division_message = true;
			alert("The MIXED subdivision allows you to create a combination of triplets and non-triplet notes in one measure.  Set every 3rd note for 16ths and every 6th note for 8th notes")
		}

		var isNewDivisionTriplets = isTripletDivision(newDivision);
		var new_notes_per_measure = calc_notes_per_measure((isNewDivisionTriplets ? 48 : 32), root.track.numBeats, root.track.noteValue);

		// check for incompatible odd time signature division   9/8 and 1/4notes for instance or 9/16 and 1/8notes
		if ((newDivision * root.track.numBeats / root.track.noteValue) % 1 != 0) {
			alert("1/" + newDivision + " notes are disabled in " + root.track.numBeats + "/" + root.track.noteValue + " time.  This combination would result in a half note.");
			return;
		}
		if (isNewDivisionTriplets && root.track.noteValue != 4) {
			alert("Triplets are disabled in " + root.track.numBeats + "/" + root.track.noteValue + " time.  Use x/4 time for triplets.");
			return;
		}

		if (usingTriplets() === isNewDivisionTriplets) {
			// get the encoded notes out of the UI.
			// run through both measures.
			var topIndex = root.track.notesPerMeasure * root.track.numberOfMeasures;
			for (var i = 0; i < topIndex; i++) {
				uiStickings += get_sticking_state(i, "URL");
				uiHH += editor.track.getHighHatState(i, "URL")				
				uiTom1 += editor.track.getTomState(1, i,  "URL");
				uiTom4 += editor.track.getTomState(4, i, "URL");
				uiSnare += editor.track.getSnareState(i, "URL");
				uiKick += editor.track.getKickState(i, "URL")		
			}

			// override the hi-hat if we are going to a higher division.
			// otherwise the notes get lost in translation (not enough)
			//if (newDivision > root.track.notesPerMeasure)
			//	uiHH = root.track.GetDefaultHHGroove(new_notes_per_measure, root.track.numBeats, root.track.noteValue, root.track.numberOfMeasures);
		} else {
			// changing from or changing to a triplet division
			// triplets don't scale well, so use defaults when we change
			uiStickings = GetDefaultStickingsGroove(new_notes_per_measure, root.track.numBeats, root.track.noteValue, root.track.numberOfMeasures);
			uiHH = root.track.getDefaultHHGroove();
			uiTom1 = root.track.getEmptyGroove();
			uiTom4 = root.track.getEmptyGroove();
			uiSnare = root.track.getDefaultSnareGroove(new_notes_per_measure, root.track.numBeats, root.track.noteValue, root.track.numberOfMeasures);
			uiKick = root.track.getDefaultKickGroove();

			// reset the metronome click, since it has different options
			metronome.resetOptionsMenuOffsetClick();
		}

		root.expandAuthoringViewWhenNecessary(newDivision, root.track.numberOfMeasures);		

		root.changeDivisionWithNotes(newDivision, uiStickings, uiHH, uiTom1, uiTom4, uiSnare, uiKick);

		root.updateSheetMusic();
	};

} // end of class
