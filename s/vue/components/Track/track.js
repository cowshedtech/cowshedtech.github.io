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
		this.version = 0;
		this.repeatedMeasures = new Map();
		this.mutedMeasures = new Map(); // Map<measureIndex:number, Set<instrument:string>>
		this.numBeats = 4;  // TimeSigTop: Top part of Time Signture 3/4, 4/4, 5/4, 6/8, etc...
		this.noteValue = 4; // TimeSigBottom: Bottom part of Time Sig   4 = quarter notes, 8 = 8th notes, 16ths, etc..
		this.notes = new Map();
		this.notes.set(Instruments.STICKING, Array(32).fill(constant_ABC_OFF));
		this.notes.set(Instruments.HIGH_HAT, Array(32).fill(constant_ABC_OFF));
		this.notes.set(Instruments.SNARE, Array(32).fill(constant_ABC_OFF));
		this.notes.set(Instruments.KICK, Array(32).fill(constant_ABC_OFF));
		this.notes.set(Instruments.TOM1, Array(32).fill(constant_ABC_OFF));
		this.notes.set(Instruments.TOM4, Array(32).fill(constant_ABC_OFF));

		this.title = "";
		this.author = "";
		this.comments = "";
		this.kickStemsUp = true;
		this.noteMappingArray = [];
	};

	root.track = root.trackNew();

	/*
	 *
	 */
	root.notesPerMeasure = function () {
		return calc_notes_per_measure(root.timeDivision, root.numBeats, root.noteValue)
	};

	
	/*
	 *
	 */
	root.getInstruments = function() {	
		return this.notes.keys()	
	}

	/*
	 *
	 */
	root.getInstrumentNote = function(instrument, id) {
		const instrumentNotes = this.notes;
		if (!(instrumentNotes && instrumentNotes instanceof Map)) return constant_ABC_OFF;
		const notes = instrumentNotes.get(instrument);
		return (Array.isArray(notes) && id >= 0 && id < notes.length) ? notes[id] : constant_ABC_OFF;    
	}

	/*
	 *
	 */
	root.getInstrumentNotes = function(instrument) {
		const instrumentNotes = this.notes;
		if (!(instrumentNotes && instrumentNotes instanceof Map)) return null;
		const notes = instrumentNotes.get(instrument);
		return notes;
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
	root.setInstrumentNote = function(instrument, id, new_state) {
		this.notes.get(instrument)[id] = new_state;		
		this.version = (typeof this.version === "number" ? this.version + 1 : 1);
		this.notify();
	}

	/*
	 *
	 */
	root.setInstrumentNoteNoNotify = function(instrument, id, new_state) {
		this.notes.get(instrument)[id] = new_state;
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
		existingNotes.splice(insertIndex, 0, ...notes);
		this.notes.set(instrument, existingNotes)	
	}

	/*
	 *
	 */
	root.appendInstrumentNotes = function(instrument, notes) {
		let existingNotes = this.notes.get(instrument)
		existingNotes = existingNotes.concat(notes);
		this.notes.set(instrument, existingNotes)	
	}

	/*
	 *
	 */
	root.deleteInstrumentNotes = function(instrument, start, count) {
		let existingNotes = this.notes.get(instrument);
		existingNotes.splice(start, count);
		this.notes.set(instrument, existingNotes);
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
	

	/**
     * 
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
		this.numberOfMeasures = 1;
		this.repeatedMeasures.clear();
		this.mutedMeasures.clear();

		const instruments = this.getInstruments();
		for (const instrument of instruments) {
			this.setInstrumentNotes(instrument, Array(this.notesPerMeasure).fill(constant_ABC_OFF));
		}				
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
		
		const instruments = this.getInstruments();
		for (const instrument of instruments) {
			this.insertInstrumentNotes(instrument, insertIndex, Array(this.notesPerMeasure).fill(constant_ABC_OFF))
		}

		editor.track.numberOfMeasures++;

		// We need to move all the repeated measuresafter this measure up 1 
		this.shiftRepeatedMeasuresAfterIndex(measureNum - 1, 1);
		// Also shift any muted measure mappings after this measure
		this.shiftMutedMeasuresAfterIndex(measureNum - 1, 1);				
	};

	/**
     * Notifies all registered handlers of a change
     */
    root.duplicateMeasure = function(measureNum) {		

		const measureStart = (measureNum - 1) * this.notesPerMeasure;
		const measureEnd = measureStart + this.notesPerMeasure;

		const instruments = this.getInstruments();
		for (const instrument of instruments) {
			const notes = this.getInstrumentNotesSlice(instrument, measureStart, measureEnd)
			this.insertInstrumentNotes(instrument, measureEnd, notes)
		}

		// Update measure count and repeated measures
		this.numberOfMeasures++;
		this.shiftRepeatedMeasuresAfterIndex(measureNum - 1, 1);
		this.repeatedMeasures.set(measureNum, this.repeatedMeasures.get(measureNum - 1) || 1);
		// Shift muted measures and copy the source muted set to the newly duplicated measure
		this.shiftMutedMeasuresAfterIndex(measureNum - 1, 1);
		const srcMuted = this.mutedMeasures.get(measureNum - 1);
		if (srcMuted && srcMuted.size > 0) {
			this.mutedMeasures.set(measureNum, new Set(srcMuted));
		}							
	};

	/**
     * Notifies all registered handlers of a change
     */
    root.deleteMeasure = function(measureNum) {
		const measureStart = (measureNum - 1) * this.notesPerMeasure;

		const instruments = this.getInstruments();
		for (const instrument of instruments) {
			this.deleteInstrumentNotes(instrument, measureStart, this.notesPerMeasure)
		}
		
		this.repeatedMeasures.delete(measureNum - 1);
		this.shiftRepeatedMeasuresAfterIndex(measureNum - 1, -1);
		// Remove and shift muted measures accordingly
		this.mutedMeasures.delete(measureNum - 1);
		this.shiftMutedMeasuresAfterIndex(measureNum - 1, -1);
		this.numberOfMeasures--;		
	}

    /**
     * Notifies all registered handlers of a change
     */
    root.repeatMeasureInc = function(measureNum) {
		const count = editor.track.repeatedMeasures.get(measureNum - 1) || 1;
		editor.track.repeatedMeasures.set(measureNum - 1, count + 1);		
	};
	
	/**
     * Notifies all registered handlers of a change
     */
    root.repeatMeasureDec = function(measureNum) {
		const count = editor.track.repeatedMeasures.get(measureNum - 1) || 1;
		editor.track.repeatedMeasures.set(measureNum - 1, count - 1);
		this.notify();
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

		const instruments = this.getInstruments();
		for (const instrument of instruments) {
			this.setInstrumentNotes(instrument, this.adjustNotesForNewDivision(this.getInstrumentNotes(instrument)))
		}		
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
	 * Shifts the muted measures map entries after a given index.
	 * Mirrors shiftRepeatedMeasuresAfterIndex behavior for muting state.
	 *
	 * @param {number} measureIndex - Index of the measure to start shifting from (0-based)
	 * @param {number} direction - 1 to shift right (after insert), -1 to shift left (after delete)
	 */
	root.shiftMutedMeasuresAfterIndex = function(measureIndex, direction) {
		const sortedEntries = [...this.mutedMeasures.entries()].sort((a, b) => a[0] - b[0]);
		for (let i = sortedEntries.length - 1; i >= 0; i--) {
			const [key, value] = sortedEntries[i];
			if (key > measureIndex) {
				this.mutedMeasures.set(key + direction, value);
				this.mutedMeasures.delete(key);
			}
		}
	}

	/**
	 * Returns true if the given instrument is muted in the specified measure (1-based).
	 */
	root.isInstrumentMutedInMeasure = function(instrument, measureNum) {
		const idx = measureNum - 1;
		const mutedSet = this.mutedMeasures.get(idx);
		return !!(mutedSet && mutedSet.has(instrument));
	}

	/**
	 * Returns true if the given instrument is muted in any measure.
	 */
	root.isInstrumentMuted = function(instrument) {
		for (const mutedSet of this.mutedMeasures.values()) {
			if (mutedSet && mutedSet.has(instrument)) return true;
		}
		return false;
	}

	/**
	 * Returns true if the given instrument is unmuted in every measure.
	 */
	root.isInstrumentUnmutedEverywhere = function(instrument) {
		for (let i = 0; i < this.numberOfMeasures; i++) {
			const mutedSet = this.mutedMeasures.get(i);
			if (mutedSet && mutedSet.has(instrument)) return false;
		}
		return true;
	}

	/**
	 * Returns true if the given instrument is muted in every measure.
	 */
	root.isInstrumentMutedEverywhere = function(instrument) {
		for (let i = 0; i < this.numberOfMeasures; i++) {
			const mutedSet = this.mutedMeasures.get(i);
			if (!(mutedSet && mutedSet.has(instrument))) return false;
		}
		return true;
	}

	/**
	 * Returns a Set of muted instruments for a given measure (1-based).
	 * Always returns a Set (possibly empty).
	 */
	root.getMutedInstrumentsForMeasure = function(measureNum) {
		const idx = measureNum - 1;
		const mutedSet = this.mutedMeasures.get(idx);
		return mutedSet ? new Set(mutedSet) : new Set();
	}

	/**
	 * Mutes an instrument for the given measure (1-based).
	 */
	root.muteInstrumentForMeasure = function(instrument, measureNum) {
		const idx = measureNum - 1;
		let mutedSet = this.mutedMeasures.get(idx);
		if (!mutedSet) {
			mutedSet = new Set();
			this.mutedMeasures.set(idx, mutedSet);
		}
		mutedSet.add(instrument);		
	}

	/**
	 * Unmutes an instrument for the given measure (1-based).
	 */
	root.unmuteInstrumentForMeasure = function(instrument, measureNum) {
		const idx = measureNum - 1;
		const mutedSet = this.mutedMeasures.get(idx);
		if (mutedSet) {
			mutedSet.delete(instrument);
			if (mutedSet.size === 0) {
				this.mutedMeasures.delete(idx);
			}			
		}
	}

	/**
	 * Toggles mute for an instrument at a measure (1-based).
	 */
	root.toggleMuteInstrumentForMeasure = function(instrument, measureNum) {
		if (this.isInstrumentMutedInMeasure(instrument, measureNum)) {
			this.unmuteInstrumentForMeasure(instrument, measureNum);
		} else {
			this.muteInstrumentForMeasure(instrument, measureNum);
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

		for (const instrument of this.getInstruments()) {
			this.appendInstrumentNotes(instrument, track.getInstrumentNotes(instrument));	
		}

		for (let measureIndex of track.repeatedMeasures.keys()) {
			this.repeatedMeasures.set(this.numberOfMeasures + measureIndex, track.repeatedMeasures.get(measureIndex))
		}

		// Merge muted measures from appended track, offsetting indexes
		for (let [measureIndex, mutedSet] of track.mutedMeasures.entries()) {
			this.mutedMeasures.set(this.numberOfMeasures + measureIndex, new Set(mutedSet));
		}

		this.numberOfMeasures = this.numberOfMeasures + track.numberOfMeasures;				
	}
	

} // end of class