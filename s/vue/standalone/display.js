// groove_display.js
// utility functions to support displaying a groove on a page
//
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
/*jslint evil: true */
/*global GrooveUtils, GrooveDisplay */

// GrooveDisplay class.   The only one in this file.
// singleton
if (typeof(GrooveDisplay) === "undefined") {

	var GrooveDisplay = {};

	(function () {
		"use strict";

		var root = GrooveDisplay;

		// list of files already added
		root.filesadded = "";

		root.getLocalScriptRoot = (function () {
			var scripts = document.getElementsByTagName('script');
			var index = scripts.length - 1;
			var myScript = scripts[index];
			var lastSlash = myScript.src.lastIndexOf("/");
			myScript.rootSrc = myScript.src.slice(0, lastSlash + 1);
			return function () {
				return myScript.rootSrc;
			};
		})();

		root.checkloadjscssfile = function (filename, filetype) {
			if (root.filesadded.indexOf("[" + filename + "]") == -1) {
				root.loadjscssfile(filename, filetype);
				root.filesadded += "[" + filename + "]"; //List of files added in the form "[filename1],[filename2],etc"
			} else {
				console.log("file already added!" + filename);
			}
		};

		root.loadjscssfile = function (filename, filetype) {
			if (filename[0] == ".") { // relative pathname
				filename = root.getLocalScriptRoot() + filename;
			}

			if (root.filesadded.indexOf("[" + filename + "]") != -1)
				return; // file already added

			var fileref;
			if (filetype == "js") { //if filename is a external JavaScript file
				fileref = document.createElement('script');
				fileref.setAttribute("type", "text/javascript");
				fileref.setAttribute("src", filename);
			} else if (filetype == "css") { //if filename is an external CSS file
				fileref = document.createElement("link");
				fileref.setAttribute("rel", "stylesheet");
				fileref.setAttribute("type", "text/css");
				fileref.setAttribute("href", filename);
			}
			if (typeof fileref != "undefined")
				document.getElementsByTagName("head")[0].appendChild(fileref);
		};

		//	<!--   midi.js package for sound   -->
		root.loadjscssfile("./js/thirdparty/MIDI.js/js/MIDI/AudioDetect.js", "js");
		root.loadjscssfile("./js/thirdparty/MIDI.js/js/MIDI/LoadPlugin.js", "js");
		root.loadjscssfile("./js/thirdparty/MIDI.js/js/MIDI/Plugin.js", "js");
		root.loadjscssfile("./js/thirdparty/MIDI.js/js/MIDI/Player.js", "js");
		root.loadjscssfile("./js/thirdparty/MIDI.js/inc/DOMLoader.XMLHttp.js", "js");
		//	<!-- jasmid package midi package required by midi.js above -->
		root.loadjscssfile("./js/thirdparty/MIDI.js/inc/jasmid/stream.js", "js");
		root.loadjscssfile("./js/thirdparty/MIDI.js/inc/jasmid/midifile.js", "js");
		root.loadjscssfile("./js/thirdparty/MIDI.js/inc/jasmid/replayer.js", "js");
		//	<!-- extras -->
		root.loadjscssfile("./js/thirdparty/MIDI.js/inc/Base64.js", "js");
		root.loadjscssfile("./js/thirdparty/MIDI.js/inc/base64binary.js", "js");
		//	<!-- jsmidgen -->
		root.loadjscssfile("./js/thirdparty/jsmidgen.js", "js");
		//	<!-- script to render ABC to an SVG image -->
		root.loadjscssfile("./js/thirdparty/abc2svg-1.js", "js");

		//	<!--   our custom JS  -->
		// root.loadjscssfile("./groove_utils.js", "js");

		// stylesheet
		root.loadjscssfile("https://fonts.googleapis.com/css?family=Lato:400,700,300", "css");
		root.loadjscssfile("./font-awesome/4.7.0/css/font-awesome.min.css", "css");
		root.loadjscssfile("./css/groove_display.css", "css");

		root.GrooveDisplayUniqueCounter = 1;

		// time signature looks like this  "4/4", "5/4", "6/8", etc
		// Two numbers separated by a slash
		// return an array with two elements top and bottom in that order
		function parseTimeSignature(timeSig) {

			var timeSigTop = 4;
			var timeSigBottom = 4;

			if (timeSig) {
				var splitResults = timeSig.split("/");

				if (splitResults.length == 2) {
					timeSigTop = Math.ceil(splitResults[0]);
					timeSigBottom = Math.ceil(splitResults[1]);
				}
			}

			return [timeSigTop, timeSigBottom];
		}

		// Used by the GrooveDB to display a groove on a page.
		// Supports multiple grooves on one page as well.
		// shows the groove via SVG sheet music and a midi player
		root.GrooveDBFormatPutGrooveInHTMLElement = function (HtmlTagId, GrooveDBTabIn) {
			var track = new Track();
			var track = new track.trackNew();

			var combinedSnareTab = mergeDrumTabLines(GrooveDBTabIn.snareAccentTab, GrooveDBTabIn.snareOtherTab);
			var combinedKickTab = mergeDrumTabLines(GrooveDBTabIn.kickTab, GrooveDBTabIn.footOtherTab);

			if(GrooveDBTabIn.div !== undefined && !isNaN(GrooveDBTabIn.div)) track.timeDivision = GrooveDBTabIn.div;
			if(GrooveDBTabIn.tempo !== undefined && !isNaN(GrooveDBTabIn.tempo)) track.tempo = GrooveDBTabIn.tempo;
			if(GrooveDBTabIn.swingPercent !== undefined && !isNaN(GrooveDBTabIn.swingPercent)) track.swingPercent = GrooveDBTabIn.swingPercent;
			if(GrooveDBTabIn.measures !== undefined && !isNaN(GrooveDBTabIn.measures)) track.numberOfMeasures = GrooveDBTabIn.measures;
			if(GrooveDBTabIn.notesPerTabMeasure !== undefined && !isNaN(GrooveDBTabIn.notesPerTabMeasure)) track.notesPerMeasure = GrooveDBTabIn.notesPerTabMeasure;
			if(GrooveDBTabIn.stickingTab !== undefined) track.sticking_array = track.noteArraysFromURLData("Stickings", GrooveDBTabIn.stickingTab, GrooveDBTabIn.notesPerTabMeasure, GrooveDBTabIn.measures);
			if(GrooveDBTabIn.hihatTab !== undefined) track.hh_array = track.noteArraysFromURLData("H", GrooveDBTabIn.hihatTab, GrooveDBTabIn.notesPerTabMeasure, GrooveDBTabIn.measures);
			track.snare_array = track.noteArraysFromURLData("S", combinedSnareTab, GrooveDBTabIn.notesPerTabMeasure, GrooveDBTabIn.measures);
			track.kick_array = track.noteArraysFromURLData("K", combinedKickTab, GrooveDBTabIn.notesPerTabMeasure, GrooveDBTabIn.measures);
			if(GrooveDBTabIn.tom1Tab !== undefined) track.toms_array[0] = track.noteArraysFromURLData("T1", GrooveDBTabIn.tom1Tab, GrooveDBTabIn.notesPerTabMeasure, GrooveDBTabIn.measures);
			if(GrooveDBTabIn.tom4Tab !== undefined) track.toms_array[3] = track.noteArraysFromURLData("T4", GrooveDBTabIn.tom4Tab, GrooveDBTabIn.notesPerTabMeasure, GrooveDBTabIn.measures);

			if(GrooveDBTabIn.timeSignature !== undefined) {
				var timeSig = parseTimeSignature(GrooveDBTabIn.timeSignature);
				track.numBeats = timeSig[0];
				track.noteValue = timeSig[1];
			}

			//console.log(track);

			var svgTargetId = "svgTarget" + root.GrooveDisplayUniqueCounter;
			var midiPlayerTargetId = "midiPlayerTarget" + root.GrooveDisplayUniqueCounter;

			// spit out some HTML tags to hold the music and possibly the player
			document.getElementById(HtmlTagId).innerHTML = '' +
				'<div class="Printable"><div id="' + svgTargetId + '" class="svgTarget"  style="display:inline-block"></div></div>\n' +
				'<div class="nonPrintable"><div id="' + midiPlayerTargetId + '" ></div></div>\n';

			var svgTarget = document.getElementById(svgTargetId);
			var renderWidth = svgTarget.offsetWidth - 100;

			var abcNotation = createABCFromGrooveData(track, renderWidth);
			var svgReturn = track.renderABCtoSVG(abcNotation);
			//console.log(abcNotation);

			svgTarget.innerHTML = svgReturn.svg;

			track.setGrooveData(track);

			track.AddMidiPlayerToPage(midiPlayerTargetId, track.notesPerMeasure, true);
			track.expandOrRetractMIDI_playback(true, false); // make it small
			// track.setTempo(track.tempo);
			// track.setSwing(track.swingPercent);
			track.oneTimeInitializeMidi();

			root.GrooveDisplayUniqueCounter++;
		};

		// Add a groove to a page
		root.GrooveDBFormatPutGrooveOnPage = function (GrooveDBTabIn) {
			root.GrooveDisplayUniqueCounter++;

			// add an html Element to hold the grooveDisplay
			var HTMLElementID = 'GrooveDisplay' + root.GrooveDisplayUniqueCounter;
			document.write('<span id="' + HTMLElementID + '"></span>');

			window.addEventListener("load", function () {
				root.GrooveDBFormatPutGrooveInHTMLElement(HTMLElementID, GrooveDBTabIn);
			}, false);
		};

		root.AddGrooveDisplayToElementId = function (HtmlTagId, GrooveDefinition, showPlayer, linkToEditor, expandPlayer) {
			var track = new Track();
			root.GrooveDisplayUniqueCounter++;

			var svgTargetId = "svgTarget" + root.GrooveDisplayUniqueCounter;
			var midiPlayerTargetId = "midiPlayerTarget" + root.GrooveDisplayUniqueCounter;

			document.getElementById(HtmlTagId).innerHTML = '' +
				'<div class="Printable"><div id="' + svgTargetId + '" class="svgTarget" style="display:inline-block"></div></div>\n' +
				'<div class="nonPrintable"><div id="' + midiPlayerTargetId + '"></div></div>\n';

			// load the groove from the URL data if it was passed in.
			var GrooveData = track.getGrooveDataFromUrlString(GrooveDefinition, track.root.trackNew());
			// console.log(GrooveData);

			var layoutFunction = function() {

				var svgTarget = document.getElementById(svgTargetId);
				// var renderWidth = svgTarget.offsetWidth;
				var renderWidth = 600;

				var abcNotation = createABCFromGrooveData(GrooveData, renderWidth);
				// console.log(abcNotation);
				var svgReturn = track.renderABCtoSVG(abcNotation);

				if (linkToEditor)
					svgTarget.innerHTML = '<a style="text-decoration: none" href="http://mikeslessons.com/gscribe/' + GrooveDefinition + '">' + svgReturn.svg + '</a>';
				else
					svgTarget.innerHTML = svgReturn.svg;
			};

			layoutFunction();

			// resize SVG on window resize (not needed now.   We render to 1000 and scale in css)
			//window.addEventListener("resize", layoutFunction);
			//window.addEventListener("beforeprint", layoutFunction);


			if (showPlayer) {
				track.setGrooveData(GrooveData);
				//console.log(GrooveData);

				track.AddMidiPlayerToPage(midiPlayerTargetId, GrooveData.notesPerMeasure, true);
				track.expandOrRetractMIDI_playback(true, expandPlayer); // make it small
				// track.setTempo(GrooveData.tempo);
				// track.setSwing(GrooveData.swingPercent);
				track.setFrequencyDisplay(GrooveData.metronomeFrequency);
				track.oneTimeInitializeMidi();
			}
		};

		// Add a groove to a page
		// URLEncodedGrooveData:  The URL Search data from the Groove Scribe application looks like ?TimeSig=4/4&Div=16&Title=Test...
		// showPlayer:  true/false   true to add the sound player to the page along with the sheet music
		// linkToEditor: true/false  true to add a link back to Groove Scribe on the sheet music
		// expandPlayer: true/false  true to have the sound player be full width by default.
		root.AddGrooveDisplayToPage = function (URLEncodedGrooveData, showPlayer, linkToEditor, expandPlayer) {
			root.GrooveDisplayUniqueCounter++;

			// add an html Element to hold the grooveDisplay
			var HTMLElementID = 'GrooveDisplay' + root.GrooveDisplayUniqueCounter;
			var GrooveDisplayElement = document.createElement("div");
			GrooveDisplayElement.class = "GrooveDisplay";
			GrooveDisplayElement.id = HTMLElementID;
			document.getElementsByTagName("body")[0].appendChild(GrooveDisplayElement);

			window.addEventListener("load", function () {
				root.AddGrooveDisplayToElementId(HTMLElementID, URLEncodedGrooveData, showPlayer, linkToEditor, expandPlayer);
			}, false);
		};
	})(); // end of class GrooveDisplay
} // end if
