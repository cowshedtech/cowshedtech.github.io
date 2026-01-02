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

// Configuration constants
const VUE_ESM_BROWSER_URL = "https://cdn.jsdelivr.net/npm/vue@3/dist/vue.esm-browser.js";

// GrooveDisplay class.   The only one in this file.
// singleton
if (typeof(GrooveDisplay) === "undefined") {

	var GrooveDisplay = {};

	(function () {
		"use strict";

		var root = GrooveDisplay;

		// Cache base root to avoid repeated DOM inspection
		var baseRoot = window.GSLoader.getLocalScriptRoot();

		//	<!--   midi.js package for sound   -->
		window.GSLoader.loadjscssfile("../thirdparty/MIDI.js/js/MIDI/AudioDetect.js", "js", baseRoot);
		window.GSLoader.loadjscssfile("../thirdparty/MIDI.js/js/MIDI/LoadPlugin.js", "js", baseRoot);
		window.GSLoader.loadjscssfile("../thirdparty/MIDI.js/js/MIDI/Plugin.js", "js", baseRoot);
		window.GSLoader.loadjscssfile("../thirdparty/MIDI.js/js/MIDI/Player.js", "js", baseRoot);
		window.GSLoader.loadjscssfile("../thirdparty/MIDI.js/inc/DOMLoader.XMLHttp.js", "js", baseRoot);
		
		//	<!-- script to render ABC to an SVG image -->
		window.GSLoader.loadjscssfile("../thirdparty/abc2svg-1.js", "js", baseRoot);

		//	<!--   our custom JS  -->
		window.GSLoader.loadjscssfile("../../vue/consts.js", "js", baseRoot);		
		window.GSLoader.loadjscssfile("../../vue/groove_writer.js", "js", baseRoot);	
		window.GSLoader.loadjscssfile("../../vue/helpers/abc.js", "js", baseRoot);			
		window.GSLoader.loadjscssfile("../../vue/helpers/midi_creater.js", "js", baseRoot);
		window.GSLoader.loadjscssfile("../../vue/helpers/eventBus.js", "js", baseRoot);
		window.GSLoader.loadjscssfile("../../vue/helpers/query.js", "js", baseRoot);
		window.GSLoader.loadjscssfile("../../vue/helpers/url.js", "js", baseRoot);
		window.GSLoader.loadjscssfile("../../vue/helpers/utils.js", "js", baseRoot);		
		window.GSLoader.loadjscssfile("../../vue/helpers/svg.js", "js", baseRoot);
		window.GSLoader.loadjscssfile("../../vue/components/DisplaySheetMusic/sheetmusic.js", "js", baseRoot);		
		window.GSLoader.loadjscssfile("../../vue/components/Track/track.js", "js", baseRoot);		
		window.GSLoader.loadjscssfile("../../vue/components/Player/image.js", "js", baseRoot);		
		window.GSLoader.loadjscssfile("../../vue/components/SignatureTime/time_signature.js", "js", baseRoot);				
		window.GSLoader.loadjscssfile("../../vue/components/Permutations/permutations.js", "js", baseRoot);		
		window.GSLoader.loadjscssfile("../../vue/components/Options/options.js", "js", baseRoot);
		window.GSLoader.loadjscssfile("../../vue/components/Player/player.js", "js", baseRoot);
		window.GSLoader.loadjscssfile("../../vue/components/Metronome/metronome.js", "js", baseRoot);
		window.GSLoader.loadjscssfile("../../vue/components/EditorClickable/instruments/kick.js", "js", baseRoot);
		window.GSLoader.loadjscssfile("../../vue/components/EditorClickable/editorclickable.js", "js", baseRoot);
		window.GSLoader.loadjscssfile("../../vue/components/Share/groovescribe.js", "js", baseRoot);
		window.GSLoader.loadjscssfile("../../vue/components/DisplayMetadata/groovedb.js", "js", baseRoot);
		
		//
		// Dynamically mount a Vue app (similar to index_musicimageonly2.html).
		//
		root.MountVueAppToElement = function (elementId, mainModulePath) {
			var mountId = elementId || 'vue-app';
			var modulePath = mainModulePath || '../vue/standalone/main_sheet_music.js';
			
			// Ensure import map is present (safe to call multiple times)
			if (!root.__importMapInstalled) {
				window.GSLoader.loadjsmap({
					"imports": {
						"vue": VUE_ESM_BROWSER_URL
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
				root.MountVueAppToElement(elementId, '../vue/standalone/main_sheet_music.js');
			}, false);
		};		
		
	})(); // end of class GrooveDisplay
} // end if
