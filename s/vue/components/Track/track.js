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

var trackID = 0;

// GrooveUtils class.   The only one in this file.
function Track() {
	"use strict";

	trackID++; // should increment on every new

	var root = this;
    root.trackID = trackID;

	root.trackNew = function () {
		this.notesPerMeasure = 16;
		this.timeDivision = 16;
		this.numberOfMeasures = 1;
		this.repeatedMeasures = new Map();
		this.numBeats = 4;  // TimeSigTop: Top part of Time Signture 3/4, 4/4, 5/4, 6/8, etc...
		this.noteValue = 4; // TimeSigBottom: Bottom part of Time Sig   4 = quarter notes, 8 = 8th notes, 16ths, etc..
		this.sticking_array = class_empty_note_array.slice(0); // copy by value
		this.hh_array = class_empty_note_array.slice(0);    // copy by value
		this.snare_array = class_empty_note_array.slice(0); // copy by value
		this.kick_array = class_empty_note_array.slice(0);  // copy by value
		// toms_array contains 4 toms  T1, T2, T3, T4 index starting at zero
		this.toms_array = [class_empty_note_array.slice(0), class_empty_note_array.slice(0), class_empty_note_array.slice(0), class_empty_note_array.slice(0)];
		this.title = "";
		this.author = "";
		this.comments = "";
		this.kickStemsUp = true;
		this.noteMappingArray = null;
	};

	// root.notesPerMeasure = function () {
	// 	return calc_notes_per_measure(root.timeDivision, root.numBeats, root.noteValue)
	// };

	root.track = root.trackNew();

	root.getSnareState = function(id, returnType) {

		let abcState = this.snare_array[id] ? this.snare_array[id] : constant_ABC_OFF;
		let result = abcState;
		
		if (returnType == "URL")
		{
			if (abcState === constant_ABC_SN_Flam) returnType = "f";
			if (abcState === constant_ABC_SN_Drag) returnType = "d";
			if (abcState === constant_ABC_SN_Ghost) returnType = "g";
			if (abcState === constant_ABC_SN_Accent) returnType = "O";
			if (abcState === constant_ABC_SN_Normal) returnType = "o";
			if (abcState === constant_ABC_SN_XStick) returnType = "x";
			if (abcState === constant_ABC_SN_Buzz) returnType = "b";
		}
	
		return result;        
	}
	
	root.setSnareState = function(id, mode, make_sound) {
		this.snare_array[id] = mode;			
	}
	
	root.getKickState = function(id, returnType) {

		let abcState = this.kick_array[id] ? this.kick_array[id] : constant_ABC_OFF;
		let result = abcState;
		
		if (returnType == "URL")
		{
			if (abcState === constant_ABC_KI_SandK) returnType = "X";
			if (abcState === constant_ABC_KI_Splash) returnType = "x";
			if (abcState === constant_ABC_KI_Normal) returnType = "o";        
		}
	
		return result;        
	}
	
	root.setKickState = function(id, mode, make_sound) {
		this.kick_array[id] = mode;			
	}

	root.getTomState = function(tomId, id, returnType) {
		let abcState = this.toms_array[tomId-1][id] ? this.toms_array[tomId-1][id] : constant_ABC_OFF;
		let result = abcState;

		if (returnType == "URL")
		{
			if (abcState === constant_ABC_T1_Normal || constant_ABC_T4_Normal) returnType = "x";			
		}
	
		return result;  


		// if (tomOn) {
		//     if (returnType == "ABC")
		//         switch (tom_num) {
		//             case 1:
		//                 return constant_ABC_T1_Normal; // normal
		//                 break;
		//             case 4:
		//                 return constant_ABC_T4_Normal; // normal
		//                 break;
		//             default:
		//                 console.log("bad switch in get_tom_state. bad tom num:" + tom_num);
		//                 break;
		//         }
		//     else if (returnType == "URL")
		//         return "x"; // normal
		// }

		// if (returnType == "ABC")
		//     return false; // off (rest)
		// else if (returnType == "URL")
		//     return "-"; // off (rest)





	}

	root.setTomState = function(tomId, id, mode, make_sound) {
		this.toms_array[tomId-1][id] = mode;			
	}
} // end of class