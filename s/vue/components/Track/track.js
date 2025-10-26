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

const Instruments = {
    STICKING: 'Sticking',
    HIGH_HAT: 'HighHat',
    SNARE: 'Snare',
    KICK: 'Kick',
	TOM1: 'Tom1',
	TOM4: 'Tom4',
};

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
		this.notes = new Map();
		this.notes.set(Instruments.STICKING, Array(32).fill(constant_ABC_STICK_OFF));
		this.notes.set(Instruments.HIGH_HAT, Array(32).fill(constant_ABC_OFF));
		this.notes.set(Instruments.SNARE, Array(32).fill(constant_ABC_OFF));
		this.notes.set(Instruments.KICK, Array(32).fill(constant_ABC_OFF));
		this.notes.set(Instruments.TOM1, Array(32).fill(constant_ABC_OFF));
		this.notes.set(Instruments.TOM4, Array(32).fill(constant_ABC_OFF));

		// this.toms_array = [class_empty_note_array.slice(0), class_empty_note_array.slice(0), class_empty_note_array.slice(0), class_empty_note_array.slice(0)];
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
     * Notifies all registered handlers of a change
     */
    root.notify = function() {
		window.eventBus.$emit('track-updated');
	}

	/*
	 *
	 */
	root.setInstrumentState = function(instrument, id, new_state) {
		this.notes.get(instrument)[id] = new_state;		
		window.eventBus.$emit('track-updated');
	}

	/*
	 *
	 */
	root.setInstrumentStateNoNotify = function(instrument, id, new_state) {
		this.notes.get(instrument)[id] = new_state;
	}

	/*
	 *
	 */
	root.getInstrumentState = function(instrument, id) {
	
		let result = null;
		let instrumentNotes = this.notes 
		if (instrumentNotes && instrumentNotes instanceof Map) {
			let notes = instrumentNotes.get(instrument);
			result = notes[id];				
		}
		else {
			console.log(`here`)
		}
		return result;    
	}

	/*
	 *
	 */
	root.getInstrumentNotes = function(instrument) {
		return this.notes.get(instrument);
	}

	/*
	 *
	 */
	root.getInstrumentNotesSlice = function(instrument, start, end) {
		return this.notes.get(instrument).slice(start, end);
	}

	/*
	 *
	 */
	root.setInstrumentNotes = function(instrument, notes) {
		return this.notes.set(instrument, notes);
	}

	/*
	 *
	 */
	root.insertInstrumentNotes = function(instrument, insertIndex, notes) {
		let existingNotes = this.notes.get(instrument)
		existingNotes.splice(insertIndex, 0, notes);
		this.notes.set(instrument, existingNotes)	
	}

	/*
	 *
	 */
	root.appendInstrumentNotes = function(instrument, notes) {
		let existingNotes = this.notes.get(instrument)
		existingNotes.push(notes);
		this.notes.set(instrument, existingNotes)	
	}

	/*
	 *
	 */
	root.deleteInstrumentNotes = function(instrument, start, count) {
		let notes = this.notes.get(instrument);
		notes.splice(start, count);
		this.notes.set(instrument);
	}

	/**
     * Notifies all registered handlers of a change
     */
    root.setStickingStateNoNotify = function(id, new_state) {
		this.setInstrumentStateNoNotify(Instruments.STICKING, id, new_state);		
	}

	/**
     * Notifies all registered handlers of a change
     */
    root.setHighHatStateNoNotify = function(id, mode) {
		this.setInstrumentStateNoNotify(Instruments.HIGH_HAT, id, mode);		
	}

	/*
	 *
	 */
	root.setSnareStateNoNotify = function(id, mode, make_sound) {
		this.setInstrumentStateNoNotify(Instruments.SNARE, id, mode);				
	}
	
	/*
	 *
	 */
	root.setKickStateNoNotify = function(id, mode, make_sound) {
		this.setInstrumentStateNoNotify(Instruments.KICK, id, mode);				
	}

	/**
     * Notifies all registered handlers of a change
     */
    root.setTom1StateNoNotify = function(id, mode, make_sound) {
		this.setInstrumentStateNoNotify(Instruments.TOM1, id, mode)
	}

	/**
     * Notifies all registered handlers of a change
     */
    root.setTom4StateNoNotify = function(id, mode, make_sound) {
		this.setInstrumentStateNoNotify(Instruments.TOM4, id, mode)
	}

	/*
	 *
	 */
	// root.stickingsReverseRL = function() {
	// 	for (var i = 0; i < this.numberOfMeasures * this.notesPerMeasure; i++) {
	// 		var cur_state = this.getStickingState(i, "URL");
	// 		if (cur_state === "R") {
	// 			this.setStickingState(i, "left", false, this.notesPerMeasure, this.timeDivision, this.noteValue);
	// 		} else if (cur_state === "L") {
	// 			this.setStickingState(i, "right", false, this.notesPerMeasure, this.timeDivision, this.noteValue);
	// 		}
	// 	}		
	// }

	


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
		
		window.eventBus.$emit('track-updated');
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
		
		window.eventBus.$emit('track-updated');
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
		
		window.eventBus.$emit('track-updated');
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
		this.sticking_array = Array(this.notesPerMeasure).fill(false).slice(0);
		this.setInstrumentNotes(Instruments.STICKING, Array(this.notesPerMeasure).fill(constant_ABC_STICK_OFF))
		this.setInstrumentNotes(Instruments.HIGH_HAT, Array(this.notesPerMeasure).fill(constant_ABC_OFF))
		this.setInstrumentNotes(Instruments.SNARE, Array(this.notesPerMeasure).fill(constant_ABC_OFF))
		this.setInstrumentNotes(Instruments.KICK, Array(this.notesPerMeasure).fill(constant_ABC_OFF))
		this.setInstrumentNotes(Instruments.TOM1, Array(this.notesPerMeasure).fill(constant_ABC_OFF))
		this.setInstrumentNotes(Instruments.TOM4, Array(this.notesPerMeasure).fill(constant_ABC_OFF))		
				
		window.eventBus.$emit('track-updated');
	}

	/**
	 * Adds a new empty measure after the specified measure.
	 * Collects notes before and after the insertion point and adds an empty measure.
	 * 
	 * @param {number} measureNum - Index of the measure after which to add (1-based)
	 * @requires Functions:
	 * - get_sticking_state - Gets sticking notation for a note
	 * - editor.track.getHighHatState - Gets hi-hat state for a note
	 * - editor.track.getTomState - Gets tom state for a note
	 * - editor.track.getSnareState - Gets snare state for a note
	 * - editor.track.getKickState - Gets kick state for a note
	 * - shiftRepeatedMeasuresAfterIndex - Updates repeat counts after insertion
	 * @requires editor.track - Track object containing score state
	 */
	root.addMeasure = function(measureNum) {
		var insertIndex = (measureNum) * editor.track.notesPerMeasure
		this.insertInstrumentNotes(Instruments.STICKING, insertIndex, Array(this.notesPerMeasure).fill(constant_ABC_STICK_OFF))
		this.insertInstrumentNotes(Instruments.HIGH_HAT, insertIndex, Array(this.notesPerMeasure).fill(constant_ABC_STICK_OFF))
		this.insertInstrumentNotes(Instruments.SNARE, insertIndex, Array(this.notesPerMeasure).fill(constant_ABC_OFF))
		this.insertInstrumentNotes(Instruments.KICK, insertIndex, Array(this.notesPerMeasure).fill(constant_ABC_OFF))
		this.insertInstrumentNotes(Instruments.TOM1, insertIndex, Array(this.notesPerMeasure).fill(constant_ABC_OFF))
		this.insertInstrumentNotes(Instruments.TOM4, insertIndex, Array(this.notesPerMeasure).fill(constant_ABC_OFF))
		editor.track.numberOfMeasures++;

		// We need to move all the repeated measuresafter this measure up 1 
		this.shiftRepeatedMeasuresAfterIndex(measureNum - 1, 1);
		
		window.eventBus.$emit('track-updated');
	};

	/**
     * Notifies all registered handlers of a change
     */
    root.duplicateMeasure = function(measureNum) {		

		const measureStart = (measureNum - 1) * this.notesPerMeasure;
		const measureEnd = measureStart + this.notesPerMeasure;
		this.insertInstrumentNotes(Instruments.STICKING, measureEnd, this.getInstrumentNotesSlice(Instruments.STICKING, measureStart, measureEnd))
		this.insertInstrumentNotes(Instruments.HIGH_HAT, measureEnd, this.getInstrumentNotesSlice(Instruments.HIGH_HAT, measureStart, measureEnd));			
		this.insertInstrumentNotes(Instruments.SNARE, measureEnd, this.getInstrumentNotesSlice(Instruments.SNARE, measureStart, measureEnd));			
		this.insertInstrumentNotes(Instruments.KICK, measureEnd, this.getInstrumentNotesSlice(Instruments.KICK, measureStart, measureEnd));			
		this.insertInstrumentNotes(Instruments.TOM1, measureEnd, this.getInstrumentNotesSlice(Instruments.TOM1, measureStart, measureEnd));			
		this.insertInstrumentNotes(Instruments.TOM4, measureEnd, this.getInstrumentNotesSlice(Instruments.TOM4, measureStart, measureEnd));			
		
		// Update measure count and repeated measures
		this.numberOfMeasures++;
		this.shiftRepeatedMeasuresAfterIndex(measureNum - 1, 1);
		this.repeatedMeasures.set(measureNum, this.repeatedMeasures.get(measureNum - 1) || 1);
			
		window.eventBus.$emit('track-updated');
	};

	/**
     * Notifies all registered handlers of a change
     */
    root.deleteMeasure = function(measureNum) {
		const measureStart = (measureNum - 1) * this.notesPerMeasure;
		
		this.deleteInstrumentNotes(Instruments.STICKING, measureStart, this.notesPerMeasure)
		this.deleteInstrumentNotes(Instruments.HIGH_HAT, measureStart, this.notesPerMeasure)
		this.deleteInstrumentNotes(Instruments.SNARE, measureStart, this.notesPerMeasure)
		this.deleteInstrumentNotes(Instruments.HIGH_HAT, measureStart, this.notesPerMeasure)
		this.deleteInstrumentNotes(Instruments.TOM1, measureStart, this.notesPerMeasure)
		this.deleteInstrumentNotes(Instruments.TOM4, measureStart, this.notesPerMeasure)

		this.repeatedMeasures.delete(measureNum - 1);
		this.shiftRepeatedMeasuresAfterIndex(measureNum - 1, -1);
		this.numberOfMeasures--;

				
		window.eventBus.$emit('track-updated');
	}

    /**
     * Notifies all registered handlers of a change
     */
    root.repeatMeasureInc = function(measureNum) {
		const count = editor.track.repeatedMeasures.get(measureNum - 1) || 1;
		editor.track.repeatedMeasures.set(measureNum - 1, count + 1);
				
		window.eventBus.$emit('track-updated');
	};
	
	/**
     * Notifies all registered handlers of a change
     */
    root.repeatMeasureDec = function(measureNum) {
		const count = editor.track.repeatedMeasures.get(measureNum - 1) || 1;
		editor.track.repeatedMeasures.set(measureNum - 1, count - 1);
				
		window.eventBus.$emit('track-updated');
	};

	/**
     * Notifies all registered handlers of a change
     */
	var haveShownMixedDivisionMessage = false;
    root.changeDivision = function (newDivision) {
		if (newDivision == 48 && !haveShownMixedDivisionMessage) {
			haveShownMixedDivisionMessage = true;
			alert("The MIXED subdivision allows you to create a combination of triplets and non-triplet notes in one measure.  Set every 3rd note for 16ths and every 6th note for 8th notes")
		}

		var isOldDivisionTriplets = isTripletDivision(this.timeDivision);
		var isNewDivisionTriplets = isTripletDivision(newDivision);
		// var new_notes_per_measure = calc_notes_per_measure((isNewDivisionTriplets ? 48 : 32), this.numBeats, this.noteValue);

		// check for incompatible odd time signature division   9/8 and 1/4notes for instance or 9/16 and 1/8notes
		if ((newDivision * this.numBeats / this.noteValue) % 1 != 0) {
			alert("1/" + newDivision + " notes are disabled in " + this.numBeats + "/" + this.noteValue + " time.  This combination would result in a half note.");
			return;
		}
		if (isNewDivisionTriplets && this.noteValue != 4) {
			alert("Triplets are disabled in " + this.numBeats + "/" + this.noteValue + " time.  Use x/4 time for triplets.");
			return;
		}

		this.timeDivision = newDivision;
		this.notesPerMeasure = calc_notes_per_measure(this.timeDivision, this.numBeats, this.noteValue);		

		if (isOldDivisionTriplets !== isNewDivisionTriplets) {
			// changing from or changing to a triplet division
			// triplets don't scale well, so use defaults when we change
			this.setInstrumentNotes(Instruments.STICKING, noteArraysFromURLData("Stickings", this.getEmptyGroove(), this.notesPerMeasure, this.numberOfMeasures));
			this.setInstrumentNotes(Instruments.HIGH_HAT, noteArraysFromURLData("H", this.getDefaultHHGroove(), this.notesPerMeasure, this.numberOfMeasures))
			this.setInstrumentNotes(Instruments.SNARE, noteArraysFromURLData("S", this.getDefaultSnareGroove(this.notesPerMeasure, this.numBeats, this.noteValue, this.numberOfMeasures), this.notesPerMeasure, this.numberOfMeasures));
			this.setInstrumentNotes(Instruments.KICK, noteArraysFromURLData("K", this.getDefaultKickGroove(), this.notesPerMeasure, this.numberOfMeasures));
			this.setInstrumentNotes(Instruments.TOM1, noteArraysFromURLData("T1", this.getEmptyGroove(), this.notesPerMeasure, this.numberOfMeasures));
			this.setInstrumentNotes(Instruments.TOM4, noteArraysFromURLData("T4", this.getEmptyGroove(), this.notesPerMeasure, this.numberOfMeasures));

			// reset the metronome click, since it has different options
			// metronome.resetOptionsMenuOffsetClick();
		}

		this.setInstrumentNotes(Instruments.STICKING, this.adjustNotesForNewDivision(this.sticking_array))
		this.setInstrumentNotes(Instruments.HIGH_HAT, this.adjustNotesForNewDivision(this.getInstrumentNotes(Instruments.HIGH_HAT)))
		this.setInstrumentNotes(Instruments.SNARE, this.adjustNotesForNewDivision(this.getInstrumentNotes(Instruments.SNARE)))
		this.setInstrumentNotes(Instruments.KICK, this.adjustNotesForNewDivision(this.getInstrumentNotes(Instruments.KICK)))
		this.setInstrumentNotes(Instruments.TOM1, this.adjustNotesForNewDivision(this.getInstrumentNotes(Instruments.TOM1)))
		this.setInstrumentNotes(Instruments.TOM3, this.adjustNotesForNewDivision(this.getInstrumentNotes(Instruments.TOM3)))
			
		window.eventBus.$emit('track-updated');
	};

	/**
     * 
     */
	root.adjustNotesForNewDivision = function(notes) {

		// multiple measures of "how_many_notes"
		var notesOnScreen = this.notesPerMeasure * this.numberOfMeasures;

		var noteStringScaler = 1;
		var displayScaler = 1;
		// if we encounter a 16th note groove for an 8th note board, let's scale it	down
		// if we encounter a 8th note groove for an 16th note board, let's scale it up			
		if (notes.length > notesOnScreen && notes.length / notesOnScreen >= 2) {
			noteStringScaler = Math.ceil(notes.length / notesOnScreen);
		} else if (notes.length < notesOnScreen && notesOnScreen / notes.length >= 2) {			
			displayScaler = Math.ceil(notesOnScreen / notes.length);
		}
	
		let updatedNotes = Array(notesOnScreen).fill(false).slice(0);

		//  DisplayIndex is the index into the notes on the HTML page  starts at 1/32\n%%flatbeams
		var displayIndex = 0;
		var topDisplay = this.notesPerMeasure * this.numberOfMeasures;
		for (var i = 0; i < notes.length && displayIndex < topDisplay; i += noteStringScaler, displayIndex += displayScaler) {
			updatedNotes[displayIndex] = notes[i];			
		}

		return updatedNotes;
	}

	/**
	 * Shifts the repeated measures map entries after a given index.
	 * Used when adding or removing measures to maintain correct repeat counts.
	 * 
	 * @param {number} measureIndex - Index of the measure to start shifting from (0-based)
	 * @param {number} direction - Direction to shift (1 for right, -1 for left)
	 * @requires editor.track.repeatedMeasures - Map containing measure repeat counts
	 */
	root.shiftRepeatedMeasuresAfterIndex = function(measureIndex, direction) {
		// Convert Map to array of entries and sort by measure index
		const sortedEntries = [...this.repeatedMeasures.entries()].sort((a, b) => a[0] - b[0]);
		
		// Process in reverse order to avoid overwriting
		for (let i = sortedEntries.length - 1; i >= 0; i--) {
			const [key, value] = sortedEntries[i];
			if (key > measureIndex) {
				this.repeatedMeasures.set(key + direction, value);
				this.repeatedMeasures.delete(key);
			}
		}
	}

	/**
     * 
     */
	root.noteGroupingSize = function() {
		var note_grouping;
		var usingTriplets = isTripletDivisionFromNotesPerMeasure(this.notesPerMeasure, this.numBeats, this.noteValue);
	
		if(usingTriplets) {
			// triplets  ( we only support 2/4 here )
			if(this.numBeats != 2 && this.noteValue != 4)
				console.log("Triplets are only supported in 2/4 and 4/4 time");
			note_grouping = this.notesPerMeasure / (this.numBeats * (4/this.noteValue));
		} else if(this.numBeats == 3) {
			// 3/4, 3/8, 3/16
			// 3 groups
			// not triplets
			note_grouping =  (this.notesPerMeasure) / 3
		} else if(this.numBeats % 6 == 0 && this.noteValue % 8 == 0) {
			// 6/8, 12/8
			// 2 groups in 6/8 rather than 3 groups
			// 4 groups in 12/8
			// not triplets
			note_grouping = this.notesPerMeasure / (2 * this.numBeats/6)
		} else {
			// figure it out from the time signature
			// not triplets
			note_grouping = (this.notesPerMeasure / this.numBeats) * (this.noteValue/4);
		}
		return note_grouping;
	};

	/**
     * 
     */
	root.isTripletDivision = function() {
		if(this.timeDivision % 12 === 0)  // we only support 12 & 24 & 48  1/8th, 1/16, & 1/32 note triplets
			return true;
	
		return false;
	};

	/**
     * 
     */
	root.appendTrack = function(track) {

		this.sticking_array.push(...track.sticking_array)

		this.appendInstrumentNotes(Instruments.STICKING, track.getInstrumentNotes(Instruments.STICKING));	
		this.appendInstrumentNotes(Instruments.HIGH_HAT, track.getInstrumentNotes(Instruments.HIGH_HAT));
		this.appendInstrumentNotes(Instruments.SNARE, track.getInstrumentNotes(Instruments.SNARE));
		this.appendInstrumentNotes(Instruments.KICK, track.getInstrumentNotes(Instruments.KICK));
		this.appendInstrumentNotes(Instruments.TOM1, track.getInstrumentNotes(Instruments.TOM1));
		this.appendInstrumentNotes(Instruments.TOM4, track.getInstrumentNotes(Instruments.TOM4));
		
		for (let measureIndex of track.repeatedMeasures.keys()) {
			this.repeatedMeasures.set(this.numberOfMeasures + measureIndex, track.repeatedMeasures.get(measureIndex))
		}

		this.numberOfMeasures = this.numberOfMeasures + track.numberOfMeasures;

			
		window.eventBus.$emit('track-updated');
	}
	

} // end of class