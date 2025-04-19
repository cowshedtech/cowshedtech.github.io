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
	root.changeHandlers = [];

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

	/**
     * Adds a new change event handler
     * @param {Function} handler - The callback function to be called when changes occur
     * @returns {Function} - A function to remove this handler
     */
    root.addChangeHandler = function(handler) {
        this.changeHandlers.push(handler);
        return () => this.removeChangeHandler(handler);
    }


    /**
     * Removes a change event handler
     * @param {Function} handler - The callback function to remove
     */
    root.removeChangeHandler = function(handler) {
        const index = this.changeHandlers.indexOf(handler);
        if (index !== -1) this.changeHandlers.splice(index, 1);
    }


    /**
     * Notifies all registered handlers of a change
     */
    root.notifyHandlers = function() {
        this.changeHandlers.forEach(handler => handler());
    }

	/**
     * Notifies all registered handlers of a change
     */
    root.notify = function() {
		this.notifyHandlers();
	}

	/*
	 *
	 */
	root.setStickingState = function(id, new_state) {
		this.sticking_array[id] = new_state;
		this.notifyHandlers();
	}

	/**
     * Notifies all registered handlers of a change
     */
    root.setStickingStateNoNotify = function(id, new_state) {
		this.sticking_array[id] = new_state;		
	}
	
	/*
	 *
	 */
	root.getStickingState = function(id, returnType) {
	
		let abcState = this.sticking_array[id] ? this.sticking_array[id] : constant_ABC_STICK_OFF;
		let result = abcState;
		
		if (returnType == "URL")
		{
			if (abcState === constant_ABC_STICK_BOTH) returnType = "B";
			if (abcState === constant_ABC_STICK_R) returnType = "R";
			if (abcState === constant_ABC_STICK_L) returnType = "L";
			if (abcState === constant_ABC_STICK_COUNT) returnType = "C";
			if (abcState === constant_ABC_STICK_OFF) returnType = "-";
		}
	
		return result;    
	}

	/*
	 *
	 */
	root.getHighHatState = function(id, returnType) {

		let abcState = this.hh_array[id] ? this.hh_array[id] : constant_ABC_OFF;
		let result = abcState;
		
		if (returnType == "URL")
		{
			if (abcState === constant_ABC_HH_Ride) returnType = "r";
			if (abcState === constant_ABC_HH_Ride_Bell) returnType = "b";
			if (abcState === constant_ABC_HH_Cow_Bell) returnType = "m";
			if (abcState === constant_ABC_HH_Crash) returnType = "c";
			if (abcState === constant_ABC_HH_Stacker) returnType = "s";
			if (abcState === constant_ABC_HH_Metronome_Normal) returnType = "n";
			if (abcState === constant_ABC_HH_Metronome_Accent) returnType = "N";
			if (abcState === constant_ABC_HH_Open) returnType = "o";
			if (abcState === constant_ABC_HH_Close) returnType = "+";
			if (abcState === constant_ABC_HH_Accent) returnType = "X";
			if (abcState === constant_ABC_HH_Normal) returnType = "x";
		}
	
		return result;        
	}

	/*
	 *
	 */
	root.stickingsReverseRL = function() {
		for (var i = 0; i < this.numberOfMeasures * this.notesPerMeasure; i++) {
			var cur_state = this.getStickingState(i, "URL");
			if (cur_state === "R") {
				this.setStickingState(i, "left", false, this.notesPerMeasure, this.timeDivision, this.noteValue);
			} else if (cur_state === "L") {
				this.setStickingState(i, "right", false, this.notesPerMeasure, this.timeDivision, this.noteValue);
			}
		}		
	}
	
	
	/*
	 *
	 */
	root.setHighHatState = function(id, mode, make_sound) {
		this.hh_array[id] = mode;	
		this.notifyHandlers();
	}

	/**
     * Notifies all registered handlers of a change
     */
    root.setHighHatStateNoNotify = function(id, mode) {
		this.hh_array[id] = mode;			
	}


	/*
	 *
	 */
	root.getDefaultHHGroove = function() {
		var retString = "";
		var oneMeasureString = "|";
		var i;
	
		for(i = 0; i < this.notesPerMeasure; i++) {
			if(this.notesPerMeasure == 48)
				oneMeasureString += "-";
			else
				oneMeasureString += "x";
		}
		for (i = 0; i < this.numberOfMeasures; i++)
			retString += oneMeasureString;
		retString += "|";
	
		return retString;
	};
	

	/*
	 *
	 */
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
	

	/*
	 *
	 */
	root.setSnareState = function(id, mode, make_sound) {
		this.snare_array[id] = mode;	
		this.notifyHandlers();
	}

	/*
	 *
	 */
	root.setSnareStateNoNotify = function(id, mode, make_sound) {
		this.snare_array[id] = mode;			
	}

	/**
     * Notifies all registered handlers of a change
     */
    root.getDefaultSnareGroove = function() {
		var retString = "";
		var oneMeasureString = "|";
		var i;
		var notes_per_grouping = (this.notesPerMeasure / this.numBeats);
	
		for(i = 0; i < this.notesPerMeasure; i++) {
			// if the note falls on the beginning of a group
			// and the group is odd
			if(i % notes_per_grouping === 0 && (i / notes_per_grouping) % 2 !== 0)
				oneMeasureString += "O";
			else
				oneMeasureString += "-";
		}
		for (i = 0; i < this.numberOfMeasures; i++)
				retString += oneMeasureString;
			retString += "|";
	
		return retString;
	
	};
	

	/*
	 *
	 */
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
	
	/*
	 *
	 */
	root.setKickState = function(id, mode, make_sound) {
		this.kick_array[id] = mode;		
		this.notifyHandlers();	
	}

	/*
	 *
	 */
	root.setKickStateNoNotify = function(id, mode, make_sound) {
		this.kick_array[id] = mode;		
	}


	/*
	 *
	 */
	root.getDefaultKickGroove = function() {
		var retString = "";
		var oneMeasureString = "|";
		var i;
		var notes_per_grouping = (this.notesPerMeasure / this.numBeats);
	
		for(i = 0; i < this.notesPerMeasure; i++) {
			// if the note falls on the beginning of a group
			// and the group is even
			if(i % notes_per_grouping === 0 && (i / notes_per_grouping) % 2 === 0)
				oneMeasureString += "o";
			else
				oneMeasureString += "-";
		}
		for (i = 0; i < this.numberOfMeasures; i++)
				retString += oneMeasureString;
			retString += "|";
	
		return retString;
	};

	/*
	 *
	 */
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

	/**
     * Notifies all registered handlers of a change
     */
    root.setTomState = function(tomId, id, mode, make_sound) {
		this.toms_array[tomId-1][id] = mode;			
		this.notifyHandlers();
	}

	/**
     * Notifies all registered handlers of a change
     */
    root.setTomStateNoNotify = function(tomId, id, mode, make_sound) {
		this.toms_array[tomId-1][id] = mode;					
	}

	/**
     * Notifies all registered handlers of a change
     */
    root.setTom1StateNoNotify = function(id, mode, make_sound) {
		this.setTomState(0, id, mode)
	}

	/**
     * Notifies all registered handlers of a change
     */
    root.setTom4StateNoNotify = function(id, mode, make_sound) {
		this.setTomState(3, id, mode)
	}

	/**
     * Notifies all registered handlers of a change
     */
    root.getDefaultTomGroove = function() {
		return this.getEmptyGroove()
	}

	/**
     * Notifies all registered handlers of a change
     */
    root.getEmptyGroove = function() {
		var oneMeasureString = "|" + "-".repeat(this.notesPerMeasure) + "|"; // Optimized measure string creation
		var retString = oneMeasureString.repeat(this.numMeasures); // Use repeat to create the full string
	
		return retString;
	};

	/**
     * Notifies all registered handlers of a change
     */
    root.setTitle = function(title) {
		this.title = title;
		this.notifyHandlers();
	}

	/**
     * Notifies all registered handlers of a change
     */
    root.getTitle = function() {
		return this.title
	}

	/**
     * Notifies all registered handlers of a change
     */
    root.setAuthor = function(author) {
		this.author = author;
		this.notifyHandlers();
	}

	/**
     * Notifies all registered handlers of a change
     */
    root.getAuthor = function() {
		return this.author
	}

	/**
     * Notifies all registered handlers of a change
     */
    root.setComments = function(comments) {
		this.comments = comments;
		this.notifyHandlers();
	}

	/**
     * Notifies all registered handlers of a change
     */
    root.getComments = function() {
		return this.comments
	}

	/**
     * Notifies all registered handlers of a change
     */
    root.clearAllNotes = function() {
		this.repeatedMeasures.clear();
		this.numberOfMeasures = 1;
		this.sticking_array = class_empty_note_array.slice(0);
		this.hh_array = class_empty_note_array.slice(0);   
		this.snare_array = class_empty_note_array.slice(0);
		this.kick_array = class_empty_note_array.slice(0); 
		this.toms_array = [class_empty_note_array.slice(0), class_empty_note_array.slice(0), class_empty_note_array.slice(0), class_empty_note_array.slice(0)];
		this.notifyHandlers();
		// editor.changeDivisionWithNotes(editor.track.timeDivision, uiStickings, uiHH, uiTom1, uiTom4, uiSnare, uiKick);
	}

	/**
     * Notifies all registered handlers of a change
     */
    root.addMeasure = function() {
		this.numberOfMeasures++;
		this.sticking_array.push(...class_empty_note_array.slice(0));
		this.hh_array.push(...class_empty_note_array.slice(0));   
		this.snare_array.push(...class_empty_note_array.slice(0));
		this.kick_array.push(...class_empty_note_array.slice(0)); 
		this.toms_array[0].push(...class_empty_note_array.slice(0));
		this.toms_array[1].push(...class_empty_note_array.slice(0)); 
		this.toms_array[2].push(...class_empty_note_array.slice(0)); 
		this.toms_array[3].push(...class_empty_note_array.slice(0)); 
		this.notifyHandlers();
	}

	/**
     * Notifies all registered handlers of a change
     */
    root.deleteMeasure = function(measureNum) {
		const noteData = {
			stickings: [],
			hh: [],
			tom1: [],
			tom4: [],
			snare: [],
			kick: []
		};

		const measureStart = (measureNum - 1) * this.notesPerMeasure;
		const measureEnd = measureNum * this.notesPerMeasure;
		const totalNotes = this.notesPerMeasure * this.numberOfMeasures;

		for (let i = 0; i < totalNotes; i++) {
			if (i < measureStart || i >= measureEnd) {
				noteData.stickings.push(editor.track.getStickingState(i, "ABC"))
				noteData.hh.push(editor.track.getHighHatState(i, "ABC"))
				noteData.tom1.push(editor.track.getTomState(1, i, "ABC"))
				noteData.tom4.push(editor.track.getTomState(4, i, "ABC"))
				noteData.snare.push(editor.track.getSnareState(i, "ABC"))
				noteData.kick.push(editor.track.getKickState(i, "ABC"))
			}
		}

		this.sticking_array = noteData.stickings
		this.hh_array = noteData.hh
		this.snare_array = noteData.snare
		this.kick_array = noteData.kick
		this.toms_array[0] = noteData.tom1
		this.toms_array[4] = noteData.tom4
		
		this.repeatedMeasures.delete(measureNum - 1);
		shiftRepeatedMeasuresAfterIndex(measureNum - 1, -1);
		this.numberOfMeasures--;

		this.notifyHandlers();

		// // editor.expandAuthoringViewWhenNecessary(editor.track.notesPerMeasure, editor.track.numberOfMeasures);
		// this.changeDivisionWithNotes(
		// 	editor.track.timeDivision,
		// 	noteData.stickings,
		// 	noteData.hh,
		// 	noteData.tom1,
		// 	noteData.tom4,
		// 	noteData.snare,
		// 	noteData.kick
		// );
	}
	
} // end of class