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
/*global MIDI, constant_MAX_MEASURES, constant_DEFAULT_TEMPO, constant_ABC_STICK_R, constant_ABC_STICK_L, constant_ABC_STICK_BOTH, constant_ABC_STICK_COUNT, constant_ABC_HH_Ride, constant_ABC_HH_Ride_Bell, constant_ABC_HH_Cow_Bell, constant_ABC_HH_Crash, constant_ABC_HH_Stacker, constant_ABC_HH_Open, constant_ABC_HH_Close, constant_ABC_HH_Accent, constant_ABC_HH_Normal, constant_ABC_SN_Ghost, constant_ABC_SN_Accent, constant_ABC_SN_Normal, constant_ABC_SN_XStick, constant_ABC_SN_Buzz, constant_ABC_SN_Flam, constant_ABC_SN_Drag, constant_ABC_KI_SandK, constant_ABC_KI_Splash, constant_ABC_KI_Normal, constant_ABC_T1_Normal, constant_ABC_T2_Normal, constant_ABC_T3_Normal, constant_ABC_T4_Normal, constant_NUMBER_OF_TOMS, constant_ABC_OFF, constant_OUR_MIDI_VELOCITY_NORMAL, constant_OUR_MIDI_VELOCITY_ACCENT, constant_OUR_MIDI_VELOCITY_GHOST, constant_OUR_MIDI_METRONOME_1, constant_OUR_MIDI_METRONOME_NORMAL, constant_OUR_MIDI_HIHAT_NORMAL, constant_OUR_MIDI_HIHAT_OPEN, constant_OUR_MIDI_HIHAT_ACCENT, constant_OUR_MIDI_HIHAT_CRASH, constant_OUR_MIDI_HIHAT_STACKER, constant_OUR_MIDI_HIHAT_RIDE, constant_OUR_MIDI_HIHAT_FOOT, constant_OUR_MIDI_SNARE_NORMAL, constant_OUR_MIDI_SNARE_ACCENT, constant_OUR_MIDI_SNARE_GHOST, constant_OUR_MIDI_SNARE_XSTICK, constant_OUR_MIDI_SNARE_XSTICK, constant_OUR_MIDI_SNARE_FLAM, onstant_OUR_MIDI_SNARE_DRAG, constant_OUR_MIDI_KICK_NORMAL, constant_OUR_MIDI_TOM1_NORMAL, constant_OUR_MIDI_TOM2_NORMAL, constant_OUR_MIDI_TOM4_NORMAL, constant_OUR_MIDI_TOM4_NORMAL */

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
	let debugMode = parseInt(getQueryVariableFromURL("Debug", "0"), 10);
	if (debugMode !== 0) options.debugMode = true;

	let grooveDBAuthoring = parseInt(getQueryVariableFromURL("GDB_Author", "0"), 10);
	if (grooveDBAuthoring !== 0) options.grooveDBAuthoring = true;

	/*
	 * This function initializes the data for the groove Scribe web page
	 */	
	root.runsOnPageLoad = function () {

		// load the groove from URL data
		getGrooveDataFromUrlString(window.location.search, root.track, options, midiPlayer, metronome, options.debugMode);
		editorClickable.update(root.track);
		sheetMusic.updateFromTrack(root.track);

		eventBus.$on('options-updated', () => {
			if (!options.isHighlightOn()) {
				sheetMusic.clearHighlight();
				editorClickable.clearHighlight();
			}
			//sheetMusic.updateFromTrack(editor.track);
			updateCurrentURL();
		});
		
		eventBus.$on('track-updated', () => {
			updateCurrentURL(); 
			sheetMusic.updateFromTrack(editor.track);
			midiPlayer.noteHasChanged();
			editorClickable.update(editor.track);
		})
		
		eventBus.$on('metronome-updated', () => {
			if (midiPlayer) midiPlayer.noteHasChanged();
			updateCurrentURL();      
		})
	
		// If the midiplayer changes then update all the dependent components		
		midiPlayer.eventCallbacks = new midiEventCallbackClass();		
		eventBus.$on(EventTypes.PARAMETERS_UPDATE, () => {
			// if there is a timeout running clear it
			if (this.changeCallbackTimeout != null)
				window.clearTimeout(this.changeCallbackTimeout);

			// set a new timeout
			this.changeCallbackTimeout = window.setTimeout(function () {
				this.changeCallbackTimeout = null
				updateCurrentURL();
			}, 300);
		})

		eventBus.$on(EventTypes.PLAY_STATE, () => {
			if (midiPlayer.getState() == PlayerState.STOPPED) {
				sheetMusic.stop();
				editorClickable.stop();
			}
		})

		eventBus.$on(EventTypes.PLAY_PROGRESS, (data) => {
			if (data?.percentComplete && options.highlightOn) {
				sheetMusic.highlightNote(data.percentComplete)			
				editorClickable.hilight_note(null, data?.percentComplete, root.class_permutation_type, root.track.numBeats, root.track.noteValue, root.track.numberOfMeasures, root.track.notesPerMeasure, root.track.repeatedMeasures, usingTriplets());
			} 
		})

		eventBus.$on(EventTypes.LOAD_MIDI, (data) => {
			var midiURL;

			if (data?.playStarting && metronome.getCountInActive()) {
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
		})

		
		midiPlayer.initialise();

		// enable or disable swing
		// midiPlayer.swingEnabled(midiPlayer.doesDivisionSupportSwing(root.track.notesPerMeasure));

		root.browserInfo = getBrowserInfo();
		if (root.browserInfo.browser == "MSIE" && root.browserInfo.version < 10) {
			window.alert("This browser has been detected as: " + root.browserInfo.browser + " ver: " + root.browserInfo.version + ".\n" + 'This version of IE is unsupported.   Please use Chrome or Firefox instead');
		} else if (root.browserInfo.browser == "Safari" && root.browserInfo.platform == "windows" && root.browserInfo.version < 535) {
			window.alert("This browser has been detected as: " + root.browserInfo.browser + " ver: " + root.browserInfo.version + ".\n" + 'This version of Safari is unsupported.   Please use Chrome instead');
		}
		
		if (isTouchDevice()) {
			setTimeout(function () {
				window.scrollTo(0, 1);
			}, 1000);
		}		
	};

	
	// get a really long URL that encodes all of the notes and the rest of the state of the page.
	// this will allow us to bookmark or reference a groove and handle undo/redo.
	//
	root.get_FullURLForPage= function (url_destination) {
		// var track = grooveDataFromClickableUI()
		return getUrlStringFromGrooveData(editor.track, options, midiPlayer, metronome, url_destination)
	}
	

	root.updateFromURL = function (encodedURLData) {

		var track = getGrooveDataFromUrlString(encodedURLData, root.track, options, midiPlayer, metronome, options.debugMode);
		editorClickable.update(editor.track);

		root.changeDivisionWithNotes(track.timeDivision);			
	}

} // end of class
