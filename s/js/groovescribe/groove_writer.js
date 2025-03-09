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

function GrooveWriter() {
	"use strict";

	var root = this;

	root.myGrooveUtils = new GrooveUtils();

	var class_undo_stack = [];
	var class_redo_stack = [];
	var constant_undo_stack_max_size = 40;

	// public class vars
	var class_number_of_measures = 1;
	var class_time_division = parseInt(getQueryVariableFromURL("Div", "16"), 10); // default to 16ths
	var class_num_beats_per_measure = 4;     // TimeSigTop
	var class_note_value_per_measure = 4;     // TimeSigBottom
	var class_notes_per_measure = calc_notes_per_measure(class_time_division, class_num_beats_per_measure, class_note_value_per_measure);
	var class_metronome_auto_speed_up_active = false;
	var class_metronome_count_in_active = false;
	var class_metronome_count_in_is_playing = false;
	var class_repeated_measures = new Map();
	var class_highlight_on = true;

	// set debugMode immediately so we can use it in index.html
	root.myGrooveUtils.debugMode = parseInt(getQueryVariableFromURL("Debug", "0"), 10);
	root.myGrooveUtils.grooveDBAuthoring = parseInt(getQueryVariableFromURL("GDB_Author", "0"), 10);

	// private vars in the scope of the class
	var class_app_title = "Groove Scribe";
	var class_permutation_type = "none";
	var class_advancedEditIsOn = false;
	var class_measure_for_note_label_click = 0;
	var class_which_index_last_clicked = 0; // which note was last clicked for the context menu	

	// functions below

	//
	//
	//
	root.numberOfMeasures = function () {
		return class_number_of_measures;
	};

	//
	//
	//
	root.notesPerMeasure = function () {
		return class_notes_per_measure;
	};

	//
	//
	// is the division a triplet groove?   12, 24, or 48 notes
	function usingTriplets() {
		if (isTripletDivision(class_time_division)) return true;
		return false;
	}

	// called every time the tempo changes, which can be a lot of times due to the range slider
	// update the main URL with the tempo, but only do it every third of a second at the most
	var global_tempoChangeCallbackTimeout = null;
	root.tempoChangeCallback = function (newTempo) {

		// if there is a timeout running clear it
		if (global_tempoChangeCallbackTimeout != null)
			window.clearTimeout(global_tempoChangeCallbackTimeout);

		// set a new timeout
		global_tempoChangeCallbackTimeout = window.setTimeout(function () {
			global_tempoChangeCallbackTimeout = null
			// update the Main URL to show the new tempo
			root.updateCurrentURL();
		}, 300);
	}


	root.setMetronomeButton = function (metronomeInterval) {

		var id = "";
		switch (metronomeInterval) {
			case 4:
				id = "metronome4ths";
				break;
			case 8:
				id = "metronome8ths";
				break;
			case 16:
				id = "metronome16ths";
				break;
			case 0:
			/* falls through */
			default:
				id = "metronomeOff";
				if (getMetronomeSolo()) {
					// turn off solo if we are turning off the metronome
					root.metronomeOptionsMenuPopupClick("Solo");
				}
				break;
		}

		// clear other buttons
		var myElements = document.querySelectorAll(".metronomeButton");
		for (var i = 0; i < myElements.length; i++) {
			var thisButton = myElements[i];
			// remove active status
			unselectButton(thisButton);
		}

		selectButton(document.getElementById(id));

		midiNoteHasChanged(root.myGrooveUtils); // pretty likely the case
	};

	root.class_metronome_frequency = 0;
	root.getMetronomeFrequency = function () {
		return root.class_metronome_frequency;
	};

	root.setMetronomeFrequency = function (newFrequency) {
		root.class_metronome_frequency = newFrequency;
		root.setMetronomeButton(newFrequency);

		// update the current URL so that reloads and history traversal and link shares and bookmarks work correctly
		root.updateCurrentURL();
	};

	// the user has clicked on the metronome options button
	root.metronomeOptionsAnchorClick = function (event) {

		var contextMenu = document.getElementById("metronomeOptionsContextMenu");
		if (contextMenu) {

			var anchorPoint = document.getElementById("metronomeOptionsAnchor");

			if (anchorPoint) {
				var anchorPos = getTagPosition(anchorPoint);
				contextMenu.style.top = anchorPos.y + anchorPoint.offsetHeight + "px";
				contextMenu.style.left = anchorPos.x + anchorPoint.offsetWidth - 150 + "px";
			}

			showContextMenu(contextMenu);
		}
	};

	// the user has clicked on the permutation menu
	root.permutationAnchorClick = function (event) {

		if (class_num_beats_per_measure != 4 || class_note_value_per_measure != 4)
			return;   // permutations disabled except in 4/4 time

		var contextMenu = document.getElementById("permutationContextMenu");
		if (contextMenu) {
			var anchorPoint = document.getElementById("permutationAnchor");

			if (anchorPoint) {
				var anchorPos = getTagPosition(anchorPoint);
				contextMenu.style.top = anchorPos.y + anchorPoint.offsetHeight + "px";
				contextMenu.style.left = anchorPos.x + anchorPoint.offsetWidth - 150 + "px";
			}
			showContextMenu(contextMenu);
		}
	};

	// the user has clicked on the options menu
	root.optionsAnchorClick = function (event) {

		var contextMenu = document.getElementById("optionsContextMenu");
		if (contextMenu) {
			var anchorPoint = document.getElementById("optionsAnchor");

			if (anchorPoint) {
				var anchorPos = getTagPosition(anchorPoint);
				contextMenu.style.top = anchorPos.y + anchorPoint.offsetHeight + "px";
				contextMenu.style.left = anchorPos.x + anchorPoint.offsetWidth - 150 + "px";
			}
			root.optionsMenuSetSelectedState()
			showContextMenu(contextMenu);
		}
	};

	// the user has clicked on the grooves menu
	root.groovesAnchorClick = function (event) {

		var contextMenu = document.getElementById("grooveListWrapper");
		if (contextMenu) {
			var anchorPoint = document.getElementById("groovesAnchor");

			if (anchorPoint) {
				var anchorPos = getTagPosition(anchorPoint);
				contextMenu.style.top = anchorPos.y + anchorPoint.offsetHeight + "px";
				contextMenu.style.left = anchorPos.x + anchorPoint.offsetWidth - 283 + "px";
			}
			showContextMenu(contextMenu);
		}
	};

	// the user has clicked on the help menu
	root.helpAnchorClick = function (event) {

		var contextMenu = document.getElementById("helpContextMenu");
		if (contextMenu) {
			var anchorPoint = document.getElementById("helpAnchor");

			if (anchorPoint) {
				var anchorPos = getTagPosition(anchorPoint);
				contextMenu.style.top = anchorPos.y + anchorPoint.offsetHeight + "px";
				contextMenu.style.left = anchorPos.x + anchorPoint.offsetWidth - 150 + "px";
			}
			showContextMenu(contextMenu);
		}
	};

	// the user has clicked on the stickings menu (at bottom)
	root.stickingsAnchorClick = function (event) {

		var contextMenu = document.getElementById("stickingsContextMenu");
		if (contextMenu) {
			var anchorPoint = document.getElementById("stickingsButton");

			if (anchorPoint) {
				if (!event)
					event = window.event;
				if (event.clientX || event.clientY) {
					contextMenu.style.top = event.clientY - 100 + "px";
					contextMenu.style.left = event.clientX - 150 + "px";
				}
			}
			showContextMenu(contextMenu);
		}
	};

	// the user has clicked on the download menu (at bottom)
	root.DownloadAnchorClick = function (event) {

		var contextMenu = document.getElementById("downloadContextMenu");
		if (contextMenu) {
			var anchorPoint = document.getElementById("downloadButton");

			if (anchorPoint) {
				if (!event)
					event = window.event;
				if (event.clientX || event.clientY) {
					contextMenu.style.top = event.clientY - 150 + "px";
					contextMenu.style.left = event.clientX - 150 + "px";
				}
			}
			showContextMenu(contextMenu);
		}
	};

	// figure out if the metronome options menu should be selected and change the UI
	root.metronomeOptionsMenuSetSelectedState = function () {

		if (getMetronomeSolo() ||
			class_metronome_auto_speed_up_active ||
			getMetronomeOffsetClickStart() != "1") {
			// make menu look active
			addOrRemoveKeywordFromClassById("metronomeOptionsAnchor", "selected", true)
		} else {
			// inactive
			addOrRemoveKeywordFromClassById("metronomeOptionsAnchor", "selected", false)
		}
	};

	root.optionsMenuSetSelectedState = function () {

		if (root.myGrooveUtils.highlightOn) {
			addOrRemoveKeywordFromClassById("optionsContextMenuHighlight", "menuChecked", true);			
		} else {
			addOrRemoveKeywordFromClassById("optionsContextMenuHighlight", "menuChecked", false);
		}
	};

	root.optionsHighlightPopupClick = function (option_type) {

		class_highlight_on = !class_highlight_on
		root.myGrooveUtils.highlightOn = class_highlight_on
		
		// Ensure current highlighting removed if highlighing now off
		if (!class_highlight_on) clear_all_highlights(null);
		if (!class_highlight_on) clearHighlightNoteInABCSVG(root.myGrooveUtils.grooveUtilsUniqueIndex);
		
		root.optionsMenuSetSelectedState();
		root.updateCurrentURL();
	};

	root.metronomeOptionsMenuPopupClick = function (option_type) {

		switch (option_type) {
			case "Solo":
				var current = getMetronomeSolo();
				if (!current) {
					setMetronomeSolo(true);
					addOrRemoveKeywordFromClassById("metronomeOptionsContextMenuSolo", "menuChecked", true);
					if (root.getMetronomeFrequency() === 0)
						root.setMetronomeFrequency(4);
				} else {
					setMetronomeSolo(false);
					addOrRemoveKeywordFromClassById("metronomeOptionsContextMenuSolo", "menuChecked", false);
				}
				midiNoteHasChanged(root.myGrooveUtils);
				break;

			case "SpeedUp":
				if (class_metronome_auto_speed_up_active) {
					// just turn it off if it is on, don't show the configurator
					class_metronome_auto_speed_up_active = false;
					addOrRemoveKeywordFromClassById("metronomeOptionsContextMenuSpeedUp", "menuChecked", false);
				} else {
					class_metronome_auto_speed_up_active = true;
					addOrRemoveKeywordFromClassById("metronomeOptionsContextMenuSpeedUp", "menuChecked", true);
					root.show_MetronomeAutoSpeedupConfiguration();
				}
				break;

			case "CountIn":
				if (class_metronome_count_in_active) {
					// just turn it off if it is on, don't show the configurator
					class_metronome_count_in_active = false;
					addOrRemoveKeywordFromClassById("metronomeOptionsContextMenuCountIn", "menuChecked", false);
				} else {
					class_metronome_count_in_active = true;
					addOrRemoveKeywordFromClassById("metronomeOptionsContextMenuCountIn", "menuChecked", true);
				}
				break;

			case "OffTheOne":
				// bring up the next menu to be clicked
				var contextMenu;

				if (usingTriplets())
					contextMenu = document.getElementById("metronomeOptionsOffsetClickForTripletsContextMenu");
				else
					contextMenu = document.getElementById("metronomeOptionsOffsetClickContextMenu");
				if (contextMenu) {
					var anchorPoint = document.getElementById("metronomeOptionsContextMenuOffTheOne");

					if (anchorPoint) {
						var anchorPos = getTagPosition(anchorPoint);
						contextMenu.style.top = anchorPos.y + anchorPoint.offsetHeight + "px";
						contextMenu.style.left = anchorPos.x + anchorPoint.offsetWidth - 150 + "px";
					}
					showContextMenu(contextMenu);
				}
				break;

			case "Dropper":

				break;

			default:
				console.log("bad case in metronomeOptionsMenuPopupClick()");
				break;
		}

		root.metronomeOptionsMenuSetSelectedState();
	};

	root.metronomeOptionsMenuOffsetClickPopupClick = function (option_type) {

		setMetronomeOffsetClickStart(option_type);

		// clear other and select
		var myElements = document.querySelectorAll(".metronomeOptionsOffsetClickContextMenuItem");
		for (var i = 0; i < myElements.length; i++) {
			var thisItem = myElements[i];
			// remove active status
			addOrRemoveKeywordFromClass(thisItem, "menuChecked", false);

		}

		// turn on the new one selected
		addOrRemoveKeywordFromClassById("metronomeOptionsOffsetClickContextMenuOnThe" + option_type, "menuChecked", true);


		if (option_type != "1") { // 1 is the default state
			// add a check to the menu
			addOrRemoveKeywordFromClassById("metronomeOptionsContextMenuOffTheOne", "menuChecked", true);
		} else {

			addOrRemoveKeywordFromClassById("metronomeOptionsContextMenuOffTheOne", "menuChecked", false);
		}

		midiNoteHasChanged(root.myGrooveUtils);
		root.metronomeOptionsMenuSetSelectedState();
	};

	root.resetMetronomeOptionsMenuOffsetClick = function () {
		// call with the default option
		root.metronomeOptionsMenuOffsetClickPopupClick("1");
	};

	function setupPermutationMenu() {

		if (class_num_beats_per_measure == 4 && class_note_value_per_measure == 4) {

			addOrRemoveKeywordFromClassById("permutationAnchor", "enabled", true);

		} else {
			// permutations disabled except in 4/4 time
			addOrRemoveKeywordFromClassById("permutationAnchor", "enabled", false);
			root.permutationPopupClick("none");  // make sure permutation is off
		}
	}

	root.permutationPopupClick = function (perm_type) {

		if (class_permutation_type == perm_type)
			return;

		class_permutation_type = perm_type;

		switch (perm_type) {
			case "kick_16ths":
				showHideCSS_ClassVisibility(".kick-container", true, false); // hide it
				showHideCSS_ClassVisibility(".snare-container", true, true); // show it
				while (class_number_of_measures > 1) {
					root.closeMeasureButtonClick(2);
				}
				selectButton(document.getElementById("permutationAnchor"));
				document.getElementById("PermutationOptions").innerHTML = HTMLforPermutationOptions(class_permutation_type, usingTriplets());
				document.getElementById("PermutationOptions").className += " displayed";
				break;

			case "snare_16ths":
				showHideCSS_ClassVisibility(".kick-container", true, true); // show it
				showHideCSS_ClassVisibility(".snare-container", true, false); // hide it
				while (class_number_of_measures > 1) {
					root.closeMeasureButtonClick(2);
				}
				selectButton(document.getElementById("permutationAnchor"));
				document.getElementById("PermutationOptions").innerHTML = HTMLforPermutationOptions(class_permutation_type, usingTriplets());
				document.getElementById("PermutationOptions").className += " displayed";
				break;

			case "none":
			/* falls through */
			default:
				showHideCSS_ClassVisibility(".kick-container", true, true); // show it
				showHideCSS_ClassVisibility(".snare-container", true, true); // show it
				class_permutation_type = "none";

				unselectButton(document.getElementById("permutationAnchor"));
				document.getElementById("PermutationOptions").innerHTML = HTMLforPermutationOptions(class_permutation_type, usingTriplets());
				addOrRemoveKeywordFromClassById("PermutationOptions", "displayed", false);
				break;
		}

		updateSheetMusic();
	};

	root.muteInstrument = function (instrument, measure, muteElseUnmute) {
		// find unmuteHHButton1  or unmuteSnareButton2
		var buttonName = "unmute" + instrument + "Button" + measure
		var button = document.getElementById(buttonName);
		if (muteElseUnmute)
			button.style.display = "inline-block";
		else
			button.style.display = "none";

			midiNoteHasChanged(root.myGrooveUtils);
	}



	root.helpMenuPopupClick = function (help_type) {
		var win;

		switch (help_type) {
			case "help":
				win = window.open("./content/gscribe_help.html", '_blank');
				win.focus();
				break;

			case "about":
				win = window.open("./content/gscribe_about.html", '_blank');
				win.focus();
				break;

			case "undo":
				root.undoCommand();
				break;

			case "redo":
				root.redoCommand();
				break;

			default:
				console.log("bad case in helpMenuPopupClick()");
				break;
		}

	};

	// user has clicked on the advanced edit button
	this.toggleAdvancedEdit = function () {
		if (class_advancedEditIsOn) {
			// turn it off
			class_advancedEditIsOn = false;
			unselectButton(document.getElementById("advancedEditAnchor"));
		} else {
			class_advancedEditIsOn = true;
			selectButton(document.getElementById("advancedEditAnchor"));
		}
	};

	// context menu for labels
	root.noteLabelClick = function (event, instrument, measure) {
		var contextMenu = false;

		// store this in a global, there can only ever be one context menu open at a time.
		// Yes, I agree this sucks
		class_measure_for_note_label_click = measure;

		switch (instrument) {
			case "stickings":
				contextMenu = document.getElementById("stickingsLabelContextMenu");
				break;
			case "hh":
				contextMenu = document.getElementById("hhLabelContextMenu");
				break;
			case "tom1":
				contextMenu = document.getElementById("tom1LabelContextMenu");
				break;
			case "tom4":
				contextMenu = document.getElementById("tom4LabelContextMenu");
				break;
			case "snare":
				contextMenu = document.getElementById("snareLabelContextMenu");
				break;
			case "kick":
				contextMenu = document.getElementById("kickLabelContextMenu");
				break;
			default:
				console.log("bad case in noteLabelClick: " + instrument);
				break;
		}

		if (contextMenu) {
			if (!event)
				event = window.event;
			if (event.clientX || event.clientY) {
				contextMenu.style.top = event.clientY - 30 + "px";
				contextMenu.style.left = event.clientX - 35 + "px";
			}
			showContextMenu(contextMenu);
		}

		return false;
	};

	root.noteLabelPopupClick = function (instrument, action) {
		var setFunction = false;
		var contextMenu = false;

		switch (instrument) {
			case "stickings":
				setFunction = set_sticking_state;
				break;
			case "hh":
				setFunction = set_hh_state;
				break;
			case "tom1":
				setFunction = set_tom1_state;
				break;
			case "tom4":
				setFunction = set_tom4_state;
				break;
			case "snare":
				setFunction = set_snare_state;
				break;
			case "kick":
				setFunction = set_kick_state;
				break;
			default:
				console.log("bad case in noteLabelPopupClick");
				return false;
		}

		if (action == "mute") {
			root.muteInstrument(instrument, class_measure_for_note_label_click, true);
			return false;
		}

		// start at the first note of the measure we want to effect.   Only fill in the
		// notes for that measure
		// the last boolean in the setFunction should only be true on the first call (plays a sound)
		var startIndex = class_notes_per_measure * (class_measure_for_note_label_click - 1);
		for (var i = startIndex; i - startIndex < class_notes_per_measure; i++) {
			if (action == "all_off") {
				setFunction(i, "off", i == startIndex);

			} else if (instrument == "stickings") {
				switch (action) {
					case "all_right":
						set_sticking_state(i, "right", i == startIndex, class_notes_per_measure, class_time_division, class_note_value_per_measure);
						break;
					case "all_left":
						set_sticking_state(i, "left", i == startIndex, class_notes_per_measure, class_time_division, class_note_value_per_measure);
						break;
					case "alternate":
						set_sticking_state(i, (i % 2 === 0 ? "right" : "left"), i == startIndex, class_notes_per_measure, class_time_division, class_note_value_per_measure);
						break;
					case "all_count":
						set_sticking_state(i, "count", i == startIndex, class_notes_per_measure, class_time_division, class_note_value_per_measure);
						break;
					default:
						console.log("Bad sticking case in noteLabelPopupClick");
						break;
				}
			} else if (instrument == "hh" && action == "downbeats") {
				set_hh_state(i, (i % 2 === 0 ? "normal" : "off"), i == startIndex);

			} else if (instrument == "hh" && action == "upbeats") {
				set_hh_state(i, (i % 2 === 0 ? "off" : "normal"), i == (startIndex + 1));

			} else if (instrument == "snare" && action == "all_on") {
				set_snare_state(i, "accent", i == startIndex);

			} else if (instrument == "snare" && action == "all_on_normal") {
				set_snare_state(i, "normal", i == startIndex);

			} else if (instrument == "snare" && action == "all_on_ghost") {
				set_snare_state(i, "ghost", i == startIndex);

			} else if (instrument == "kick" && action == "hh_foot_nums_on") {
				var num_notes_per_count = class_time_division / class_note_value_per_measure
				var cur_state = get_kick_state(i, "ABC");
				var kick_is_on = false;
				if (cur_state == constant_ABC_KI_SandK || cur_state == constant_ABC_KI_Normal)
					kick_is_on = true;
				set_kick_state(i, (i % num_notes_per_count === 0 ? (kick_is_on ? "kick_and_splash" : "splash") : (kick_is_on ? "normal" : "off")), i == (startIndex));

			} else if (instrument == "kick" && action == "hh_foot_ands_on") {
				var num_notes_per_count = class_time_division / class_note_value_per_measure
				var cur_state = get_kick_state(i, "ABC");
				var kick_is_on = false;
				if (cur_state == constant_ABC_KI_SandK || cur_state == constant_ABC_KI_Normal)
					kick_is_on = true;

				set_kick_state(i, (i % num_notes_per_count === (num_notes_per_count / 2) ? (kick_is_on ? "kick_and_splash" : "splash") : (kick_is_on ? "normal" : "off")), i == (startIndex + num_notes_per_count / 2));

			} else if (action == "all_on") {
				setFunction(i, "normal", i == startIndex);

			} else if (action == "cancel") {
				continue; // do nothing.

			} else {
				console.log("Bad IF case in noteLabelPopupClick");

			}
		}

		class_measure_for_note_label_click = 0; // reset

		updateSheetMusic();

		return false;
	};

	// returns true on error!
	// returns false if working.  (this is because of the onContextMenu handler
	root.noteRightClick = function (event, type, id) {
		class_which_index_last_clicked = id;
		var contextMenu;

		switch (type) {
			case "sticking":
				contextMenu = document.getElementById("stickingContextMenu");
				break;
			case "hh":
				contextMenu = document.getElementById("hhContextMenu");
				break;
			case "tom1":
				contextMenu = document.getElementById("tom1ContextMenu");
				break;
			case "tom4":
				contextMenu = document.getElementById("tom4ContextMenu");
				break;
			case "snare":
				contextMenu = document.getElementById("snareContextMenu");
				break;
			case "kick":
				contextMenu = document.getElementById("kickContextMenu");
				break;
			default:
				console.log("Bad case in handleNotePopup");
				break;
		}

		if (contextMenu) {
			if (!event)
				event = window.event;
			if (event.clientX || event.clientY) {
				contextMenu.style.top = event.clientY - 30 + "px";
				contextMenu.style.left = event.clientX - 75 + "px";
			}
			showContextMenu(contextMenu);
		} else {
			return true; //error
		}

		return false;
	};

	root.noteLeftClick = function (event, type, id) {

		// use a popup if advanced edit is on
		if (class_advancedEditIsOn === true) {
			root.noteRightClick(event, type, id);

		} else {

			// this is a non advanced edit left click
			switch (type) {
				case "hh":
					set_hh_state(id, is_hh_on(id) ? "off" : "normal", true);
					break;
				case "snare":
					set_snare_state(id, is_snare_on(id) ? "off" : "accent", true);
					break;
				case "tom1":
					set_tom_state(id, 1, is_tom_on(id, 1) ? "off" : "normal", true);
					break;
				case "tom4":
					set_tom_state(id, 4, is_tom_on(id, 4) ? "off" : "normal", true);
					break;
				case "kick":
					set_kick_state(id, is_kick_on(id) ? "off" : "normal", true);
					break;
				case "sticking":
					sticking_rotate_state(id, class_notes_per_measure, class_time_division, class_note_value_per_measure);
					break;
				default:
					console.log("Bad case in noteLeftClick: " + type);
					break;
			}

			updateSheetMusic();
		}

	};

	root.notePopupClick = function (type, new_setting) {
		var id = class_which_index_last_clicked;

		switch (type) {
			case "sticking":
				set_sticking_state(id, new_setting, true, class_notes_per_measure, class_time_division, class_note_value_per_measure);
				break;
			case "hh":
				set_hh_state(id, new_setting, true);
				break;
			case "tom1":
				set_tom1_state(id, new_setting, true);
				break;
			case "tom4":
				set_tom4_state(id, new_setting, true);
				break;
			case "snare":
				set_snare_state(id, new_setting, true);
				break;
			case "kick":
				set_kick_state(id, new_setting, true);
				break;
			default:
				console.log("Bad case in contextMenuClick");
				break;
		}

		updateSheetMusic();
	};

	// called when we initially mouseOver a note.
	// We can use it to sense left or right mouse or ctrl events
	root.noteOnMouseEnter = function (event, instrument, id) {

		var action = false;

		if (event.ctrlKey)
			action = "on";
		if (event.altKey)
			action = "off";

		if (action) {
			switch (instrument) {
				case "hh":
					set_hh_state(id, action == "off" ? "off" : "normal", true);
					break;
				case "snare":
					set_snare_state(id, action == "off" ? "off" : "accent", true);
					break;
				case "kick":
					set_kick_state(id, action == "off" ? "off" : "normal", true);
					break;
				default:
					console.log("Bad case in noteOnMouseEnter");
					break;
			}
			updateSheetMusic(); // update music
		}

		return false;
	};

	function is_hh_or_snare_on(id) {
		if (is_hh_on(id))
			return true;
		if (is_snare_on(id))
			return true;

		return false;
	}

	
	function fill_array_with_value_false(array_of_notes, number_of_notes) {
		for (var i = 0; i < number_of_notes; i++) {
			array_of_notes[i] = false;
		}
	}

	// create a new instance of an array with all the values prefilled with false
	function get_empty_note_array(number_of_notes) {

		var newArray = [number_of_notes];
		fill_array_with_value_false(newArray, number_of_notes);
		return newArray;
	}

	// create a new instance of an array with all the values prefilled with false
	// the array size is 32nd notes for the current time signature
	// 4/4 would be 32 notes
	// 5/4 would be 40 notes
	// 2/4 would be 16 notes
	// 4/2 would be 32 notes
	function get_empty_note_array_in_32nds() {
		var notes_per_4_beats = 32;
		if (usingTriplets())
			notes_per_4_beats = 48;
		var num_notes = (class_num_beats_per_measure * notes_per_4_beats) / class_note_value_per_measure;

		return get_empty_note_array(num_notes);
	}


	function get_kick16th_permutation_array(section) {
		console.log("get_kick16th_permutation_array");
		console.log("class_notes_per_measure: " + class_notes_per_measure);
		if (usingTriplets()) {
			return get_kick16th_triplets_permutation_array(section);
		}

		return get_kick16th_strait_permutation_array(section);
	}

	function get_kick16th_permutation_array_minus_some(section) {
		console.log("get_kick16th_permutation_array_minus_some");
		if (usingTriplets()) {
			// triplets never skip any: delegate
			return get_kick16th_permutation_array(section);
		}

		return get_kick16th_minus_some_strait_permutation_array(section);
	}

	// snare permutation
	function get_snare_permutation_array(section) {

		// its the same as the 16th kick permutation, but with different notes
		var snare_array = get_kick16th_permutation_array(section);

		// turn the kicks into snares
		for (var i = 0; i < snare_array.length; i++) {
			if (snare_array[i] !== false)
				snare_array[i] = constant_ABC_SN_Normal;
		}

		return snare_array;
	}

	// Snare permutation, with Accented permutation.   Snare hits every 16th note, accent moves
	function get_snare_accent_permutation_array(section) {

		// its the same as the 16th kick permutation, but with different notes
		var snare_array = get_kick16th_permutation_array(section);

		if (section > 0) { // Don't convert notes for the first measure since it is the ostinato
			for (var i = 0; i < snare_array.length; i++) {
				if (snare_array[i] !== false)
					snare_array[i] = constant_ABC_SN_Accent;
				else if ((i % 2) === 0) // all other even notes are ghosted snares
					snare_array[i] = constant_ABC_SN_Ghost;
			}
		}

		return snare_array;
	}

	// Snare permutation, with Accented and diddled permutation.   Accented notes are singles, non accents are diddled
	function get_snare_accent_with_diddle_permutation_array(section) {

		// its the same as the 16th kick permutation, but with different notes
		var snare_array = get_kick16th_permutation_array(section);

		if (section > 0) { // Don't convert notes for the first measure since it is the ostinato
			for (var i = 0; i < snare_array.length; i++) {
				if (snare_array[i] !== false) {
					snare_array[i] = constant_ABC_SN_Buzz;
					i++; // the next one is not diddled  (leave it false)
				} else { // all other even notes are diddled, which means 32nd notes
					snare_array[i] = constant_ABC_SN_Ghost;
				}
			}
		}

		return snare_array;
	}

	function get_numSectionsFor_permutation_array() {
		var numSections = 16;

		/*)
		if(usingTriplets()) {
		numSections = 8;
		} else {
		numSections = 16;
		}
		 */

		return numSections;
	}

	function get_kick_on_1_and_3_array(section) {

		var kick_array;

		if (usingTriplets())
			kick_array = ["F", false, false, false, false, false,
				"F", false, false, false, false, false,
				"F", false, false, false, false, false,
				"F", false, false, false, false, false];
		else
			kick_array = ["F", false, false, false, false, false, false, false,
				"F", false, false, false, false, false, false, false,
				"F", false, false, false, false, false, false, false,
				"F", false, false, false, false, false, false, false];

		return kick_array;
	}

	function get_samba_kick_array(section) {

		var kick_array = ["F", false, false, false, "^D", false, "F", false,
			"F", false, false, false, "^D", false, "F", false,
			"F", false, false, false, "^D", false, "F", false,
			"F", false, false, false, "^D", false, "F", false];
		return kick_array;
	}

	function get_tumbao_kick_array(section) {

		var kick_array = ["^D", false, false, false, false, false, "F", false,
			"^D", false, false, false, "F", false, false, false,
			"^D", false, false, false, false, false, "F", false,
			"^D", false, false, false, "F", false, false, false];
		return kick_array;
	}

	function get_baiao_kick_array(section) {

		var kick_array = ["F", false, false, false, "^D", false, "F", false,
			false, false, false, false, "[F^D]", false, false, false,
			"F", false, false, false, "^D", false, "F", false,
			false, false, false, false, "[F^D]", false, false, false];
		return kick_array;
	}

	// use the Permutation options to figure out if we should display a particular section
	function shouldDisplayPermutationForSection(sectionNum) {
		var ret_val = false;

		switch (sectionNum) {
			case 0:
				if (document.getElementById("PermuationOptionsOstinato").checked &&
					(!document.getElementById("PermuationOptionsOstinato_sub1") ||
						document.getElementById("PermuationOptionsOstinato_sub1").checked))
					ret_val = true;
				break;
			case 1:
				if (document.getElementById("PermuationOptionsSingles").checked &&
					document.getElementById("PermuationOptionsSingles_sub1").checked)
					ret_val = true;
				break;
			case 2:
				if (document.getElementById("PermuationOptionsSingles").checked &&
					document.getElementById("PermuationOptionsSingles_sub2").checked)
					ret_val = true;
				break;
			case 3:
				if (document.getElementById("PermuationOptionsSingles").checked &&
					document.getElementById("PermuationOptionsSingles_sub3").checked)
					ret_val = true;
				break;
			case 4:
				if (!usingTriplets() &&
					document.getElementById("PermuationOptionsSingles").checked &&
					document.getElementById("PermuationOptionsSingles_sub4").checked)
					ret_val = true;
				break;
			case 5:
				if (document.getElementById("PermuationOptionsDoubles").checked &&
					document.getElementById("PermuationOptionsDoubles_sub1").checked)
					ret_val = true;
				break;
			case 6:
				if (document.getElementById("PermuationOptionsDoubles").checked &&
					document.getElementById("PermuationOptionsDoubles_sub2").checked)
					ret_val = true;
				break;
			case 7:
				if (document.getElementById("PermuationOptionsDoubles").checked &&
					document.getElementById("PermuationOptionsDoubles_sub3").checked)
					ret_val = true;
				break;
			case 8:
				if (!usingTriplets() &&
					document.getElementById("PermuationOptionsDoubles").checked &&
					document.getElementById("PermuationOptionsDoubles_sub4").checked)
					ret_val = true;
				break;
			case 9:
				if (!usingTriplets() &&
					document.getElementById("PermuationOptionsUpsDowns").checked &&
					document.getElementById("PermuationOptionsUpsDowns_sub1").checked)
					ret_val = true;
				break;
			case 10:
				if (!usingTriplets() &&
					document.getElementById("PermuationOptionsUpsDowns").checked &&
					document.getElementById("PermuationOptionsUpsDowns_sub2").checked)
					ret_val = true;
				break;
			case 11:
				if (document.getElementById("PermuationOptionsTriples").checked &&
					(!document.getElementById("PermuationSubOptionsTriples1") ||
						document.getElementById("PermuationOptionsTriples_sub1").checked))
					ret_val = true;
				break;
			case 12:
				if (!usingTriplets() &&
					document.getElementById("PermuationOptionsTriples").checked &&
					document.getElementById("PermuationOptionsTriples_sub2").checked)
					ret_val = true;
				break;
			case 13:
				if (!usingTriplets() &&
					document.getElementById("PermuationOptionsTriples").checked &&
					document.getElementById("PermuationOptionsTriples_sub3").checked)
					ret_val = true;
				break;
			case 14:
				if (!usingTriplets() &&
					document.getElementById("PermuationOptionsTriples").checked &&
					document.getElementById("PermuationOptionsTriples_sub4").checked)
					ret_val = true;
				break;
			case 15:
				if (!usingTriplets() &&
					document.getElementById("PermuationOptionsQuads").checked &&
					(!document.getElementById("PermuationOptionsQuads_sub1") ||
						document.getElementById("PermuationOptionsQuads_sub1").checked))
					ret_val = true;
				break;
			default:
				console.log("bad case in groove_writer.js:shouldDisplayPermutationForSection()");
				return false;
			//break;
		}

		return ret_val;
	}

	// use the permutation options to count the number of active permutation sections
	function get_numberOfActivePermutationSections() {
		var max_num = get_numSectionsFor_permutation_array();
		var total_on = 0;

		for (var i = 0; i < max_num; i++) {
			if (shouldDisplayPermutationForSection(i))
				total_on++;
		}

		return total_on;
	}

	// query the clickable UI and generate a 32 element array representing the notes of one measure
	// note: the ui may have fewer notes, but we scale them to fit into the 32 elements proportionally
	// If using triplets returns 48 notes.   Otherwise always 32.
	//
	// (note: Only one measure, not all the notes on the page if multiple measures are present)
	// Return value is the number of notes.
	function get32NoteArrayFromClickableUI(Sticking_Array, HH_Array, Snare_Array, Kick_Array, Toms_Array, startIndexForClickableUI) {

		var scaler = getNoteScaler(class_notes_per_measure, class_num_beats_per_measure, class_note_value_per_measure); // fill proportionally

		// fill in the arrays from the clickable UI
		for (var i = 0; i < class_notes_per_measure; i++) {
			var array_index = (i) * scaler;

			// only grab the stickings if they are visible
			if (isStickingsVisible())
				Sticking_Array[array_index] = get_sticking_state(i + startIndexForClickableUI, "ABC");

			HH_Array[array_index] = get_hh_state(i + startIndexForClickableUI, "ABC");

			if (isTomsVisible()) {
				Toms_Array[0][array_index] = get_tom_state(i + startIndexForClickableUI, 1, "ABC");
				Toms_Array[3][array_index] = get_tom_state(i + startIndexForClickableUI, 4, "ABC");
			}

			Snare_Array[array_index] = get_snare_state(i + startIndexForClickableUI, "ABC");

			Kick_Array[array_index] = get_kick_state(i + startIndexForClickableUI, "ABC");
		}

		var num_notes = Snare_Array.length;
		return num_notes;
	}

	// each of the instruments can be muted.   Check the UI and zero out the array if the instrument is marked as muted
	// for a particular measure
	function muteArrayFromClickableUI(Sticking_Array, HH_Array, Snare_Array, Kick_Array, Toms_Array, measureIndex) {
		if (isInstrumentMuted("hh", measureIndex + 1))
			fill_array_with_value_false(HH_Array, HH_Array.length);
		if (isInstrumentMuted("snare", measureIndex + 1))
			fill_array_with_value_false(Snare_Array, Snare_Array.length);
		if (isInstrumentMuted("kick", measureIndex + 1))
			fill_array_with_value_false(Kick_Array, Kick_Array.length);

		for (var i = 0; i < Toms_Array.length; i++) {
			if (isInstrumentMuted("tom" + (i + 1), measureIndex + 1))
				fill_array_with_value_false(Toms_Array[i], Toms_Array[i].length);
		}
	}

	function filter_kick_array_for_permutation(old_kick_array) {
		var new_kick_array = [];

		for (var i in old_kick_array) {
			if (old_kick_array[i] == constant_ABC_KI_Splash ||
				old_kick_array[i] == constant_ABC_KI_SandK)
				new_kick_array.push(constant_ABC_KI_Splash);
			else
				new_kick_array.push(false);
		}

		return new_kick_array;
	}

	

	function createMidiUrlFromClickableUI(MIDI_type) {
		var Sticking_Array = get_empty_note_array_in_32nds();
		var HH_Array = get_empty_note_array_in_32nds();
		var Snare_Array = get_empty_note_array_in_32nds();
		var Kick_Array = get_empty_note_array_in_32nds();
		var Toms_Array = [get_empty_note_array_in_32nds(), get_empty_note_array_in_32nds(), get_empty_note_array_in_32nds(), get_empty_note_array_in_32nds()];

		var i,
			new_snare_array,
			num_notes_for_swing = 16;

		var metronomeFrequency = root.getMetronomeFrequency();

		// just the first measure
		var num_notes = get32NoteArrayFromClickableUI(Sticking_Array, HH_Array, Snare_Array, Kick_Array, Toms_Array, 0);
		muteArrayFromClickableUI(Sticking_Array, HH_Array, Snare_Array, Kick_Array, Toms_Array, 0);

		var midiFile = new Midi.File();
		var midiTrack = new Midi.Track();
		midiFile.addTrack(midiTrack);

		midiTrack.setTempo(root.myGrooveUtils.getTempo());
		midiTrack.setInstrument(0, 0x13);

		var swing_percentage = root.myGrooveUtils.getSwing() / 100;

		// all of the permutations use just the first measure
		switch (class_permutation_type) {
			case "kick_16ths":
				var numSections = get_numSectionsFor_permutation_array();

				// compute sections with different kick patterns
				for (i = 0; i < numSections; i++) {

					if (shouldDisplayPermutationForSection(i)) {
						var new_kick_array;

						if (document.getElementById("PermuationOptionsSkipSomeFirstNotes") && document.getElementById("PermuationOptionsSkipSomeFirstNotes").checked)
							new_kick_array = get_kick16th_permutation_array_minus_some(i);
						else
							new_kick_array = get_kick16th_permutation_array(i);

						// grab hi-hat foots from existing kick array and merge it in.
						Kick_Array = filter_kick_array_for_permutation(Kick_Array);
						new_kick_array = merge_kick_arrays(new_kick_array, Kick_Array);

						MIDI_from_HH_Snare_Kick_Arrays(midiTrack, HH_Array, Snare_Array, new_kick_array, Toms_Array, MIDI_type, metronomeFrequency, num_notes, num_notes_for_swing, swing_percentage, class_num_beats_per_measure, class_note_value_per_measure, getMetronomeSolo());
					}
				}
				break;

			case "snare_16ths": // use the hh & snare from the user
				numSections = get_numSectionsFor_permutation_array();

				//compute sections with different snare patterns
				for (i = 0; i < numSections; i++) {
					if (shouldDisplayPermutationForSection(i)) {

						if (document.getElementById("PermuationOptionsAccentGridDiddled") && document.getElementById("PermuationOptionsAccentGridDiddled").checked)
							new_snare_array = get_snare_accent_with_diddle_permutation_array(i);
						else if (document.getElementById("PermuationOptionsAccentGrid") && document.getElementById("PermuationOptionsAccentGrid").checked)
							new_snare_array = get_snare_accent_permutation_array(i);
						else
							new_snare_array = get_snare_permutation_array(i);


						MIDI_from_HH_Snare_Kick_Arrays(midiTrack, HH_Array, new_snare_array, Kick_Array, Toms_Array, MIDI_type, metronomeFrequency, num_notes, num_notes_for_swing, swing_percentage, class_num_beats_per_measure, class_note_value_per_measure, getMetronomeSolo());
					}
				}
				break;

			case "none":
			/* falls through */
			default:
				if (class_time_division < 16)
					num_notes_for_swing = 8 * class_num_beats_per_measure / class_note_value_per_measure;
				else
					num_notes_for_swing = 16 * class_num_beats_per_measure / class_note_value_per_measure;

				let repeat = class_repeated_measures.has(0) ? class_repeated_measures.get(0) : 1;
				for (let i = 0; i < repeat; i++) {
					MIDI_from_HH_Snare_Kick_Arrays(midiTrack, HH_Array, Snare_Array, Kick_Array, Toms_Array, MIDI_type, metronomeFrequency, num_notes, num_notes_for_swing, swing_percentage, class_num_beats_per_measure, class_note_value_per_measure, getMetronomeSolo());
				}

				for (i = 1; i < class_number_of_measures; i++) {

					// reset arrays
					Sticking_Array = get_empty_note_array_in_32nds();
					HH_Array = get_empty_note_array_in_32nds();
					Snare_Array = get_empty_note_array_in_32nds();
					Kick_Array = get_empty_note_array_in_32nds();
					Toms_Array = [get_empty_note_array_in_32nds(), get_empty_note_array_in_32nds(), get_empty_note_array_in_32nds(), get_empty_note_array_in_32nds()];

					// get another measure
					get32NoteArrayFromClickableUI(Sticking_Array, HH_Array, Snare_Array, Kick_Array, Toms_Array, class_notes_per_measure * i);
					muteArrayFromClickableUI(Sticking_Array, HH_Array, Snare_Array, Kick_Array, Toms_Array, i);

					let repeat = class_repeated_measures.has(i) ? class_repeated_measures.get(i) : 1;
					for (let i = 0; i < repeat; i++) {
						MIDI_from_HH_Snare_Kick_Arrays(midiTrack, HH_Array, Snare_Array, Kick_Array, Toms_Array, MIDI_type, metronomeFrequency, num_notes, num_notes_for_swing, swing_percentage, class_num_beats_per_measure, class_note_value_per_measure, getMetronomeSolo());
					}
				}
				break;
		}

		var midi_url = "data:audio/midi;base64," + btoa(midiFile.toBytes());

		return midi_url;
	}

	root.MIDISaveAs = function () {
		var midi_url = createMidiUrlFromClickableUI("general_MIDI");

		// save as
		document.location = midi_url;
	};

	// creates a grooveData class from the clickable UI elements of the page
	//
	root.grooveDataFromClickableUI = function () {
		var myGrooveData = new root.myGrooveUtils.grooveDataNew();

		myGrooveData.notesPerMeasure = class_notes_per_measure;
		myGrooveData.timeDivision = class_time_division;
		myGrooveData.numberOfMeasures = class_number_of_measures;
		myGrooveData.numBeats = class_num_beats_per_measure;
		myGrooveData.noteValue = class_note_value_per_measure;
		myGrooveData.showStickings = isStickingsVisible();
		myGrooveData.showToms = isTomsVisible();
		myGrooveData.title = document.getElementById("tuneTitle").value;
		myGrooveData.author = document.getElementById("tuneAuthor").value;
		myGrooveData.comments = document.getElementById("tuneComments").value;
		myGrooveData.showLegend = document.getElementById("showLegend").checked;
		myGrooveData.swingPercent = root.myGrooveUtils.getSwing();
		myGrooveData.tempo = root.myGrooveUtils.getTempo();
		myGrooveData.metronomeFrequency = root.getMetronomeFrequency();
		myGrooveData.kickStemsUp = true;
		myGrooveData.repeatedMeasures = class_repeated_measures;
		myGrooveData.highlightOn = class_highlight_on;

		for (var i = 0; i < class_number_of_measures; i++) {
			var total_notes = class_notes_per_measure * class_number_of_measures;
			myGrooveData.sticking_array = [];
			myGrooveData.hh_array = [];
			myGrooveData.snare_array = [];
			myGrooveData.kick_array = [];
			myGrooveData.toms_array = [[], [], [], []];

			// query the clickable UI and generate a arrays representing the notes of all measures
			for (var i = 0; i < total_notes; i++) {

				// only grab the stickings if they are visible
				if (isStickingsVisible())
					myGrooveData.sticking_array.push(get_sticking_state(i, "ABC"));

				myGrooveData.hh_array.push(get_hh_state(i, "ABC"));
				myGrooveData.snare_array.push(get_snare_state(i, "ABC"));
				myGrooveData.kick_array.push(get_kick_state(i, "ABC"));

				if (isTomsVisible()) {
					myGrooveData.toms_array[0].push(get_tom_state(i, 1, "ABC"));
					myGrooveData.toms_array[3].push(get_tom_state(i, 4, "ABC"));
				} else {
					myGrooveData.toms_array[0].push(false);
					myGrooveData.toms_array[3].push(false);
				}
			}
		}

		return myGrooveData;
	};

	// called by the HTML when changes happen to forms that require the ABC to update
	root.refresh_ABC = function () {
		updateSheetMusic();
	};

	// Want to create something like this:
	//
	// {{GrooveTab
	// |HasTempo=90
	// |HasSwingPercent=0
	// |HasDivision=16
	// |HasMeasures=2
	// |HasNotesPerMeasure=32
	// |HasTimeSignature=4/4
	// |HasHiHatTab=x---o---+---x---x---o---+---x---x---o---+---x---x---o---+---x---
	// |HasSnareAccentTab=--------O-------------------O-----------O---------------O-------
	// |HasSnareOtherTab=--------------g-------------------g-----------g-----------------
	// |HasKickTab=o---------------o---o---------------o-----------o---o---------o-
	// |HasFootOtherTab=----------------------------------------------------------------
	// |HasTom1Tab=--------------------------------------------------------o-------
	// |HasTom4Tab=----------------o---------------------------------------o-------
	// |HasEditData=?GDB_Author=1&TimeSig=4/4&Div=32&Tempo=80&Measures=2&H=|--x-----x---x-------------------|--x-----x---x-------------------|&S=|----g-----g-------------ooo-o-o-|----g-----g-----------------gggg|&K=|o-----x-------o-o---------------|o-----x-------o-o---------------|&T1=|--------------------------------|------------------------x-------|&T4=|----------------x---------------|------------------------x-------|
	// }}
	//
	root.updateGrooveDBSource = function () {
		if (!document.getElementById("GrooveDB_source") || document.getElementById("GrooveDB_source").style.display == 'none')
			return; // nothing to update

		var myGrooveData = root.grooveDataFromClickableUI();

		var notesPerMeasureInTab = calc_notes_per_measure((usingTriplets() ? 48 : 32), class_num_beats_per_measure, class_note_value_per_measure);
		var maxNotesInTab = myGrooveData.numberOfMeasures * notesPerMeasureInTab;

		// scale up all the arrays to 48 or 32 notes so that they look normalized

		myGrooveData.hh_array = scaleNoteArrayToFullSize(myGrooveData.hh_array, myGrooveData.numberOfMeasures, myGrooveData.notesPerMeasure, myGrooveData.numBeats, myGrooveData.noteValue);
		myGrooveData.snare_array = scaleNoteArrayToFullSize(myGrooveData.snare_array, myGrooveData.numberOfMeasures, myGrooveData.notesPerMeasure, myGrooveData.numBeats, myGrooveData.noteValue);
		myGrooveData.kick_array = scaleNoteArrayToFullSize(myGrooveData.kick_array, myGrooveData.numberOfMeasures, myGrooveData.notesPerMeasure, myGrooveData.numBeats, myGrooveData.noteValue);
		myGrooveData.toms_array[0] = scaleNoteArrayToFullSize(myGrooveData.toms_array[0], myGrooveData.numberOfMeasures, myGrooveData.notesPerMeasure, myGrooveData.numBeats, myGrooveData.noteValue);
		myGrooveData.toms_array[3] = scaleNoteArrayToFullSize(myGrooveData.toms_array[3], myGrooveData.numberOfMeasures, myGrooveData.notesPerMeasure, myGrooveData.numBeats, myGrooveData.noteValue);

		var DBString = "{{GrooveTab";

		DBString += "\n|HasTempo=" + myGrooveData.tempo;
		DBString += "\n|HasSwingPercent=" + myGrooveData.swingPercent;
		DBString += "\n|HasDivision=" + myGrooveData.notesPerMeasure;
		DBString += "\n|HasMeasures=" + myGrooveData.numberOfMeasures;
		DBString += "\n|HasNotesPerMeasure=" + notesPerMeasureInTab;
		DBString += "\n|HasTimeSignature=" + myGrooveData.numBeats + "/" + myGrooveData.noteValue;
		DBString += "\n|HasHiHatTab=" + tabLineFromAbcNoteArray("H", myGrooveData.hh_array, true, true, maxNotesInTab, 0);
		DBString += "\n|HasSnareAccentTab=" + tabLineFromAbcNoteArray("S", myGrooveData.snare_array, true, false, maxNotesInTab, 0);
		DBString += "\n|HasSnareOtherTab=" + tabLineFromAbcNoteArray("S", myGrooveData.snare_array, false, true, maxNotesInTab, 0);
		DBString += "\n|HasKickTab=" + tabLineFromAbcNoteArray("K", myGrooveData.kick_array, true, false, maxNotesInTab, 0);
		DBString += "\n|HasFootOtherTab=" + tabLineFromAbcNoteArray("K", myGrooveData.kick_array, false, true, maxNotesInTab, 0);
		DBString += "\n|HasTom1Tab=" + tabLineFromAbcNoteArray("T1", myGrooveData.toms_array[0], false, true, maxNotesInTab, 0);
		DBString += "\n|HasTom4Tab=" + tabLineFromAbcNoteArray("T4", myGrooveData.toms_array[3], false, true, maxNotesInTab, 0);
		DBString += "\n|HasEditData=" + class_undo_stack[class_undo_stack.length - 1]

		DBString += "\n}}";

		document.getElementById("GrooveDB_source").value = DBString;
	};

	root.undoCommand = function () {
		if (class_undo_stack.length > 1) {
			var undoURL = class_undo_stack.pop();
			root.AddItemToUndoOrRedoStack(undoURL, class_redo_stack); // add to redo stack
			// the one we want to load is behind the head, since all changes go on the undo stack immediately
			// no need to pop, since it would just get added right back on anyways
			undoURL = class_undo_stack[class_undo_stack.length - 1];
			set_Default_notes(undoURL);
		}
	};

	root.redoCommand = function () {
		if (class_redo_stack.length > 0) {
			var redoURL = class_redo_stack.pop();
			root.AddItemToUndoOrRedoStack(redoURL, class_undo_stack); // add to undo stack
			set_Default_notes(redoURL);
		}
	};

	// debug print the stack
	function debugPrintUndoRedoStack() {
		var i;
		var newHTML = "<h3>Undo Stack</h3><ol>";
		for (i in class_undo_stack) {
			newHTML += "<li>" + class_undo_stack[i];
		}
		newHTML += "</ol><br>";
		document.getElementById("undoStack").innerHTML = newHTML;

		newHTML = "<h3>Redo Stack</h3><ol>";
		for (i in class_redo_stack) {
			newHTML += "<li>" + class_redo_stack[i];
		}
		newHTML += "</ol><br>";
		document.getElementById("redoStack").innerHTML = newHTML;
	}

	// push the new URL on the undo or redo stack
	// keep the stacks at a managable size
	root.AddItemToUndoOrRedoStack = function (newURL, ourStack, noClear) {

		if (!ourStack)
			return false;

		if (newURL == class_undo_stack[class_undo_stack.length - 1]) {
			//debugPrintUndoRedoStack();
			return false; // no change, so don't push
		}

		ourStack.push(newURL);
		while (ourStack.length > constant_undo_stack_max_size)
			ourStack.shift();

		//debugPrintUndoRedoStack();

		return true;
	};

	root.AddFullURLToUndoStack = function (fullURL) {
		var urlFragment;

		var searchData = fullURL.indexOf("?");

		urlFragment = fullURL.slice(searchData);

		// clear redo array whenever we add a new valid element to the stack
		// when we undo, we end up with a null push that returns false here
		if (root.AddItemToUndoOrRedoStack(urlFragment, class_undo_stack)) {
			class_redo_stack = [];
		}
	};

	// update the current URL so that reloads and history traversal and link shares and bookmarks work correctly
	root.updateCurrentURL = function () {
		// Update temporary link out to GS
		var newURLGS = get_GSURLForPage();
		var linkGrooveScribe = document.getElementById("linkGrooveScribe");
		if (linkGrooveScribe)
			linkGrooveScribe.href = newURLGS;
		// Update temporary link out to GS

		var newURL = get_FullURLForPage();

		var newTitle = false;

		root.AddFullURLToUndoStack(newURL);

		var title = document.getElementById("tuneTitle").value.trim();
		if (title !== "")
			newTitle = title;

		var author = document.getElementById("tuneAuthor").value.trim();
		if (author !== "") {
			if (title)
				newTitle += " by " + author;
			else
				newTitle = "Groove by " + author;
		}

		if (!newTitle)
			newTitle = class_app_title;

		document.title = newTitle;
		try {
			window.history.replaceState(null, newTitle, newURL);
		} catch (err) {
			/* empty */
		}

		if (root.myGrooveUtils.debugMode) {
			// put the search data on the bottom of the page to make it easy to cut & paste
			var searchDataEle = document.getElementById("URLSearchData");
			if (searchDataEle) {
				var searchIndex = newURL.indexOf("?");
				var searchURL = newURL.substring(searchIndex).replace("Debug=1&", "");
				searchDataEle.innerHTML = '<p style="margin-left: 10px;"><b>' + searchURL + '</b><p>';
			}
		}
	};

	function generate_ABC(renderWidth) {
		var Sticking_Array = get_empty_note_array_in_32nds();
		var HH_Array = get_empty_note_array_in_32nds();
		var Snare_Array = get_empty_note_array_in_32nds();
		var Kick_Array = get_empty_note_array_in_32nds();
		var Toms_Array = [get_empty_note_array_in_32nds(), get_empty_note_array_in_32nds(), get_empty_note_array_in_32nds(), get_empty_note_array_in_32nds()];
		var numSections = get_numSectionsFor_permutation_array();
		var i,
			new_snare_array,
			post_abc,
			num_sections;
		var num_notes = get32NoteArrayFromClickableUI(Sticking_Array, HH_Array, Snare_Array, Kick_Array, Toms_Array, 0);

		// abc header boilerplate
		var tuneTitle = document.getElementById("tuneTitle").value;
		var tuneAuthor = document.getElementById("tuneAuthor").value;
		var tuneComments = document.getElementById("tuneComments").value;
		var showLegend = document.getElementById("showLegend").checked;
		root.myGrooveUtils.isLegendVisable = showLegend;

		var fullABC = "";

		switch (class_permutation_type) {
			case "kick_16ths": // use the hh & snare from the user
				numSections = get_numSectionsFor_permutation_array();

				fullABC = get_top_ABC_BoilerPlate(class_permutation_type != "none", tuneTitle, tuneAuthor, tuneComments, showLegend, usingTriplets(), false, class_num_beats_per_measure, class_note_value_per_measure, renderWidth, root.myGrooveUtils.get_top_ABC_BoilerPlate);
				root.myGrooveUtils.note_mapping_array = [];

				// compute sections with different kick patterns
				for (i = 0; i < numSections; i++) {
					if (shouldDisplayPermutationForSection(i)) {
						var new_kick_array;

						if (document.getElementById("PermuationOptionsSkipSomeFirstNotes") && document.getElementById("PermuationOptionsSkipSomeFirstNotes").checked)
							new_kick_array = get_kick16th_permutation_array_minus_some(i);
						else
							new_kick_array = get_kick16th_permutation_array(i);

						// grab hi-hat foots from existing kick array and merge it in.
						Kick_Array = filter_kick_array_for_permutation(Kick_Array);
						new_kick_array = merge_kick_arrays(new_kick_array, Kick_Array);

						post_abc = get_permutation_post_ABC(i, usingTriplets());

						fullABC += get_permutation_pre_ABC(i,  usingTriplets());
						fullABC += create_ABC_from_snare_HH_kick_arrays(Sticking_Array, HH_Array, Snare_Array, new_kick_array, Toms_Array, post_abc, num_notes, class_time_division, num_notes, true, class_num_beats_per_measure, class_note_value_per_measure);
						root.myGrooveUtils.note_mapping_array = root.myGrooveUtils.note_mapping_array.concat(create_note_mapping_array_for_highlighting(HH_Array, Snare_Array, new_kick_array, Toms_Array, num_notes));
					}
				}
				break;

			case "snare_16ths": // use the hh & kick from the user
				numSections = get_numSectionsFor_permutation_array();

				fullABC = get_top_ABC_BoilerPlate(class_permutation_type != "none", tuneTitle, tuneAuthor, tuneComments, showLegend, usingTriplets(), false, class_num_beats_per_measure, class_note_value_per_measure, renderWidth, root.myGrooveUtils.get_top_ABC_BoilerPlate);
				root.myGrooveUtils.note_mapping_array = [];

				//compute 16 sections with different snare patterns
				for (i = 0; i < numSections; i++) {
					if (shouldDisplayPermutationForSection(i)) {

						if (document.getElementById("PermuationOptionsAccentGridDiddled") && document.getElementById("PermuationOptionsAccentGridDiddled").checked)
							new_snare_array = get_snare_accent_with_diddle_permutation_array(i);
						else if (document.getElementById("PermuationOptionsAccentGrid") && document.getElementById("PermuationOptionsAccentGrid").checked)
							new_snare_array = get_snare_accent_permutation_array(i);
						else
							new_snare_array = get_snare_permutation_array(i);

						post_abc = get_permutation_post_ABC(i, usingTriplets());

						fullABC += get_permutation_post_ABC(i, usingTriplets());
						fullABC += create_ABC_from_snare_HH_kick_arrays(Sticking_Array, HH_Array, new_snare_array, Kick_Array, Toms_Array, post_abc, num_notes, class_time_division, num_notes, true, class_num_beats_per_measure, class_note_value_per_measure);
						root.myGrooveUtils.note_mapping_array = root.myGrooveUtils.note_mapping_array.concat(create_note_mapping_array_for_highlighting(HH_Array, new_snare_array, Kick_Array, Toms_Array, num_notes));
					}
				}
				break;

			case "none":
			/* falls through */
			default:
				fullABC = get_top_ABC_BoilerPlate(class_permutation_type != "none", tuneTitle, tuneAuthor, tuneComments, showLegend, usingTriplets(), true, class_num_beats_per_measure, class_note_value_per_measure, renderWidth, root.myGrooveUtils.get_top_ABC_BoilerPlate);
				root.myGrooveUtils.note_mapping_array = [];

				var numberOfMeasuresPerLine = 2;
				var addon_abc;

				if (class_notes_per_measure >= 32) {
					// Only put one measure per line for 32nd notes and above because of width issues
					numberOfMeasuresPerLine = 1;
				}

				for (i = 0; i < class_number_of_measures; i++) {

					// we already go the array states above, don't get it again.
					if (i > 0) {
						// reset arrays
						Sticking_Array = get_empty_note_array_in_32nds();
						HH_Array = get_empty_note_array_in_32nds();
						Snare_Array = get_empty_note_array_in_32nds();
						Kick_Array = get_empty_note_array_in_32nds();

						get32NoteArrayFromClickableUI(Sticking_Array, HH_Array, Snare_Array, Kick_Array, Toms_Array, class_notes_per_measure * i);
					}

					if ((i + 1) == class_number_of_measures) {
						// last measure
						addon_abc = "|\n";
					} else if (((i + 1) % numberOfMeasuresPerLine) === 0) {
						// new line measure
						addon_abc = "\n";
					} else {
						// continuation measure
						addon_abc = "\\\n";
					}
					fullABC += create_ABC_from_snare_HH_kick_arrays(Sticking_Array, HH_Array, Snare_Array, Kick_Array, Toms_Array, addon_abc, num_notes, class_time_division, num_notes, true, class_num_beats_per_measure, class_note_value_per_measure);
					root.myGrooveUtils.note_mapping_array = root.myGrooveUtils.note_mapping_array.concat(create_note_mapping_array_for_highlighting(HH_Array, Snare_Array, Kick_Array, Toms_Array, num_notes));
					root.myGrooveUtils.numberOfMeasures = class_number_of_measures
					root.myGrooveUtils.repeatedMeasures = class_repeated_measures;
					root.myGrooveUtils.highlightOn = class_highlight_on;
				}

				break;
		}

		return fullABC;
	}

	// this is called by a bunch of places anytime we modify the musical notes on the page
	// this will recreate the ABC code and will then use the ABC to rerender the sheet music
	// on the page.
	function updateSheetMusic() {
		var renderWidth = 600;
		var svgTarget = document.getElementById("svgTarget");
		if (svgTarget) {
			renderWidth = svgTarget.offsetWidth - 100;
			renderWidth = Math.floor(renderWidth * 0.8);  // reduce width by 20% (This actually makes the notes bigger, because we scale up everything to max width)
		}

		var fullABC = generate_ABC(renderWidth);

		document.getElementById("ABCsource").value = fullABC;
		root.updateGrooveDBSource();

		midiNoteHasChanged(root.myGrooveUtils);

		// update the current URL so that reloads and history traversal and link shares and bookmarks work correctly
		root.updateCurrentURL();

		root.displayNewSVG();
	}

	// called by generate_ABC to remake the sheet music on the page
	root.displayNewSVG = function () {
		var svgTarget = document.getElementById("svgTarget"),
			diverr = document.getElementById("diverr");

		var abc_source = document.getElementById("ABCsource").value;
		var svg_return = renderABCtoSVG(root.myGrooveUtils, abc_source);

		diverr.innerHTML = svg_return.error_html;
		svgTarget.innerHTML = svg_return.svg;

	};

	// Render an SVG that is good for download.
	// Constant size at 2000x200
	function downloadImages(imageType) {
		var abc_source = generate_ABC(800);
		var svg_obj = renderABCtoSVG(root.myGrooveUtils, abc_source);
		var filename;
		var tune_title = document.getElementById("tuneTitle").value;

		if (tune_title.length == 0) {
			filename = "notation.";
		} else {
			filename = tune_title;
		}
		filename += imageType;

		var svg_images = svg_obj.svg.split("</svg>");
		// that split should always create at least 2 since it will match that </svg> if there is only one
		// since the split creates an extra one reduce the length by 1
		for (var i = 0; i < svg_images.length - 1; i++) {
			var myPablo = Pablo(svg_images[i] + "</svg>");
			var width = parseFloat(myPablo.attr('width'));
			var height = parseFloat(myPablo.attr('height'));
			var imageRatio = height / width;
			var newWidth = 2000;
			var newHeight = Math.round(newWidth * imageRatio);
			var newBoxWidth = Math.round(newWidth * .8);
			var newBoxHeight = Math.round(newHeight * .8);
			myPablo.attr('width', newWidth + 'px');
			myPablo.attr('height', newHeight + 'px');
			myPablo.attr('viewBox', '0 0 ' + newBoxWidth + ' ' + newBoxHeight);
			myPablo.children('g').attr('transform', 'scale(2)');

			myPablo.download(imageType, filename, function (result) {
				if (result.error) {
					alert("An error occurred when trying to convert the sheet music to a PNG file.");
				}
			});
		}
	}

	root.PNGSaveAs = function () {
		Pablo.support.image.png(function (acceptable) {
			if (acceptable) {
				downloadImages('png');
			} else {
				alert("Sorry, this browser can't export PNG images");
			}
		});
	}

	root.SVGSaveAs = function () {
		downloadImages('svg');
	};

	root.ShowHideABCResults = function () {
		var ABCResults = document.getElementById("ABC_Results");

		if (ABCResults.style.display == "block")
			ABCResults.style.display = "none";
		else
			ABCResults.style.display = "block";

		return false; // don't follow the link
	};


	//
	//
	function shiftRepeatedMeasuresAfterIndex(measureIndex, direction) {
		// Convert Map to array of entries and sort by measure index
		const sortedEntries = [...class_repeated_measures.entries()].sort((a, b) => a[0] - b[0]);
		
		// Process in reverse order to avoid overwriting
		for (let i = sortedEntries.length - 1; i >= 0; i--) {
			const [key, value] = sortedEntries[i];
			if (key > measureIndex) {
				class_repeated_measures.set(key + direction, value);
				class_repeated_measures.delete(key);
			}
		}
	}

	//
	// remove a measure from the page NB measureNum is indexed starting at 1, not 0
	root.closeMeasureButtonClick = function (measureNum) {
		const noteData = {
			stickings: "",
			hh: "",
			tom1: "",
			tom4: "",
			snare: "",
			kick: ""
		};

		const measureStart = (measureNum - 1) * class_notes_per_measure;
		const measureEnd = measureNum * class_notes_per_measure;
		const totalNotes = class_notes_per_measure * class_number_of_measures;

		for (let i = 0; i < totalNotes; i++) {
			if (i < measureStart || i >= measureEnd) {
				noteData.stickings += get_sticking_state(i, "URL");
				noteData.hh += get_hh_state(i, "URL");
				noteData.tom1 += get_tom_state(i, 1, "URL");
				noteData.tom4 += get_tom_state(i, 4, "URL");
				noteData.snare += get_snare_state(i, "URL");
				noteData.kick += get_kick_state(i, "URL");
			}
		}

		class_repeated_measures.delete(measureNum - 1);
		shiftRepeatedMeasuresAfterIndex(measureNum - 1, -1);
		class_number_of_measures--;

		root.expandAuthoringViewWhenNecessary(class_notes_per_measure, class_number_of_measures);
		changeDivisionWithNotes(
			class_time_division,
			noteData.stickings,
			noteData.hh,
			noteData.tom1,
			noteData.tom4,
			noteData.snare,
			noteData.kick
		);

		updateSheetMusic();
	};


	//
	//
	root.repeatMeasureIncButtonClick = function (measureNum) {
		// Increment repeat count for the measure
		const count = class_repeated_measures.get(measureNum - 1) || 1;
		class_repeated_measures.set(measureNum - 1, count + 1);

		// Collect all notes from the UI
		const notes = {
			stickings: '',
			hh: '',
			tom1: '',
			tom4: '',
			snare: '',
			kick: ''
		};
		
		const totalNotes = class_notes_per_measure * class_number_of_measures;
		for (let i = 0; i < totalNotes; i++) {
			notes.stickings += get_sticking_state(i, "URL");
			notes.hh += get_hh_state(i, "URL");
			notes.tom1 += get_tom_state(i, 1, "URL");
			notes.tom4 += get_tom_state(i, 4, "URL");
			notes.snare += get_snare_state(i, "URL");
			notes.kick += get_kick_state(i, "URL");
		}

		// Update UI and sheet music
		root.expandAuthoringViewWhenNecessary(class_notes_per_measure, class_number_of_measures);
		changeDivisionWithNotes(class_time_division, notes.stickings, notes.hh, notes.tom1, notes.tom4, notes.snare, notes.kick);
		
		// Scroll to add measure button if it exists
		const addMeasureButton = document.getElementById("addMeasureButton");
		addMeasureButton?.scrollIntoView({ block: "start", behavior: "smooth" });

		updateSheetMusic();
	};

	
	//
	//
	root.repeatMeasureDecButtonClick = function (measureNum) {
		const count = class_repeated_measures.get(measureNum - 1) || 1;
		class_repeated_measures.set(measureNum - 1, count - 1);

		let uiStickings = "", uiHH = "", uiTom1 = "", uiTom4 = "", uiSnare = "", uiKick = "";
		const topIndex = class_notes_per_measure * class_number_of_measures;

		for (let i = 0; i < topIndex; i++) {
			uiStickings += get_sticking_state(i, "URL");
			uiHH += get_hh_state(i, "URL");
			uiTom1 += get_tom_state(i, 1, "URL");
			uiTom4 += get_tom_state(i, 4, "URL");
			uiSnare += get_snare_state(i, "URL");
			uiKick += get_kick_state(i, "URL");
		}

		root.expandAuthoringViewWhenNecessary(class_notes_per_measure, class_number_of_measures);
		changeDivisionWithNotes(class_time_division, uiStickings, uiHH, uiTom1, uiTom4, uiSnare, uiKick);

		const addMeasureButton = document.getElementById("addMeasureButton");
		addMeasureButton?.scrollIntoView({ block: "start", behavior: "smooth" });

		updateSheetMusic();
	};


	// add a measure to the page
	// currently always at the end of the measures
	// copy the notes from the last measure to the new measure
	root.duplicateMeasureButtonClick = function (measureNum) {
		// Helper function to collect notes for a given range
		function collectNotes(start, end, target) {
			for (let i = start; i < end; i++) {
				target.stickings += get_sticking_state(i, "URL");
				target.hh += get_hh_state(i, "URL");
				target.tom1 += get_tom_state(i, 1, "URL");
				target.tom4 += get_tom_state(i, 4, "URL");
				target.snare += get_snare_state(i, "URL");
				target.kick += get_kick_state(i, "URL");
			}
		}

		const notes = {
			stickings: "",
			hh: "",
			tom1: "",
			tom4: "",
			snare: "",
			kick: ""
		};

		// Collect notes before the measure to be duplicated
		collectNotes(0, (measureNum - 1) * class_notes_per_measure, notes);

		// Collect notes for the measure to be duplicated (twice)
		const measureStart = (measureNum - 1) * class_notes_per_measure;
		const measureEnd = measureStart + class_notes_per_measure;
		collectNotes(measureStart, measureEnd, notes);
		collectNotes(measureStart, measureEnd, notes);

		// Collect notes after the measure to be duplicated
		collectNotes(measureNum * class_notes_per_measure, class_notes_per_measure * class_number_of_measures, notes);

		// Update measure count and repeated measures
		class_number_of_measures++;
		shiftRepeatedMeasuresAfterIndex(measureNum - 1, 1);
		class_repeated_measures.set(measureNum, class_repeated_measures.get(measureNum - 1) || 1);

		// Update UI and sheet music
		root.expandAuthoringViewWhenNecessary(class_notes_per_measure, class_number_of_measures);
		changeDivisionWithNotes(class_time_division, notes.stickings, notes.hh, notes.tom1, notes.tom4, notes.snare, notes.kick);

		// Scroll to add measure button if it exists
		const addMeasureButton = document.getElementById("addMeasureButton");
		addMeasureButton?.scrollIntoView({ block: "start", behavior: "smooth" });

		updateSheetMusic();
	};


	// add a measure to the page
	// currently always at the end of the measures
	// copy the notes from the last measure to the new measure
	root.addMeasureButtonClick = function (event) {
		const notes = {
			stickings: [],
			hh: [],
			tom1: [],
			tom4: [],
			snare: [],
			kick: []
		};

		// Get encoded notes from UI
		const topIndex = class_notes_per_measure * class_number_of_measures;
		for (let i = 0; i < topIndex; i++) {
			notes.stickings.push(get_sticking_state(i, "URL"));
			notes.hh.push(get_hh_state(i, "URL"));
			notes.tom1.push(get_tom_state(i, 1, "URL"));
			notes.tom4.push(get_tom_state(i, 4, "URL"));
			notes.snare.push(get_snare_state(i, "URL"));
			notes.kick.push(get_kick_state(i, "URL"));
		}

		// Add empty measure
		const emptyMeasure = Array(class_notes_per_measure).fill('-');
		notes.stickings.push(...emptyMeasure);
		notes.hh.push(...emptyMeasure);
		notes.tom1.push(...emptyMeasure);
		notes.tom4.push(...emptyMeasure);
		notes.snare.push(...emptyMeasure);
		notes.kick.push(...emptyMeasure);

		class_number_of_measures++;
		root.expandAuthoringViewWhenNecessary(class_notes_per_measure, class_number_of_measures);

		// Convert arrays to strings
		const noteStrings = {
			stickings: notes.stickings.join(''),
			hh: notes.hh.join(''),
			tom1: notes.tom1.join(''),
			tom4: notes.tom4.join(''),
			snare: notes.snare.join(''),
			kick: notes.kick.join('')
		};

		changeDivisionWithNotes(class_time_division, 
			noteStrings.stickings, 
			noteStrings.hh, 
			noteStrings.tom1, 
			noteStrings.tom4, 
			noteStrings.snare, 
			noteStrings.kick
		);

		// Scroll to add measure button
		const addMeasureButton = document.getElementById("addMeasureButton");
		addMeasureButton?.scrollIntoView({ block: "start", behavior: "smooth" });

		updateSheetMusic();
	};


	//
	//
	root.addMeasureMiddleButtonClick = function (measureNum) {
		var uiStickings = "";
		var uiHH = "";
		var uiTom1 = "";
		var uiTom4 = "";
		var uiSnare = "";
		var uiKick = "";
		var i;

		// get the encoded notes out of the UI from before measure we are going to repeat
		var loop1End = (measureNum) * class_notes_per_measure
		for (i = 0; i < loop1End; i++) {
			uiStickings += get_sticking_state(i, "URL");
			uiHH += get_hh_state(i, "URL");
			uiTom1 += get_tom_state(i, 1, "URL");
			uiTom4 += get_tom_state(i, 4, "URL");
			uiSnare += get_snare_state(i, "URL");
			uiKick += get_kick_state(i, "URL");
		}

		// introduce our empty measure
		for (i = 0; i < class_notes_per_measure; i++) {
			uiStickings += "-";
			uiHH += "-";
			uiTom1 += "-";
			uiTom4 += "-";
			uiSnare += "-";
			uiKick += "-";
		}

		// get the encoded notes out of the UI for measures after measure to be repeated
		var loop3Start = measureNum * class_notes_per_measure
		var loop3End = class_notes_per_measure * class_number_of_measures;
		for (i = loop3Start; i < loop3End; i++) {
			uiStickings += get_sticking_state(i, "URL");
			uiHH += get_hh_state(i, "URL");
			uiTom1 += get_tom_state(i, 1, "URL");
			uiTom4 += get_tom_state(i, 4, "URL");
			uiSnare += get_snare_state(i, "URL");
			uiKick += get_kick_state(i, "URL");
		}

		class_number_of_measures++;

		// We need to move all the repeate measures after this measure up 1 
		shiftRepeatedMeasuresAfterIndex(measureNum - 1, 1);

		root.expandAuthoringViewWhenNecessary(class_notes_per_measure, class_number_of_measures);

		changeDivisionWithNotes(class_time_division, uiStickings, uiHH, uiTom1, uiTom4, uiSnare, uiKick);

		// reference the button and scroll it into view
		var add_measure_button = document.getElementById("addMeasureButton");
		if (add_measure_button)
			add_measure_button.scrollIntoView({ block: "start", behavior: "smooth" });

		updateSheetMusic();
	};


	

	// add an empty measure to the front of the score
	// copy the notes from the first measure to the new measure
	root.addMeasurePrevButtonClick = function (event) {
		var uiStickings = "";
		var uiHH = "";
		var uiTom1 = "";
		var uiTom4 = "";
		var uiSnare = "";
		var uiKick = "";
		var i;

		// Introduce an empty measure at the start
		for (i = 0; i < class_notes_per_measure; i++) {
			uiStickings += "-";
			uiHH += "-";
			uiTom1 += "-";
			uiTom4 += "-";
			uiSnare += "-";
			uiKick += "-";
		}

		// get the encoded notes out of the UI.
		var topIndex = class_notes_per_measure * class_number_of_measures;
		for (i = 0; i < topIndex; i++) {

			uiStickings += get_sticking_state(i, "URL");
			uiHH += get_hh_state(i, "URL");
			uiTom1 += get_tom_state(i, 1, "URL");
			uiTom4 += get_tom_state(i, 4, "URL");
			uiSnare += get_snare_state(i, "URL");
			uiKick += get_kick_state(i, "URL");
		}

		class_number_of_measures++;

		// We need to move all the repeate measures after this measure up 1 
		shiftRepeatedMeasuresAfterIndex(-1, 1);

		root.expandAuthoringViewWhenNecessary(class_notes_per_measure, class_number_of_measures);

		changeDivisionWithNotes(class_time_division, uiStickings, uiHH, uiTom1, uiTom4, uiSnare, uiKick);

		updateSheetMusic();

		// if(class_number_of_measures === 5)
		// 	window.alert("Please be aware that the Groove Scribe is not designed to write an entire musical score.\n" +
		// 				"You can create as many measures as you want, but your browser may slow down as more measures are added.\n" +
		// 				"There are also many notation features that would be useful for score writing that are not part of Groove Scribe");
	};



	// clear all the notes on all measures
	root.clearAllNotes = function () {
		class_repeated_measures.clear();
		for (var i = 0; i < class_number_of_measures * class_notes_per_measure; i++) {
			set_sticking_state(i, 'off', class_notes_per_measure, class_time_division, class_note_value_per_measure);
			set_hh_state(i, 'off');
			set_tom1_state(i, 'off');
			set_tom4_state(i, 'off');
			set_snare_state(i, 'off');
			set_kick_state(i, 'off');
		}
		class_number_of_measures = 1;

		updateSheetMusic();

		var uiStickings = "";
		var uiHH = "";
		var uiTom1 = "";
		var uiTom4 = "";
		var uiSnare = "";
		var uiKick = "";
		var i;

		changeDivisionWithNotes(class_time_division, uiStickings, uiHH, uiTom1, uiTom4, uiSnare, uiKick);
	}


	function isTomsVisible() {
		var myElements = document.querySelectorAll(".toms-container");
		for (var i = 0; i < myElements.length; i++) {
			if (myElements[i].style.visibility == "visible")
				return true;
		}

		return false;
	}

	root.showHideToms = function (force, showElseHide, dontRefreshScreen) {
		var OnElseOff = showHideCSS_ClassVisibility(".toms-container", force, showElseHide);
		showHideCSS_ClassVisibility(".tom-label", force, showElseHide);
		if (OnElseOff)
			addOrRemoveKeywordFromClassById("showHideTomsButton", "ClickToHide", true);
		else
			addOrRemoveKeywordFromClassById("showHideTomsButton", "ClickToHide", false);

		if (!dontRefreshScreen)
			updateSheetMusic();

		return false; // don't follow the link
	};

	root.stickingsShowHide = function (force, showElseHide, dontRefreshScreen) {

		var OnElseOff = showHideCSS_ClassDisplay(".stickings-container", force, showElseHide, "block");
		showHideCSS_ClassDisplay(".stickings-label", force, showElseHide, "block");
		if (OnElseOff) {
			addOrRemoveKeywordFromClassById("stickingsButton", "ClickToHide", true);
		} else {
			addOrRemoveKeywordFromClassById("stickingsButton", "ClickToHide", false);
		}

		if (!dontRefreshScreen) {
			updateSheetMusic();
		}

		return false; // don't follow the link
	};

	// if stickings are shown, hide them and vice versa
	root.stickingsShowHideToggle = function () {

		var stickingsAreCurrentlyShown = isStickingsVisible();
		root.stickingsShowHide(true, !stickingsAreCurrentlyShown, false);
	}

	// Swap Right and Left stickings if any are shown
	root.stickingsReverseRL = function () {
		for (var i = 0; i < class_number_of_measures * class_notes_per_measure; i++) {
			var cur_state = get_sticking_state(i, "URL");
			if (cur_state === "R") {
				set_sticking_state(i, "left", false, class_notes_per_measure, class_time_division, class_note_value_per_measure);
			} else if (cur_state === "L") {
				set_sticking_state(i, "right", false, class_notes_per_measure, class_time_division, class_note_value_per_measure);
			}
		}
		updateSheetMusic();
	}

	root.printMusic = function () {

		var oldMethod = true;

		if ((root.browserInfo.browser == "Chrome" && root.browserInfo.platform == "windows")) {
			oldMethod = false;
		}

		if (oldMethod) {
			// css media queries wiil hide all but the music
			// force a print

			window.print();

		} else {
			// open a new window just for printing   (new method)
			var win = window.open("", class_app_title + " Print");
			win.document.body.innerHTML = "<title>" + class_app_title + "</title>\n<center>\n";
			win.document.body.innerHTML += document.getElementById("svgTarget").innerHTML;
			win.document.body.innerHTML += "\n</center>";
			win.print();
		}

	};

	root.setupWriterHotKeys = function () {

		document.addEventListener("keydown", function (e) {

			// only accept the event if it not going to an INPUT field   (allow for range types)
			if (e.target.type == "range" || (e.target.tagName.toUpperCase() != "INPUT" && e.target.tagName.toUpperCase() != "TEXTAREA")) {
				switch (e.which) {
					case 90: // ctrl-z
						if (e.ctrlKey) {
							// ctrl-z
							root.undoCommand();
							return false;
						}
						break;

					case 89: // ctrl-y
						if (e.ctrlKey) {
							// ctrl-y
							root.redoCommand();
							return false;
						}
						break;

					case 37: // left arrow
						// left arrow
						root.myGrooveUtils.downTempo();
						return false;
					//break;

					case 39: // right arrow
						// right arrow
						root.myGrooveUtils.upTempo();
						return false;
					//break;

					default:
						/* DEBUG
						else if(e.ctrlKey && e.which !=17 && e.target.type != "text") {
						alert("Key is: " + e.which);
						}
						 */
						break;
				}
			}
			return true; // let the default handler deal with the keypress
		});
	};

	root.swapViewEditMode = function (dontUpdateURL) {
		var view_edit_button = document.getElementById("view-edit-switch");

		if (root.myGrooveUtils.viewMode) {

			showHideCSS_ClassDisplay(".edit-block", true, true, "block"); // show

			if (view_edit_button)
				view_edit_button.innerHTML = "Switch to VIEW mode";
			root.myGrooveUtils.viewMode = false;

			if (!dontUpdateURL)
				root.updateCurrentURL();
		} else {

			showHideCSS_ClassDisplay(".edit-block", true, false, "block"); // hide

			if (view_edit_button)
				view_edit_button.innerHTML = "Switch to EDIT mode";
			root.myGrooveUtils.viewMode = true;
			if (!dontUpdateURL)
				root.updateCurrentURL();
		}
	};

	// public function.
	// This function initializes the data for the groove Scribe web page
	root.runsOnPageLoad = function () {

		root.setupWriterHotKeys(); // there are other hot keys in GrooveUtils for the midi player

		setupPermutationMenu();
		root.setTimeSigLabel();

		// if Mode != "view" put into edit mode  (we default to view mode to prevent screen flicker)
		if ("view" != getQueryVariableFromURL("Mode", "edit"))
			root.swapViewEditMode(true);

		// set the background and text color of the current subdivision
		selectButton(document.getElementById("subdivision_" + class_notes_per_measure + "ths"));

		// add html for the midi player
		midiPlayer.AddMidiPlayerToPage(root.myGrooveUtils, "midiPlayer", class_time_division);

		// load the groove from the URL data if it was passed in.
		set_Default_notes(window.location.search);

		root.myGrooveUtils.midiEventCallbacks.loadMidiDataEvent = function (myroot, playStarting) {
			var midiURL;

			if (playStarting && class_metronome_count_in_active) {

				midiURL = MIDI_build_midi_url_count_in_track(class_num_beats_per_measure, class_note_value_per_measure, root.myGrooveUtils.getTempo());
				midiNoteHasChanged(root.myGrooveUtils);
				class_metronome_count_in_is_playing = true;
			} else {
				if (class_metronome_count_in_is_playing) {
					// we saved the state above so that we could reset the Offset click start, otherwise it starts on the 'e'
					class_metronome_count_in_is_playing = false;
					resetMetronomeOptionsOffsetClickStartRotation();
				}
				midiURL = createMidiUrlFromClickableUI("our_MIDI");
				midiResetNoteHasChanged(root.myGrooveUtils);
			}
			loadMIDIFromURL(root.myGrooveUtils, midiURL, root.myGrooveUtils.getTempo());
			root.updateGrooveDBSource();
		};

		root.myGrooveUtils.midiEventCallbacks.notePlaying = function (myroot, note_type, percent_complete) {
			if (note_type == "complete" && class_metronome_auto_speed_up_active) {
				// reload with new tempo
				midiNoteHasChanged(root.myGrooveUtils);
				root.metronomeAutoSpeedUpTempoUpdate();
			}

			if (class_highlight_on) hilight_note(note_type, percent_complete, class_permutation_type, class_num_beats_per_measure, class_note_value_per_measure, class_number_of_measures, class_notes_per_measure, class_repeated_measures, usingTriplets());
		};

		oneTimeInitializeMidi(root.myGrooveUtils);

		// enable or disable swing
		root.myGrooveUtils.swingEnabled(root.myGrooveUtils.doesDivisionSupportSwing(class_notes_per_measure));

		window.onresize = root.refresh_ABC;

		root.browserInfo = getBrowserInfo();
		if (root.browserInfo.browser == "MSIE" && root.browserInfo.version < 10) {
			window.alert("This browser has been detected as: " + root.browserInfo.browser + " ver: " + root.browserInfo.version + ".\n" + 'This version of IE is unsupported.   Please use Chrome or Firefox instead');
		} else if (root.browserInfo.browser == "Safari" && root.browserInfo.platform == "windows" && root.browserInfo.version < 535) {
			window.alert("This browser has been detected as: " + root.browserInfo.browser + " ver: " + root.browserInfo.version + ".\n" + 'This version of Safari is unsupported.   Please use Chrome instead');
		}
		if (root.myGrooveUtils.debugMode) {
			var debugOutput = document.getElementById("debugOutput");
			if (debugOutput) {
				debugOutput.innerHTML += "<div>This browser has been detected as: " + root.browserInfo.browser + " ver: " + root.browserInfo.version + ".<br>" + root.browserInfo.uastring + "<br>Running on: " + root.browserInfo.platform + "</div>";
			}
		}

		if (is_touch_device()) {
			setTimeout(function () {
				window.scrollTo(0, 1);
			}, 1000);
		}

		// get updates when the tempo changes
		root.myGrooveUtils.tempoChangeCallback = root.tempoChangeCallback
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

		var curTempo = root.myGrooveUtils.getTempo();

		var midiStartTime = midiPlayer.getMIDIStartTime();
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
		var totalMidiPlayTime = midiPlayer.getMidiPlayTime();
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
			root.myGrooveUtils.setTempo(root.myGrooveUtils.getTempo() + tempoDiffInt);
	};

	// takes a string of notes encoded in a serialized string and sets the notes on or off
	// uses drum tab format adapted from wikipedia: http://en.wikipedia.org/wiki/Drum_tablature
	//
	//
	//  HiHat support:
	//      x: normal
	//      X: accent
	//      o: open
	//		+: close
	//      c: crash
	//      r: ride
	//      b: ride bell
	//      m: cow bell (more)
	//      s: stacker
	//      -: off
	//
	//   Snare support:
	//      o: normal
	//      O: accent
	//      f: flam
	//      d: drag
	//      g: ghost
	//      x: cross stick
	//      -: off
	//
	//   Kick support:
	//      o: normal
	//      x: hi hat splash with foot
	//      X: kick & hi hat splash with foot simultaneously
	//
	//  Note that "|" and " " will be skipped so that standard drum tabs can be applied
	//  Example:
	//     H=|x---x---x---x---|x---x---x---x---|x---x---x---x---|
	// or  H=x-x-x-x-x-x-x-x-x-x-x-x-
	//     S=|----o-------o---|----o-------o---|----o-------o---|
	// or  S=--o---o---o---o---o---o-
	//     B=|o-------o-------|o-------o-o-----|o-----o-o-------|
	// or  B=o---o---o----oo-o--oo---|
	//
	function setNotesFromURLData(drumType, noteString, numberOfMeasures) {
		var setFunction;

		if (drumType == "Stickings") {
			setFunction = set_sticking_state;
		} else if (drumType == "H") {
			setFunction = set_hh_state;
		} else if (drumType == "T1") {
			setFunction = set_tom1_state;
		} else if (drumType == "T4") {
			setFunction = set_tom4_state;
		} else if (drumType == "S") {
			setFunction = set_snare_state;
		} else if (drumType == "K") {
			setFunction = set_kick_state;
		}

		// decode the %7C url encoding types
		noteString = decodeURIComponent(noteString);

		// ignore ":" and "|" by removing them
		var notes = noteString.replace(/:|\|/g, '');

		// multiple measures of "how_many_notes"
		var notesOnScreen = class_notes_per_measure * numberOfMeasures;

		var noteStringScaler = 1;
		var displayScaler = 1;
		if (notes.length > notesOnScreen && notes.length / notesOnScreen >= 2) {
			// if we encounter a 16th note groove for an 8th note board, let's scale it	down
			noteStringScaler = Math.ceil(notes.length / notesOnScreen);
		} else if (notes.length < notesOnScreen && notesOnScreen / notes.length >= 2) {
			// if we encounter a 8th note groove for an 16th note board, let's scale it up
			displayScaler = Math.ceil(notesOnScreen / notes.length);
		}

		//  DisplayIndex is the index into the notes on the HTML page  starts at 1/32\n%%flatbeams
		var displayIndex = 0;
		var topDisplay = class_notes_per_measure * class_number_of_measures;
		for (var i = 0; i < notes.length && displayIndex < topDisplay; i += noteStringScaler, displayIndex += displayScaler) {

			switch (notes[i]) {
				case "$":
					setFunction(displayIndex, "and", false);
					break;
				case "1":
					setFunction(displayIndex, "1", false);
					break;
				case "a":
					setFunction(displayIndex, "a", false);
					break;
				case "B":
					if (drumType == "Stickings")
						setFunction(displayIndex, "both", false);
					break;
				case "b":
					if (drumType == "H")
						setFunction(displayIndex, "ride_bell", false);
					else if (drumType == "S")
						setFunction(displayIndex, "buzz", false);
					break;
				case "c":
					if (drumType == "Stickings")
						setFunction(displayIndex, "count", false);
					else
						setFunction(displayIndex, "crash", false);
					break;
				case "e":
					setFunction(displayIndex, "e", false);
					break;
				case "g":
					setFunction(displayIndex, "ghost", false);
					break;
				case "f":
					setFunction(displayIndex, "flam", false);
					break;
				case "d":
					setFunction(displayIndex, "drag", false);
					break;
				case "l":
				case "L":
					if (drumType == "Stickings")
						setFunction(displayIndex, "left", false);
					break;
				case "m":
					if (drumType == "H")
						setFunction(displayIndex, "cow_bell", false);
					break;
				case "n":
					if (drumType == "H")
						setFunction(displayIndex, "metronome_normal", false);
					break;
				case "N":
					if (drumType == "H")
						setFunction(displayIndex, "metronome_accent", false);
					break;
				case "O":
					setFunction(displayIndex, "accent", false);
					break;
				case "o":
					if (drumType == "H")
						setFunction(displayIndex, "open", false);
					else
						setFunction(displayIndex, "normal", false);
					break;
				case "r":
				case "R":
					if (drumType == "H")
						setFunction(displayIndex, "ride", false);
					else if (drumType == "Stickings")
						setFunction(displayIndex, "right", false);
					break;
				case "s":
					setFunction(displayIndex, "stacker", false);
					break;
				case "x":
					if (drumType == "S")
						setFunction(displayIndex, "xstick", false);
					else if (drumType == "K")
						setFunction(displayIndex, "splash", false);
					else
						setFunction(displayIndex, "normal", false);
					break;
				case "X":
					if (drumType == "K")
						setFunction(displayIndex, "kick_and_splash", false);
					else
						setFunction(displayIndex, "accent", false);
					break;
				case "+":
					setFunction(displayIndex, "close", false);
					break;
				case "-":
					setFunction(displayIndex, "off", false);
					break;
				default:
					console.log("Bad note in setNotesFromURLData: " + notes[i]);
					break;
			}
		}
	}

	function setNotesFromABCArray(drumType, abcArray, numberOfMeasures) {
		var setFunction;

		// multiple measures of "how_many_notes"
		var notesOnScreen = class_notes_per_measure * numberOfMeasures;

		var noteStringScaler = 1;
		var displayScaler = 1;
		if (abcArray.length > notesOnScreen && abcArray.length / notesOnScreen >= 2) {
			// if we encounter a 16th note groove for an 8th note board, let's scale it	down
			noteStringScaler = Math.ceil(abcArray.length / notesOnScreen);
		} else if (abcArray.length < notesOnScreen && notesOnScreen / abcArray.length >= 2) {
			// if we encounter a 8th note groove for an 16th note board, let's scale it up
			displayScaler = Math.ceil(notesOnScreen / abcArray.length);
		}

		if (drumType == "Stickings") {
			setFunction = set_sticking_state;
		} else if (drumType == "H") {
			setFunction = set_hh_state;
		} else if (drumType == "T1") {
			setFunction = set_tom1_state;
		} else if (drumType == "T4") {
			setFunction = set_tom4_state;
		} else if (drumType == "S") {
			setFunction = set_snare_state;
		} else if (drumType == "K") {
			setFunction = set_kick_state;
		}

		//  DisplayIndex is the index into the notes on the HTML page  starts at 1/32\n%%flatbeams
		var displayIndex = 0;
		var topDisplay = class_notes_per_measure * class_number_of_measures;
		for (var i = 0; i < abcArray.length && displayIndex < topDisplay; i += noteStringScaler, displayIndex += displayScaler) {

			switch (abcArray[i]) {
				case constant_ABC_STICK_R:
					setFunction(displayIndex, "right", false);
					break;
				case constant_ABC_STICK_L:
					setFunction(displayIndex, "left", false);
					break;
				case constant_ABC_STICK_BOTH:
					setFunction(displayIndex, "both", false);
					break;
				case constant_ABC_STICK_COUNT:
					setFunction(displayIndex, "count", false);
					break;
				case constant_ABC_STICK_OFF:
					setFunction(displayIndex, "off", false);
					break;
				case constant_ABC_HH_Ride:
					setFunction(displayIndex, "ride", false);
					break;
				case constant_ABC_HH_Ride_Bell:
					setFunction(displayIndex, "ride_bell", false);
					break;
				case constant_ABC_HH_Cow_Bell:
					setFunction(displayIndex, "cow_bell", false);
					break;
				case constant_ABC_HH_Crash:
					setFunction(displayIndex, "crash", false);
					break;
				case constant_ABC_HH_Stacker:
					setFunction(displayIndex, "stacker", false);
					break;
				case constant_ABC_HH_Metronome_Normal:
					setFunction(displayIndex, "metronome_normal", false);
					break;
				case constant_ABC_HH_Metronome_Accent:
					setFunction(displayIndex, "metronome_accent", false);
					break;
				case constant_ABC_HH_Open:
					setFunction(displayIndex, "open", false);
					break;
				case constant_ABC_HH_Close:
					setFunction(displayIndex, "close", false);
					break;
				case constant_ABC_HH_Accent:
					setFunction(displayIndex, "accent", false);
					break;
				case constant_ABC_HH_Normal:
					setFunction(displayIndex, "normal", false);
					break;
				case constant_ABC_T1_Normal:
					setFunction(displayIndex, "normal", false);
					break;
				case constant_ABC_T4_Normal:
					setFunction(displayIndex, "normal", false);
					break;
				case constant_ABC_SN_Ghost:
					setFunction(displayIndex, "ghost", false);
					break;
				case constant_ABC_SN_Accent:
					setFunction(displayIndex, "accent", false);
					break;
				case constant_ABC_SN_Normal:
					setFunction(displayIndex, "normal", false);
					break;
				case constant_ABC_SN_Flam:
					setFunction(displayIndex, "flam", false);
					break;
				case constant_ABC_SN_Drag:
					setFunction(displayIndex, "drag", false);
					break;
				case constant_ABC_SN_XStick:
					setFunction(displayIndex, "xstick", false);
					break;
				case constant_ABC_SN_Buzz:
					setFunction(displayIndex, "buzz", false);
					break;
				case constant_ABC_KI_SandK:
					setFunction(displayIndex, "kick_and_splash", false);
					break;
				case constant_ABC_KI_Splash:
					setFunction(displayIndex, "splash", false);
					break;
				case constant_ABC_KI_Normal:
					setFunction(displayIndex, "normal", false);
					break;
				case false:
					setFunction(displayIndex, "off", false);
					break;
				default:
					console.log("Bad note in setNotesFromABCArray: " + abcArray[i]);
					break;
			}
		}
	}

	// get a really long URL that encodes all of the notes and the rest of the state of the page.
	// this will allow us to bookmark or reference a groove and handle undo/redo.
	//
	function get_FullURLForPage(url_destination) {
		var myGrooveData = root.grooveDataFromClickableUI()
		return getUrlStringFromGrooveData(myGrooveData, url_destination)
	}

	// get a really long URL that encodes all of the notes and the rest of the state of the page.
	// this will allow us to bookmark or reference a groove and handle undo/redo.
	//
	function get_GSURLForPage(url_destination) {
		var myGrooveData = root.grooveDataFromClickableUI()
		return getGSUrlStringFromGrooveData(myGrooveData, url_destination)
	}

	root.show_MetronomeAutoSpeedupConfiguration = function () {
		var popup = document.getElementById("metronomeAutoSpeedupConfiguration");

		if (popup) {
			popup.style.display = "block";
		}

		document.getElementById('metronomeAutoSpeedupTempoIncreaseAmountOutput').innerHTML = document.getElementById('metronomeAutoSpeedupTempoIncreaseAmount').value;
		document.getElementById('metronomeAutoSpeedupTempoIncreaseIntervalOutput').innerHTML = document.getElementById('metronomeAutoSpeedupTempoIncreaseInterval').value;
	};

	root.close_MetronomeAutoSpeedupConfiguration = function (type) {
		var popup = document.getElementById("metronomeAutoSpeedupConfiguration");

		if (popup)
			popup.style.display = "none";
	};

	root.timeSigPopupOpen = function (type) {
		var popup = document.getElementById("timeSigPopup");

		if (popup)
			popup.style.display = "block";

	};

	// turns on or off triplet 1/4 and 1/8 note selection based on the current time sig setting
	root.setTimeDivisionSelectionOnOrOff = function () {

		// check for incompatible odd time signature division  9/16 and 1/8 notes for instance
		if ((8 * class_num_beats_per_measure / class_note_value_per_measure) % 1 != 0) {
			addOrRemoveKeywordFromClassById("subdivision_8ths", "disabled", true);
		} else {
			addOrRemoveKeywordFromClassById("subdivision_8ths", "disabled", false);
		}

		if (class_note_value_per_measure != 4) {
			// triplets are too complicated right now outside of x/4 time.
			// disable them

			addOrRemoveKeywordFromClassById("subdivision_12ths", "disabled", true);
			addOrRemoveKeywordFromClassById("subdivision_24ths", "disabled", true);
			addOrRemoveKeywordFromClassById("subdivision_48ths", "disabled", true);

		} else {
			addOrRemoveKeywordFromClassById("subdivision_12ths", "disabled", false);
			addOrRemoveKeywordFromClassById("subdivision_24ths", "disabled", false);
			addOrRemoveKeywordFromClassById("subdivision_48ths", "disabled", false);

		}
	};


	root.setTimeSigLabel = function () {
		// turn on/off special features that are only available in 4/4 time

		// set the label
		document.getElementById("timeSigLabel").innerHTML = '<sup>' + class_num_beats_per_measure + "</sup>/<sub>" + class_note_value_per_measure + "</sub>";
	};

	root.timeSigPopupClose = function (type, callback) {
		var popup = document.getElementById("timeSigPopup");

		if (popup)
			popup.style.display = "none";

		// ignore type "cancel"
		if (type == "ok") {
			var newTimeSigTop = document.getElementById("timeSigPopupTimeSigTop").value;
			var newTimeSigBottom = document.getElementById("timeSigPopupTimeSigBottom").value;

			if (usingTriplets() && newTimeSigBottom != 4) {
				root.changeDivision(16);  // switch to a non triplet division since they are not supported in this time signature
			}

			class_num_beats_per_measure = newTimeSigTop;
			class_note_value_per_measure = newTimeSigBottom;
			var new_notes_per_measure = calc_notes_per_measure(class_time_division, class_num_beats_per_measure, class_note_value_per_measure);
			// If new_notes_per_measure is greater it will cause the changeDivision code to error
			// as it tries to read the notes from the UI.   Setting it lower will allow the code to truncate
			// the groove properly to something smaller rather than interpolating the groove into something weird
			if (new_notes_per_measure < class_notes_per_measure)
				class_notes_per_measure = new_notes_per_measure;
			root.changeDivision(class_time_division);   // use this function because it will relayout everything
		}
		if (callback) {
			callback();
		}
	};

	root.updateRangeLabel = function (event, idToUpdate) {
		var element = document.getElementById(idToUpdate);

		if (element) {
			element.innerHTML = event.currentTarget.value;
		}
	};

	root.fillInFullURLInFullURLPopup = function () {
		document.getElementById("embedCodeCheckbox").checked = false;  // uncheck embedCodeCheckbox
		document.getElementById("shortenerCheckbox").checked = false;  // uncheck shortenerCheckbox

		var popup = document.getElementById("fullURLPopup");
		if (popup) {
			var fullURL = get_FullURLForPage();
			var textField = document.getElementById("fullURLPopupTextField");
			textField.value = fullURL;

			popup.style.display = "block";

			// select the URL for copy/paste
			textField.focus();
			textField.select();
		}
	};

	root.show_FullURLPopup = function () {
		var popup = document.getElementById("fullURLPopup");

		var ShareBut = new ShareButton({
			ui: {
				flyout: 'bottom center', // change the flyout direction of the shares. chose from `top left`, `top center`, `top right`, `bottom left`, `bottom right`, `bottom center`, `middle left`, or `middle right` [Default: `top center`]
				button_font: false, // include the Lato font set from the Google Fonts API. [Default: `true`]
				buttonText: 'SHARE', // change the text of the button, [Default: `Share`]
				icon_font: false,   // include the minified Entypo font set. [Default: `true`]
			},
			networks: {
				facebook: {
					before: function () {
						this.url = document.getElementById("fullURLPopupTextField").value;
						this.description = "Check out this groove.";
					},
					//app_id : "839699029418014"    // staging id
					// app_id : "1499163983742002"   // MLDC id, lou created
					appId: "445510575651140",   // MLDC id, brad created
					loadSdk: true
				},
				googlePlus: {
					enabled: false
				},
				twitter: {
					before: function () {
						this.url = encodeURIComponent(document.getElementById("fullURLPopupTextField").value);
						this.description = "Check out this groove:  " + document.getElementById("fullURLPopupTextField").value;
					}
				},
				reddit: {
					before: function () {
						this.url = document.getElementById("fullURLPopupTextField").value;
						this.title = "Check out this groove: " + document.getElementById("fullURLPopupTextField").value;
					}
				},
				email: {
					before: function () {
						this.url = document.getElementById("fullURLPopupTextField").value;
						this.description = "Check out this groove. %0A%0A " + encodeURIComponent(document.getElementById("fullURLPopupTextField").value);
					}
				},
				pinterest: {
					enabled: false
				},
				linkedin: {
					enabled: false
				},
				whatsapp: {
					enabled: false
				}
			}
		});

		// open the popup with full url and try to load short in the background
		root.fillInFullURLInFullURLPopup();
		// default is to use shortened url
		fillInShortenedURLInFullURLPopup(get_FullURLForPage(), 'fullURLPopupTextField');
	};

	root.copyShareURLToClipboard = function () {
		var copyText = document.getElementById("fullURLPopupTextField");

		copyText.select();
		// hack fix for mobile
		copyText.setSelectionRange(0, 99999);

		document.execCommand("copy");
	}

	root.close_FullURLPopup = function () {
		var popup = document.getElementById("fullURLPopup");

		if (popup)
			popup.style.display = "none";
	};

	function fillInShortenedURLInFullURLPopup(fullURL, cssIdOfTextFieldToFill) {
		document.getElementById("embedCodeCheckbox").checked = false;  // uncheck embedCodeCheckbox, because it is not compatible

		var params = {
			"dynamicLinkInfo": {
				"domainUriPrefix": "https://gscribe.com/share",
				"link": fullURL
			}
		};

		var xhr = new XMLHttpRequest();
		xhr.open('POST', 'https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyBx4So11fGFPgTI62nP-JmxrxHmuRpJ120');
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = function () {
			if (xhr.status === 200) {
				// success
				var response = JSON.parse(xhr.responseText);
				var textField = document.getElementById(cssIdOfTextFieldToFill);
				textField.value = response.shortLink;
				// select the URL for copy/paste
				textField.focus();
				textField.select();
				document.getElementById("shortenerCheckbox").checked = true;  // this is now true if isn't already
			} else {
				document.getElementById("shortenerCheckbox").checked = false;  // request failed
			}
		};
		xhr.send(JSON.stringify(params));

	}

	// embed looks something like this:
	// <iframe width="100%" height="240" src="https://hosting.com/path/GrooveDisplay.html?Div=16&Title=Example..." frameborder="0" ></iframe>
	function fillInEmbedURLInFullURLPopup(fullURL, cssIdOfTextFieldToFill) {
		document.getElementById("shortenerCheckbox").checked = false;  // uncheck shortenerCheckbox, because it is not compatible
		document.getElementById("embedCodeCheckbox").checked = true;  // this will be true if isn't already

		var embedText = '<iframe width="100%" height="240" src="' + fullURL + '" frameborder="0" ></iframe>	';

		var textField = document.getElementById(cssIdOfTextFieldToFill);
		textField.value = embedText;

		// select the URL for copy/paste
		textField.focus();
		textField.select();
	}

	root.shortenerCheckboxChanged = function () {
		if (document.getElementById("shortenerCheckbox").checked) {
			fillInShortenedURLInFullURLPopup(get_FullURLForPage(), 'fullURLPopupTextField');
		} else {
			root.fillInFullURLInFullURLPopup();
		}
	};

	root.embedCodeCheckboxChanged = function () {
		if (document.getElementById("embedCodeCheckbox").checked) {
			fillInEmbedURLInFullURLPopup(get_FullURLForPage("display"), 'fullURLPopupTextField');
		} else {
			fillInShortenedURLInFullURLPopup(get_FullURLForPage(), 'fullURLPopupTextField');
		}
	};

	function set_Default_notes(encodedURLData) {
		var Division;
		var Stickings;
		var HH;
		var Snare;
		var Kick;
		var stickings_set_from_URL = false;

		var myGrooveData = getGrooveDataFromUrlString(encodedURLData, root.myGrooveUtils, root.myGrooveUtils.debugMode);

		class_num_beats_per_measure = myGrooveData.numBeats;     // TimeSigTop
		class_note_value_per_measure = myGrooveData.noteValue;   // TimeSigBottom
		class_repeated_measures = myGrooveData.repeatedMeasures;
		class_highlight_on = myGrooveData.highlightOn;

		if (myGrooveData.notesPerMeasure != class_notes_per_measure || class_number_of_measures != myGrooveData.numberOfMeasures) {
			class_number_of_measures = myGrooveData.numberOfMeasures;
			changeDivisionWithNotes(myGrooveData.timeDivision);
		}

		root.expandAuthoringViewWhenNecessary(class_notes_per_measure, class_number_of_measures);

		setNotesFromABCArray("Stickings", myGrooveData.sticking_array, class_number_of_measures);
		setNotesFromABCArray("H", myGrooveData.hh_array, class_number_of_measures);
		setNotesFromABCArray("T1", myGrooveData.toms_array[0], class_number_of_measures);
		setNotesFromABCArray("T4", myGrooveData.toms_array[3], class_number_of_measures);
		setNotesFromABCArray("S", myGrooveData.snare_array, class_number_of_measures);
		setNotesFromABCArray("K", myGrooveData.kick_array, class_number_of_measures);

		if (myGrooveData.showToms)
			root.showHideToms(true, true, true);

		if (myGrooveData.showStickings)
			root.stickingsShowHide(true, true, true);

		document.getElementById("tuneTitle").value = myGrooveData.title;

		document.getElementById("tuneAuthor").value = myGrooveData.author;

		document.getElementById("tuneComments").value = myGrooveData.comments;

		root.myGrooveUtils.setTempo(myGrooveData.tempo);

		root.myGrooveUtils.setSwing(myGrooveData.swingPercent);

		root.setMetronomeFrequency(myGrooveData.metronomeFrequency);

		updateSheetMusic();
	}

	root.loadNewGroove = function (encodedURLData) {
		set_Default_notes(encodedURLData);
	};

	function getABCDataWithLineEndings() {
		var myABC = document.getElementById("ABCsource").value;

		// add proper line endings for windows
		myABC = myABC.replace(/\r?\n/g, "\r\n");

		return myABC;
	}

	root.saveABCtoFile = function () {
		var myABC = getABCDataWithLineEndings();

		var myURL = 'data:text/plain;charset=utf-8;base64,' + btoa(myABC);

		console.log("Use \"Save As\" to save the new page to a local file");
		window.open(myURL);

	};

	// change the base division to something else.
	// eg  16th to 8ths or   32nds to 8th note triplets
	// need to re-layout the html notes, change any globals and then reinitialize
	//
	// OMG this needs to be refactored really bad.   There is a GrooveData struct from groove utils that
	//      would make this whole thing much easier.  :(
	function changeDivisionWithNotes(newDivision, Stickings, HH, Tom1, Tom4, Snare, Kick) {
		var oldDivision = class_time_division;
		var wasStickingsVisable = isStickingsVisible();
		var wasTomsVisable = isTomsVisible();

		class_time_division = newDivision;
		class_notes_per_measure = calc_notes_per_measure(class_time_division, class_num_beats_per_measure, class_note_value_per_measure);

		var newHTML = "";
		for (var cur_measure = 1; cur_measure <= class_number_of_measures; cur_measure++) {
			newHTML += root.HTMLforStaffContainer(cur_measure, (cur_measure - 1) * class_notes_per_measure);
		}

		// rewrite the HTML for the HTML note grid
		document.getElementById("measureContainer").innerHTML = newHTML;

		// change the Permutation options too
		newHTML = HTMLforPermutationOptions(class_permutation_type, usingTriplets());
		document.getElementById("PermutationOptions").innerHTML = newHTML;

		if (wasStickingsVisable)
			root.stickingsShowHide(true, true, true);

		if (wasTomsVisable)
			root.showHideToms(true, true, true);

		// now set the right notes on and off
		if (Stickings && HH && Tom1 && Tom4 && Snare && Kick) {
			setNotesFromURLData("Stickings", Stickings, class_number_of_measures);
			setNotesFromURLData("H", HH, class_number_of_measures);
			setNotesFromURLData("T1", Tom1, class_number_of_measures);
			setNotesFromURLData("T4", Tom4, class_number_of_measures);
			setNotesFromURLData("S", Snare, class_number_of_measures);
			setNotesFromURLData("K", Kick, class_number_of_measures);
		}

		// un-highlight the old div
		unselectButton(document.getElementById("subdivision_" + oldDivision + "ths"));

		// highlight the new div
		selectButton(document.getElementById("subdivision_" + class_time_division + "ths"));

		// This may disable or enable the menu
		setupPermutationMenu();

		// may turn on or off triplets and 1/4 or 1/8th notes based on time signature
		root.setTimeDivisionSelectionOnOrOff();

		// change the time label
		root.setTimeSigLabel();

		// enable or disable swing
		root.myGrooveUtils.swingEnabled(root.myGrooveUtils.doesDivisionSupportSwing(newDivision));
	}

	root.expandAuthoringViewWhenNecessary = function (numNotesPerMeasure, numberOfMeasures) {

		// set the size of the musicalInput authoring element based on the number of notes
		if (numNotesPerMeasure > 16 ||
			(numNotesPerMeasure > 4 && class_number_of_measures > 1) ||
			(class_number_of_measures > 2)) {
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
		var new_notes_per_measure = calc_notes_per_measure((isNewDivisionTriplets ? 48 : 32), class_num_beats_per_measure, class_note_value_per_measure);

		// check for incompatible odd time signature division   9/8 and 1/4notes for instance or 9/16 and 1/8notes
		if ((newDivision * class_num_beats_per_measure / class_note_value_per_measure) % 1 != 0) {
			alert("1/" + newDivision + " notes are disabled in " + class_num_beats_per_measure + "/" + class_note_value_per_measure + " time.  This combination would result in a half note.");
			return;
		}
		if (isNewDivisionTriplets && class_note_value_per_measure != 4) {
			alert("Triplets are disabled in " + class_num_beats_per_measure + "/" + class_note_value_per_measure + " time.  Use x/4 time for triplets.");
			return;
		}

		if (usingTriplets() === isNewDivisionTriplets) {
			// get the encoded notes out of the UI.
			// run through both measures.
			var topIndex = class_notes_per_measure * class_number_of_measures;
			for (var i = 0; i < topIndex; i++) {
				uiStickings += get_sticking_state(i, "URL");
				uiHH += get_hh_state(i, "URL");
				uiTom1 += get_tom_state(i, 1, "URL");
				uiTom4 += get_tom_state(i, 4, "URL");
				uiSnare += get_snare_state(i, "URL");
				uiKick += get_kick_state(i, "URL");
			}

			// override the hi-hat if we are going to a higher division.
			// otherwise the notes get lost in translation (not enough)
			//if (newDivision > class_notes_per_measure)
			//	uiHH = root.myGrooveUtils.GetDefaultHHGroove(new_notes_per_measure, class_num_beats_per_measure, class_note_value_per_measure, class_number_of_measures);
		} else {
			// changing from or changing to a triplet division
			// triplets don't scale well, so use defaults when we change
			uiStickings = GetDefaultStickingsGroove(new_notes_per_measure, class_num_beats_per_measure, class_note_value_per_measure, class_number_of_measures);
			uiHH = GetDefaultHHGroove(new_notes_per_measure, class_num_beats_per_measure, class_note_value_per_measure, class_number_of_measures);
			uiTom1 = GetDefaultTom1Groove(new_notes_per_measure, class_num_beats_per_measure, class_note_value_per_measure, class_number_of_measures);
			uiTom4 = GetDefaultTom4Groove(new_notes_per_measure, class_num_beats_per_measure, class_note_value_per_measure, class_number_of_measures);
			uiSnare = GetDefaultSnareGroove(new_notes_per_measure, class_num_beats_per_measure, class_note_value_per_measure, class_number_of_measures);
			uiKick = GetDefaultKickGroove(new_notes_per_measure, class_num_beats_per_measure, class_note_value_per_measure, class_number_of_measures);

			// reset the metronome click, since it has different options
			root.resetMetronomeOptionsMenuOffsetClick();
		}

		root.expandAuthoringViewWhenNecessary(newDivision, class_number_of_measures);

		changeDivisionWithNotes(newDivision, uiStickings, uiHH, uiTom1, uiTom4, uiSnare, uiKick);

		updateSheetMusic();
	};


	

	

	// public function
	// function to create HTML for the music staff and notes.   We usually want more than one of these
	// baseIndex is the index for the css labels "staff-container1, staff-container2"
	// indexStartForNotes is the index for the note ids.
	root.HTMLforStaffContainer = function (baseindex, indexStartForNotes) {
		var newHTML = ('');

		if (baseindex == 1) // add new measure button
			newHTML += '<span id="addMeasureButtonStart" title="Add measure" onClick="myGrooveWriter.addMeasurePrevButtonClick(event)"><i class="fa fa-plus"></i></span>';
			
		newHTML += ('<div class="staff-container" id="staff-container' + baseindex + '">')
		newHTML += generateStickingContainerHTML(baseindex, indexStartForNotes, class_notes_per_measure, class_num_beats_per_measure, class_note_value_per_measure);

		newHTML += ('  <span class="notes-row-container">')
		newHTML += generateLineLabels(baseindex); // Call the new function where the line labels are needed

		newHTML += ('\				\
								<div class="music-line-container">\
									\
									<div class="notes-container">\
									<div class="staff-line-1"></div>\
									<div class="staff-line-2"></div>\
									<div class="staff-line-3"></div>\
									<div class="staff-line-4"></div>\
									<div class="staff-line-5"></div>\n');

		// backgrounds for highlighting.  Evenly spaced cols of space
		newHTML += ('\
										<div class="background-highlight-container">\
											<div class="opening_note_space"> </div>');
		for (let i = indexStartForNotes; i < class_notes_per_measure + indexStartForNotes; i++) {
			newHTML += ('						<div id="bg-highlight' + i + '" class="bg-highlight" >\
												</div>\n');

			if ((i - (indexStartForNotes - 1)) % noteGroupingSize(class_notes_per_measure, class_num_beats_per_measure, class_note_value_per_measure) === 0 && i < class_notes_per_measure + indexStartForNotes - 1) {
				newHTML += ('<div class="space_between_note_groups"> </div> \n');
			}
		}
		newHTML += ('<div class="end_note_space"></div>\n</div>\n');

		newHTML += generateHiHatContainerHTML(indexStartForNotes, baseindex, class_notes_per_measure, class_num_beats_per_measure, class_note_value_per_measure, indexStartForNotes);
		newHTML += generateTomContainerHTML(indexStartForNotes, baseindex, class_notes_per_measure, class_num_beats_per_measure, class_note_value_per_measure, indexStartForNotes, 1);
		newHTML += generateSnareContainerHTML(indexStartForNotes, baseindex, class_notes_per_measure, class_num_beats_per_measure, class_note_value_per_measure, indexStartForNotes);
		newHTML += generateTomContainerHTML(indexStartForNotes, baseindex, class_notes_per_measure, class_num_beats_per_measure, class_note_value_per_measure, indexStartForNotes, 4);
		newHTML += generateKickContainerHTML(indexStartForNotes, baseindex, class_notes_per_measure, class_num_beats_per_measure, class_note_value_per_measure, indexStartForNotes);
		newHTML += ('\
								</div>\
							</div>\
						</span>\n');

		let repeat = class_repeated_measures.get(baseindex - 1) || 1

		newHTML += generateMeasureButtons(class_number_of_measures, baseindex, repeat);

		return newHTML;
	}; // end function HTMLforStaffContainer


	// a click on a permutation option checkbox
	root.permutationOptionClick = function (event) {

		var optionId = event.target.id;
		var checkbox = document.getElementById(optionId);
		var OnElseOff = checkbox.checked;

		for (var i = 1; i < 5; i++) {
			var subOption = optionId + "_sub" + i;

			checkbox = document.getElementById(subOption);
			if (checkbox)
				checkbox.checked = OnElseOff;
		}

		root.refresh_ABC();
	};

	// a click on a permutation sub option checkbox
	root.permutationSubOptionClick = function (event) {

		var optionId = event.target.id;
		var checkbox = document.getElementById(optionId);
		var OnElseOff = checkbox.checked;

		if (OnElseOff) { // only do this if turning a sub option on
			// remove the "_sub" and the number on the end (the last char)
			var mainOption = optionId.replace("_sub", "").slice(0, -1);

			checkbox = document.getElementById(mainOption);
			if (checkbox)
				checkbox.checked = true;

		}

		root.refresh_ABC();
	};

	

	
	
} // end of class
