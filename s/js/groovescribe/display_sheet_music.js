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
const VUE_ESM_BROWSER_URL = "https://cdn.jsdelivr.net/npm/vue@3/dist/vue.esm-browser.prod.js";
// Resolved with GSLoader.getLocalScriptRoot() (groovescribe/), not the HTML document — so any page path works.
const MAIN_SHEET_MUSIC_MODULE_PATH = "../../vue/standalone/main_sheet_music.js";
// Same as above but also renders the MIDI player controls.
const MAIN_GROOVE_DISPLAY_MODULE_PATH = "../../vue/standalone/main_groove_display.js";

var sheetMusic;
var abcToSVGCallback;

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
		//	<!-- jasmid package required by midi.js Player to parse/play MIDI -->
		window.GSLoader.loadjscssfile("../thirdparty/MIDI.js/inc/jasmid/stream.js", "js", baseRoot);
		window.GSLoader.loadjscssfile("../thirdparty/MIDI.js/inc/jasmid/midifile.js", "js", baseRoot);
		window.GSLoader.loadjscssfile("../thirdparty/MIDI.js/inc/jasmid/replayer.js", "js", baseRoot);
		window.GSLoader.loadjscssfile("../thirdparty/MIDI.js/inc/Base64.js", "js", baseRoot);
		window.GSLoader.loadjscssfile("../thirdparty/MIDI.js/inc/base64binary.js", "js", baseRoot);
		//	<!-- jsmidgen for generating the MIDI file we play -->
		window.GSLoader.loadjscssfile("../thirdparty/jsmidgen.js", "js", baseRoot);

		//	<!-- script to render ABC to an SVG image -->
		window.GSLoader.loadjscssfile("../thirdparty/abc2svg-1.js", "js", baseRoot);

		//	<!-- styles for the sheet music and MIDI player controls -->
		window.GSLoader.loadjscssfile("../../font-awesome/4.7.0/css/font-awesome.min.css", "css", baseRoot);
		window.GSLoader.loadjscssfile("../../css/groove_display_orange.css", "css", baseRoot);

		//	<!--   our custom JS  -->
		window.GSLoader.loadjscssfile("../../vue/consts.js", "js", baseRoot);		
		// window.GSLoader.loadjscssfile("../../vue/groove_writer.js", "js", baseRoot);	
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
		
		// --- Multi-instance support --------------------------------------------
		// Several groove displays can share one page (see GrooveMultiDisplay.html).
		// Each gets its own track/options/sheetMusic/midiPlayer/metronome. The shared
		// abc2svg + MIDI helpers read module globals, so we "activate" an instance
		// (swap those globals onto it) right before rendering or building its MIDI.
		root.__instances = {};
		root.__instanceCounter = 0;   // unique id per instance
		root.__instanceCount = 0;     // how many are live (used to scope global key handlers)
		root.__divCounter = 0;        // unique id per auto-created mount div

		// Point the shared globals at a given instance.
		root.activateInstance = function (inst) {
			if (!inst) return;
			window.track = inst.track;
			window.options = inst.options;
			window.metronome = inst.metronome;
			window.midiPlayer = inst.midiPlayer;
			sheetMusic = inst.sheetMusic;
			window.sheetMusic = inst.sheetMusic;
			abcToSVGCallback = inst.abcToSVGCallback;
			window.abcToSVGCallback = inst.abcToSVGCallback;
			window.editor = inst.editor;
			window.GROOVE_DISPLAY_RENDER_WIDTH = inst.renderWidth;
		};

		// Load the MIDI.js soundfont/plugin exactly once for the whole page, then run
		// every queued callback (each player marks itself ready in its callback).
		root.ensureMidiLoaded = function (cb) {
			if (root.__midiLoaded) { if (cb) cb(); return; }
			root.__midiLoadCallbacks = root.__midiLoadCallbacks || [];
			if (cb) root.__midiLoadCallbacks.push(cb);
			if (root.__midiLoading) return;
			root.__midiLoading = true;
			MIDI.loadPlugin({
				soundfontUrl: getGrooveUtilsBaseLocation() + "../js/thirdparty/soundfont/",
				instruments: ["gunshot"],
				callback: function () {
					MIDI.programChange(9, 127); // "Gunshot" instrument (re-used for drums)
					root.__midiLoaded = true;
					root.__midiLoading = false;
					var cbs = root.__midiLoadCallbacks || [];
					root.__midiLoadCallbacks = [];
					for (var i = 0; i < cbs.length; i++) {
						try { cbs[i](); } catch (e) { /* ignore */ }
					}
				}
			});
		};

		// Build a fully self-contained groove instance and decode its groove data.
		function createInstance(grooveDefinition, showPlayer, renderWidth) {
			var id = ++root.__instanceCounter;
			var track = new Track();
			var options = new Options();
			var metronome = new Metronome();
			var midiPlayer = new MIDIPlayer(track.trackID);
			if (typeof midiEventCallbackClass === "function") {
				midiPlayer.eventCallbacks = new midiEventCallbackClass();
			}
			var sm = new SheetMusic();
			var abcCb = new SVGLibCallback(track);

			var inst = {
				id: id,
				track: track,
				options: options,
				metronome: metronome,
				midiPlayer: midiPlayer,
				sheetMusic: sm,
				abcToSVGCallback: abcCb,
				editor: { track: track, class_permutation_type: "none" },
				showPlayer: !!showPlayer,
				renderWidth: (typeof renderWidth === "number" && renderWidth > 0) ? renderWidth : 0
			};
			root.__instances[id] = inst;
			root.__instanceCount++;

			// Decode the groove straight into this instance's objects (also applies
			// tempo/swing/metronome onto the player + metronome). No globals needed here.
			getGrooveDataFromUrlString(grooveDefinition, track, options, midiPlayer, metronome, options.debugMode);

			return inst;
		}

		//
		// Dynamically mount a Vue app for one instance.
		// The instance id is baked into the module text so there's no window.track
		// race when several displays mount around the same time.
		//
		root.MountVueAppToElement = function (elementId, inst, mainModulePath) {
			var mountId = elementId || 'vue-app';
			var rel = mainModulePath || MAIN_SHEET_MUSIC_MODULE_PATH;
			var moduleUrl = /^https?:\/\//i.test(rel) ? rel : new URL(rel, window.GSLoader.getLocalScriptRoot()).href;
			
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
				"import { createApp, reactive } from 'vue';",
				"import Main from '" + moduleUrl + "';",
				"const inst = window.GrooveDisplay.__instances[" + inst.id + "];",
				"const reactiveTrack = reactive(inst.track);",
				"inst.track = reactiveTrack;",
				"inst.editor.track = reactiveTrack;",
				"window.GrooveDisplay.activateInstance(inst);",
				"const app = createApp(Main, { track: reactiveTrack, instanceId: " + inst.id + " });",				
				"app.mount('#" + mountId + "');"
			].join("\n");
			document.getElementsByTagName("head")[0].appendChild(mod);
		};

		function grooveDisplayDepsReady(needPlayer) {
			var baseReady = typeof Track !== "undefined"
				&& typeof SheetMusic !== "undefined"
				&& typeof getGrooveDataFromUrlString === "function"
				&& typeof SVGLibCallback !== "undefined"
				&& typeof Abc !== "undefined"
				&& typeof Options !== "undefined";
			if (!needPlayer) return baseReady;
			return baseReady
				&& typeof MIDIPlayer === "function"
				&& typeof Metronome === "function"
				&& typeof createMidiUrlFromClickableUI === "function"
				&& typeof Midi !== "undefined";
		}

		function mountGrooveDisplayWhenReady(elementId, grooveDefinition, showPlayer, renderWidth, attempt) {
			attempt = attempt || 0;
			if (!grooveDisplayDepsReady(showPlayer)) {
				if (attempt > 400) {
					console.error("GrooveDisplay: timed out waiting for groove scripts (check Network tab for failed JS).");
					return;
				}
				window.setTimeout(function () {
					mountGrooveDisplayWhenReady(elementId, grooveDefinition, showPlayer, renderWidth, attempt + 1);
				}, 25);
				return;
			}

			var inst = createInstance(grooveDefinition, showPlayer, renderWidth);
			var modulePath = showPlayer ? MAIN_GROOVE_DISPLAY_MODULE_PATH : MAIN_SHEET_MUSIC_MODULE_PATH;
			root.MountVueAppToElement(elementId, inst, modulePath);
		}

		// Resolve the mount element id. When no usable element exists we create a div
		// and append it to the body *now* (at script-execution time) so auto-created
		// displays land inline at the script's position, matching the reference page.
		function resolveOrCreateMountElement(elementId) {
			if (elementId && document.getElementById(elementId)) {
				return elementId;
			}
			var id = elementId || ('GrooveDisplay_' + (++root.__divCounter));
			var div = document.createElement('div');
			div.id = id;
			div.className = 'GrooveDisplay groove-display';
			var body = document.body || document.getElementsByTagName('body')[0];
			if (body) body.appendChild(div);
			return id;
		}

		// Add a groove display to the page.
		//   elementId:        id of an existing element to mount into. If it doesn't exist
		//                     (or is omitted), a div is created inline at the call site so
		//                     several displays can be stacked on one page.
		//   grooveDefinition: optional URL-encoded groove string (e.g. "TimeSig=4/4&Div=16&H=|...").
		//                     When omitted, the groove is read from the page's window.location.search.
		//   showPlayer:       optional boolean. When true, the MIDI player controls are rendered
		//                     beneath the sheet music. Defaults to false (sheet music only).
		//   renderWidth:      optional SVG render width in px. Defaults to 600 (matches the
		//                     standalone GrooveScribe display). Pass 0 to render responsively
		//                     at the container width instead.
		root.AddGrooveDisplayToPage = function (elementId, grooveDefinition, showPlayer, renderWidth) {
			var grooveDef = (typeof grooveDefinition === "string" && grooveDefinition.length > 0)
				? grooveDefinition
				: window.location.search;
			// getQueryVariableFromString() strips the first character (the leading "?"),
			// so make sure a hardcoded groove string has one to avoid dropping a real param.
			if (grooveDef && grooveDef.charAt(0) !== "?") {
				grooveDef = "?" + grooveDef;
			}
			var width = (typeof renderWidth === "number") ? renderWidth : 600;

			// Create/resolve the mount element synchronously so inline ordering is preserved.
			var mountId = resolveOrCreateMountElement(elementId);

			function kick() {
				mountGrooveDisplayWhenReady(mountId, grooveDef, !!showPlayer, width, 0);
			}
			if (document.readyState === "complete") {
				kick();
			} else {
				window.addEventListener("load", kick, false);
			}
		};

		// --- GrooveDB tab format -------------------------------------------------
		// The GrooveDB stores grooves as separate drum-tab lines (hihatTab, snareAccentTab,
		// snareOtherTab, kickTab, footOtherTab, optional tom1Tab/tom4Tab) at a fixed
		// "notesPerTabMeasure" resolution, rather than the URL groove format. Convert such an
		// object into the URL groove string that AddGrooveDisplayToPage understands.
		//
		// In the current pipeline notesPerMeasure = (Div / timeSigBottom) * timeSigTop, so we
		// pick Div = notesPerTabMeasure * timeSigBottom / timeSigTop to preserve the tab's
		// resolution exactly (32 for straight grooves, 24 for triplet grooves, etc.).
		function grooveDBTabToUrlString(tab) {
			var timeSig = parseTimeSigString(tab.timeSignature || "4/4");
			var top = timeSig[0];
			var bottom = timeSig[1];

			var measures = (tab.measures && !isNaN(tab.measures)) ? tab.measures : 1;

			var hihat = tab.hihatTab || "";
			// Derive the tab resolution if it wasn't supplied.
			var notesPerTabMeasure = (tab.notesPerTabMeasure && !isNaN(tab.notesPerTabMeasure))
				? tab.notesPerTabMeasure
				: Math.max(1, Math.round(hihat.length / measures));

			var div = Math.round(notesPerTabMeasure * bottom / top);
			if (!div || isNaN(div) || div < 1) div = notesPerTabMeasure || 16;

			var snare = mergeDrumTabLines(tab.snareAccentTab || "", tab.snareOtherTab || "");
			var kick = mergeDrumTabLines(tab.kickTab || "", tab.footOtherTab || "");

			var url = 'Mode=view'
				+ '&TimeSig=' + top + '/' + bottom
				+ '&Div=' + div
				+ '&Tempo=' + ((tab.tempo && !isNaN(tab.tempo)) ? tab.tempo : 80)
				+ '&Measures=' + measures;

			if (tab.swingPercent !== undefined && !isNaN(tab.swingPercent)) {
				url += '&Swing=' + tab.swingPercent;
			}

			// Encode the tab lines so special characters (notably "+" for foot/splash, which
			// URLSearchParams would otherwise turn into a space) survive query parsing.
			url += '&H=|' + encodeURIComponent(hihat);
			url += '&S=|' + encodeURIComponent(snare);
			url += '&K=|' + encodeURIComponent(kick);
			if (tab.tom1Tab !== undefined) url += '&T1=|' + encodeURIComponent(tab.tom1Tab);
			if (tab.tom4Tab !== undefined) url += '&T4=|' + encodeURIComponent(tab.tom4Tab);

			return url;
		}

		// Render a GrooveDB-tab groove into a specific element.
		root.GrooveDBFormatPutGrooveInHTMLElement = function (elementId, grooveDBTabIn, showPlayer) {
			root.AddGrooveDisplayToPage(elementId, grooveDBTabToUrlString(grooveDBTabIn), showPlayer !== false);
		};

		// Render a GrooveDB-tab groove inline at the call site (mirrors the legacy API used by
		// grooveDBTest.html). A mount div is created in document order, so several grooves can be
		// stacked down a page interleaved with their descriptive text.
		root.GrooveDBFormatPutGrooveOnPage = function (grooveDBTabIn, showPlayer) {
			root.AddGrooveDisplayToPage(null, grooveDBTabToUrlString(grooveDBTabIn), showPlayer !== false);
		};

	})(); // end of class GrooveDisplay
} // end if
