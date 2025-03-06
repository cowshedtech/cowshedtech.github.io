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

// GrooveWriter class.   The only one in this file.

/*jslint browser:true devel:true */
/*global Abc, MIDI, Midi */

var global_num_GrooveUtilsCreated = 0;
var global_midiInitialized = false;



// GrooveUtils class.   The only one in this file.
function GrooveUtils() {
	"use strict";

	global_num_GrooveUtilsCreated++; // should increment on every new

	var root = this;

	root.abc_obj = null;

	
	// array that can be used to map notes to the SVG generated by abc2svg
	root.note_mapping_array = null;

	// debug & special view
	root.debugMode = false;
	root.viewMode = true;  // by default to prevent screen flicker
	root.grooveDBAuthoring = false;

	// midi state variables
	root.isMIDIPaused = false;
	root.shouldMIDIRepeat = true;
	root.swingIsEnabled = false;
	root.grooveUtilsUniqueIndex = global_num_GrooveUtilsCreated;

	// metronome options
	// root.metronomeSolo = false;
	// root.metronomeOffsetClickStart = "1";
	// start with last in the rotation so the next rotation brings it to '1'
	// root.metronomeOffsetClickStartRotation = 0;

	root.isLegendVisable = false;

	// integration with third party components
	root.noteCallback = null;  //function triggered when a note is played
	root.playEventCallback = null;  //triggered when the play button is pressed
	root.repeatCallback = null;  //triggered when a groove is going to be repeated
	root.tempoChangeCallback = null;  //triggered when the tempo changes.  ARG1 is the new Tempo integer (needs to be very fast, it can get called a lot of times from the slider)

	var class_empty_note_array = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];

	root.visible_context_menu = false; // a single context menu can be visible at a time.

	root.grooveDataNew = function () {
		this.notesPerMeasure = 16;
		this.timeDivision = 16;
		this.numberOfMeasures = 1;
		this.numBeats = 4;  // TimeSigTop: Top part of Time Signture 3/4, 4/4, 5/4, 6/8, etc...
		this.noteValue = 4; // TimeSigBottom: Bottom part of Time Sig   4 = quarter notes, 8 = 8th notes, 16ths, etc..
		this.sticking_array = class_empty_note_array.slice(0); // copy by value
		this.hh_array = class_empty_note_array.slice(0);    // copy by value
		this.snare_array = class_empty_note_array.slice(0); // copy by value
		this.kick_array = class_empty_note_array.slice(0);  // copy by value
		// toms_array contains 4 toms  T1, T2, T3, T4 index starting at zero
		this.toms_array = [class_empty_note_array.slice(0), class_empty_note_array.slice(0), class_empty_note_array.slice(0), class_empty_note_array.slice(0)];
		this.showToms = false;
		this.showStickings = false;
		this.title = "";
		this.author = "";
		this.comments = "";
		this.showLegend = false;
		this.swingPercent = 0;
		this.tempo = constant_DEFAULT_TEMPO;
		this.kickStemsUp = true;
		this.metronomeFrequency = 0; // 0, 4, 8, 16
		this.debugMode = root.debugMode;
		this.grooveDBAuthoring = root.grooveDBAuthoring;
		this.viewMode = root.viewMode;
		this.repeatedMeasures = new Map();
		this.highlightOn = true;
	};

	root.myGrooveData = root.grooveDataNew();




	

	

	

	

	

	
	
	this.abcToSVGCallback = new SVGLibCallback(this); // singleton


	



	

	

	// ******************************************************************************************************************
	// ******************************************************************************************************************
	//
	// MIDI functions
	//
	// ******************************************************************************************************************
	// ******************************************************************************************************************
	

	

	// set a URL for midi playback.
	// useful for static content, so you don't have to override the loadMidiDataEvent callback
	root.setGrooveData = function (grooveData) {
		root.myGrooveData = grooveData;
	};

	

	
	

	this.midiEventCallbacks = new midiEventCallbackClass(root);


	

	
	

	root.getTempo = function () {
		var tempoInput = document.getElementById("tempoInput" + root.grooveUtilsUniqueIndex);
		var tempo = constant_DEFAULT_TEMPO;

		if (tempoInput) {
			tempo = parseInt(tempoInput.value, 10);
			if (tempo < 19 && tempo > 281)
				tempo = constant_DEFAULT_TEMPO;
		}

		return tempo;
	};

	// we need code to make the range slider colors update properly
	function updateRangeSlider(sliderID) {

		var slider = document.getElementById(sliderID);
		var programaticCSSRules = document.getElementById(sliderID + "CSSRules");
		if (!programaticCSSRules) {
			// create a new one.
			programaticCSSRules = document.createElement('style');
			programaticCSSRules.id = sliderID + "CSSRules";
			document.body.appendChild(programaticCSSRules);
		}

		var style_before = document.defaultView.getComputedStyle(slider, ":before");
		var style_after = document.defaultView.getComputedStyle(slider, ":after");
		var before_color = style_before.getPropertyValue('color');
		var after_color = style_after.getPropertyValue('color');

		// change the before and after colors of the slider using a gradiant
		var percent = Math.ceil(((slider.value - slider.min) / (slider.max - slider.min)) * 100);

		var new_style_str = '#' + sliderID + '::-moz-range-track' + '{ background: -moz-linear-gradient(left, ' + before_color + ' ' + percent + '%, ' + after_color + ' ' + percent + '%)}\n';
		new_style_str += '#' + sliderID + '::-webkit-slider-runnable-track' + '{ background: -webkit-linear-gradient(left, ' + before_color + ' ' + '0%, ' + before_color + ' ' + percent + '%, ' + after_color + ' ' + percent + '%)}\n';
		programaticCSSRules.textContent = new_style_str;

	}

	// update the tempo string display
	// called by the oninput handler everytime the range slider changes
	root.tempoUpdate = function (tempo) {
		document.getElementById('tempoTextField' + root.grooveUtilsUniqueIndex).value = "" + tempo;

		updateRangeSlider('tempoInput' + root.grooveUtilsUniqueIndex);
		midiNoteHasChanged(root);

		if (root.tempoChangeCallback)
			root.tempoChangeCallback(tempo);
	};

	root.tempoUpdateFromTextField = function (event) {
		var newTempo = event.target.value;

		document.getElementById("tempoInput" + root.grooveUtilsUniqueIndex).value = newTempo;
		root.tempoUpdate(newTempo);
	};

	// update the tempo string display
	root.tempoUpdateFromSlider = function (event) {
		root.tempoUpdate(event.target.value);
	};

	// I love the pun here.  :)
	// nudge the tempo up by 1
	root.upTempo = function () {
		var tempo = root.getTempo();

		tempo++;

		root.setTempo(tempo);
	};

	// nudge the tempo down by 1
	root.downTempo = function () {
		var tempo = root.getTempo();

		tempo--;

		root.setTempo(tempo);
	};

	root.setTempo = function (newTempo) {
		if (newTempo < 19 && newTempo > 281)
			return;

		document.getElementById("tempoInput" + root.grooveUtilsUniqueIndex).value = newTempo;
		root.tempoUpdate(newTempo);
	};

	root.doesDivisionSupportSwing = function (division) {

		if (isTripletDivision(division) || division == 4)
			return false;

		return true;
	};

	root.setSwingSlider = function (newSetting) {
		document.getElementById("swingInput" + root.grooveUtilsUniqueIndex).value = newSetting;
		updateRangeSlider('swingInput' + root.grooveUtilsUniqueIndex);
	};

	root.swingEnabled = function (trueElseFalse) {

		root.swingIsEnabled = trueElseFalse;

		if (root.swingIsEnabled === false) {
			root.setSwing(0);
		} else {
			root.swingUpdateText(root.getSwing()); // remove N/A label
		}
	};

	root.getSwing = function () {
		var swing = 0;

		if (root.swingIsEnabled) {
			var swingInput = document.getElementById("swingInput" + root.grooveUtilsUniqueIndex);

			if (swingInput) {
				swing = parseInt(swingInput.value, 10);
				if (swing < 0 || swing > 60)
					swing = 0;
			}
		}

		return (swing);
	};

	// used to update the on screen swing display
	// also the onClick handler for the swing slider
	root.swingUpdateText = function (swingAmount) {

		if (root.swingIsEnabled === false) {
			document.getElementById('swingOutput' + root.grooveUtilsUniqueIndex).innerHTML = "N/A";
		} else {
			document.getElementById('swingOutput' + root.grooveUtilsUniqueIndex).innerHTML = "" + swingAmount + "%";
			root.swingPercent = swingAmount;
			midiNoteHasChanged(root);
		}

	};

	root.setSwing = function (swingAmount) {
		if (root.swingIsEnabled === false)
			swingAmount = 0;

		root.setSwingSlider(swingAmount);

		root.swingUpdateText(swingAmount);  // update the output
	};

	root.swingUpdateEvent = function (event) {

		if (root.swingIsEnabled === false) {
			root.setSwingSlider(0);
		} else {
			root.swingUpdateText(event.target.value);
			updateRangeSlider('swingInput' + root.grooveUtilsUniqueIndex);
		}
	};

	root.setMetronomeFrequencyDisplay = function (newFrequency) {
		var mm = document.getElementById('midiMetronomeMenu' + root.grooveUtilsUniqueIndex);

		if (mm) {
			mm.className = mm.className.replace(" selected", "");

			if (newFrequency > 0) {
				mm.className += " selected";
			}
		}
	};

	// open a new tab with GrooveScribe with the current groove
	root.loadFullScreenGrooveScribe = function () {
		var fullURL = getUrlStringFromGrooveData(root.myGrooveData, 'fullGrooveScribe')

		var win = window.open(fullURL, '_blank');
		win.focus();
	};


	// turn the metronome on and off
	root.metronomeMiniMenuClick = function () {
		if (root.myGrooveData.metronomeFrequency > 0)
			root.myGrooveData.metronomeFrequency = 0;
		else
			root.myGrooveData.metronomeFrequency = 4;

		root.setMetronomeFrequencyDisplay(root.myGrooveData.metronomeFrequency);
		midiNoteHasChanged(root);
	};

	





	

	

} // end of class
