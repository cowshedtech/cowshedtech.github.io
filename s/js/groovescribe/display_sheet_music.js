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

		//	<!--   midi.js package for sound   -->
		window.GSLoader.loadjscssfile("../thirdparty/MIDI.js/js/MIDI/AudioDetect.js", "js", root.getLocalScriptRoot());
		window.GSLoader.loadjscssfile("../thirdparty/MIDI.js/js/MIDI/LoadPlugin.js", "js", root.getLocalScriptRoot());
		window.GSLoader.loadjscssfile("../thirdparty/MIDI.js/js/MIDI/Plugin.js", "js", root.getLocalScriptRoot());
		window.GSLoader.loadjscssfile("../thirdparty/MIDI.js/js/MIDI/Player.js", "js", root.getLocalScriptRoot());
		window.GSLoader.loadjscssfile("../thirdparty/MIDI.js/inc/DOMLoader.XMLHttp.js", "js", root.getLocalScriptRoot());
		
		//	<!-- jasmid package midi package required by midi.js above -->
		window.GSLoader.loadjscssfile("../thirdparty/MIDI.js/inc/jasmid/stream.js", "js", root.getLocalScriptRoot());
		window.GSLoader.loadjscssfile("../thirdparty/MIDI.js/inc/jasmid/midifile.js", "js", root.getLocalScriptRoot());
		window.GSLoader.loadjscssfile("../thirdparty/MIDI.js/inc/jasmid/replayer.js", "js", root.getLocalScriptRoot());
		
		// <!-- extras -->
		window.GSLoader.loadjscssfile("../thirdparty/MIDI.js/inc/Base64.js", "js", root.getLocalScriptRoot());
		window.GSLoader.loadjscssfile("../thirdparty/MIDI.js/inc/base64binary.js", "js", root.getLocalScriptRoot());
		
		// //	<!-- jsmidgen -->
		window.GSLoader.loadjscssfile("../thirdparty/jsmidgen.js", "js", root.getLocalScriptRoot());
		
		//	<!-- script to render ABC to an SVG image -->
		window.GSLoader.loadjscssfile("../thirdparty/abc2svg-1.js", "js", root.getLocalScriptRoot());

		//	<!--   our custom JS  -->
		window.GSLoader.loadjscssfile("../../vue/groove_writer.js", "js", root.getLocalScriptRoot());		
		window.GSLoader.loadjscssfile("../../vue/components/DisplaySheetMusic/sheetmusic.js", "js", root.getLocalScriptRoot());		

		window.GSLoader.loadjscssfile("../../vue/components/Track/track.js", "js", root.getLocalScriptRoot());		

		window.GSLoader.loadjscssfile("../../vue/consts.js", "js", root.getLocalScriptRoot());		
		window.GSLoader.loadjscssfile("../../vue/components/Player/image.js", "js", root.getLocalScriptRoot());		
		window.GSLoader.loadjscssfile("../../vue/components/SignatureTime/time_signature.js", "js", root.getLocalScriptRoot());		
		
		window.GSLoader.loadjscssfile("../../vue/helpers/utils.js", "js", root.getLocalScriptRoot());		
		window.GSLoader.loadjscssfile("../../vue/components/Permutations/permutations.js", "js", root.getLocalScriptRoot());		

		window.GSLoader.loadjscssfile("../../vue/components/Options/options.js", "js", root.getLocalScriptRoot());

		window.GSLoader.loadjscssfile("../../vue/helpers/query.js", "js", root.getLocalScriptRoot());
		window.GSLoader.loadjscssfile("../../vue/helpers/url.js", "js", root.getLocalScriptRoot());

		window.GSLoader.loadjscssfile("../../vue/components/Player/player.js", "js", root.getLocalScriptRoot());
		window.GSLoader.loadjscssfile("../../vue/helpers/midi_creater.js", "js", root.getLocalScriptRoot());
		window.GSLoader.loadjscssfile("../../vue/components/Metronome/metronome.js", "js", root.getLocalScriptRoot());

		window.GSLoader.loadjscssfile("../../vue/components/EditorClickable/instruments/kick.js", "js", root.getLocalScriptRoot());
		window.GSLoader.loadjscssfile("../../vue/components/EditorClickable/editorclickable.js", "js", root.getLocalScriptRoot());

		window.GSLoader.loadjscssfile("../../vue/components/Share/groovescribe.js", "js", root.getLocalScriptRoot());
		window.GSLoader.loadjscssfile("../../vue/helpers/abc.js", "js", root.getLocalScriptRoot());		
		window.GSLoader.loadjscssfile("../../vue/components/DisplayMetadata/groovedb.js", "js", root.getLocalScriptRoot());
		window.GSLoader.loadjscssfile("../../vue/helpers/svg.js", "js", root.getLocalScriptRoot());
		window.GSLoader.loadjscssfile("../../vue/helpers/eventBus.js", "js", root.getLocalScriptRoot());

		//
		// Dynamically mount a Vue app (similar to index_musicimageonly2.html).
		//
		root.MountVueAppToElement = function (elementId, mainModulePath) {
			var mountId = elementId || 'vue-app';
			var modulePath = mainModulePath || '../vue/music_image_only.js';
			
			// Ensure import map is present (safe to call multiple times)
			if (!root.__importMapInstalled) {
				window.GSLoader.loadjsmap({
					"imports": {
						"vue": "https://cdn.jsdelivr.net/npm/vue@3/dist/vue.esm-browser.js"
					}
				});
				root.__importMapInstalled = true;
			}
			
			var mod = document.createElement('script');
			mod.setAttribute('type', 'module');
			mod.textContent = [
				"import { createApp } from 'vue';",
				"import Main from '" + modulePath + "';",
				"createApp(Main, {",
				"  midiPlayer: window.midiPlayer,",
				"  eventBus: window.eventBus",
				"}).mount('#" + mountId + "');"
			].join("\n");
			document.getElementsByTagName("head")[0].appendChild(mod);
		};

		root.AddGrooveDisplayToPage = function (elementId) {
			window.addEventListener("load", function () {
				var myGrooveWriter = new GrooveWriter();
				myGrooveWriter.runsOnPageLoad();
				root.MountVueAppToElement(elementId, '../vue/music_image_only.js');
			}, false);
		};		
		
	})(); // end of class GrooveDisplay
} // end if
