// Javascript for the Groove Scribe HTML application

var class_empty_note_array = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];

// build a string that looks like this
//  |----------------|----------------|
function GetEmptyGroove(notes_per_measure, numMeasures) {
	var retString = "";
	var oneMeasureString = "|";
	var i;

	for (i = 0; i < notes_per_measure; i++) {
		oneMeasureString += "-";
	}
	for (i = 0; i < numMeasures; i++)
		retString += oneMeasureString;
	retString += "|";

	return retString;
};


// takes two drum tab lines and merges them.    "-" are blanks so they will get overwritten in a merge.
// if there are two non "-" positions to merge, the dominateLine takes priority.
//
//  Example    |----o-------o---|   (dominate)
//           + |x-------x---x---|   (subordinate)
//             |x---o---x---o---|   (result)
//
// this is useful to take an accent tab and an "others" tab and creating one tab out of it.
function mergeDrumTabLines(dominateLine, subordinateLine) {
	var maxLength = (dominateLine.length > subordinateLine.length ? dominateLine.length : subordinateLine.length);
	var newLine = "";

	for (var i = 0; i < maxLength; i++) {
		var newChar = "-";
		if (dominateLine.charAt(i) !== "")
			newChar = dominateLine.charAt(i);

		if (newChar == "-" && subordinateLine.charAt(i) !== "")
			newChar = subordinateLine.charAt(i);

		newLine += newChar;
	}

	return newLine;
};


// function grooveDataNew() {
// 	this.notesPerMeasure = 16;
// 	this.timeDivision = 16;
// 	this.numberOfMeasures = 1;
// 	this.numBeats = 4;  // TimeSigTop: Top part of Time Signture 3/4, 4/4, 5/4, 6/8, etc...
// 	this.noteValue = 4; // TimeSigBottom: Bottom part of Time Sig   4 = quarter notes, 8 = 8th notes, 16ths, etc..
// 	this.sticking_array = class_empty_note_array.slice(0); // copy by value
// 	this.hh_array = class_empty_note_array.slice(0);    // copy by value
// 	this.snare_array = class_empty_note_array.slice(0); // copy by value
// 	this.kick_array = class_empty_note_array.slice(0);  // copy by value
// 	// toms_array contains 4 toms  T1, T2, T3, T4 index starting at zero
// 	this.toms_array = [class_empty_note_array.slice(0), class_empty_note_array.slice(0), class_empty_note_array.slice(0), class_empty_note_array.slice(0)];
// 	this.showToms = false;
// 	this.showStickings = false;
// 	this.title = "";
// 	this.author = "";
// 	this.comments = "";
// 	this.showLegend = false;
// 	this.swingPercent = 0;
// 	this.tempo = constant_DEFAULT_TEMPO;
// 	this.kickStemsUp = true;
// 	this.metronomeFrequency = 0; // 0, 4, 8, 16
// 	// this.debugMode = root.debugMode;
// 	// this.grooveDBAuthoring = root.grooveDBAuthoring;
// 	// this.viewMode = root.viewMode;
// };