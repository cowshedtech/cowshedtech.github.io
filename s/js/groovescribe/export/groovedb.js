// Want to create something like this:
	//
	// {{GrooveTab
	// |HasTempo=90
	// |HasSwingPercent=0
	// |HasDivision=16
	// |HasMeasures=2
	// |HasNotesPerMeasure=32
	// |HasTimeSignature=4/4
	// |HasHiHatTab=x---o---+---x---x---o---+---x---x---o---+---x---x---o---+---x---
	// |HasSnareAccentTab=--------O-------------------O-----------O---------------O-------
	// |HasSnareOtherTab=--------------g-------------------g-----------g-----------------
	// |HasKickTab=o---------------o---o---------------o-----------o---o---------o-
	// |HasFootOtherTab=----------------------------------------------------------------
	// |HasTom1Tab=--------------------------------------------------------o-------
	// |HasTom4Tab=----------------o---------------------------------------o-------
	// |HasEditData=?GDB_Author=1&TimeSig=4/4&Div=32&Tempo=80&Measures=2&H=|--x-----x---x-------------------|--x-----x---x-------------------|&S=|----g-----g-------------ooo-o-o-|----g-----g-----------------gggg|&K=|o-----x-------o-o---------------|o-----x-------o-o---------------|&T1=|--------------------------------|------------------------x-------|&T4=|----------------x---------------|------------------------x-------|
	// }}
	//
	function updateGrooveDBSource() {
		if (!document.getElementById("GrooveDB_source") || document.getElementById("GrooveDB_source").style.display == 'none')
			return; // nothing to update

		var myGrooveData = editor.grooveDataFromClickableUI();

		var notesPerMeasureInTab = calc_notes_per_measure((usingTriplets() ? 48 : 32), editor.class_num_beats_per_measure, editor.class_note_value_per_measure);
		var maxNotesInTab = myGrooveData.numberOfMeasures * notesPerMeasureInTab;

		// scale up all the arrays to 48 or 32 notes so that they look normalized

		myGrooveData.hh_array = scaleNoteArrayToFullSize(myGrooveData.hh_array, myGrooveData.numberOfMeasures, myGrooveData.notesPerMeasure, myGrooveData.numBeats, myGrooveData.noteValue);
		myGrooveData.snare_array = scaleNoteArrayToFullSize(myGrooveData.snare_array, myGrooveData.numberOfMeasures, myGrooveData.notesPerMeasure, myGrooveData.numBeats, myGrooveData.noteValue);
		myGrooveData.kick_array = scaleNoteArrayToFullSize(myGrooveData.kick_array, myGrooveData.numberOfMeasures, myGrooveData.notesPerMeasure, myGrooveData.numBeats, myGrooveData.noteValue);
		myGrooveData.toms_array[0] = scaleNoteArrayToFullSize(myGrooveData.toms_array[0], myGrooveData.numberOfMeasures, myGrooveData.notesPerMeasure, myGrooveData.numBeats, myGrooveData.noteValue);
		myGrooveData.toms_array[3] = scaleNoteArrayToFullSize(myGrooveData.toms_array[3], myGrooveData.numberOfMeasures, myGrooveData.notesPerMeasure, myGrooveData.numBeats, myGrooveData.noteValue);

		var DBString = "{{GrooveTab";

		DBString += "\n|HasTempo=" + myGrooveData.tempo;
		DBString += "\n|HasSwingPercent=" + myGrooveData.swingPercent;
		DBString += "\n|HasDivision=" + myGrooveData.notesPerMeasure;
		DBString += "\n|HasMeasures=" + myGrooveData.numberOfMeasures;
		DBString += "\n|HasNotesPerMeasure=" + notesPerMeasureInTab;
		DBString += "\n|HasTimeSignature=" + myGrooveData.numBeats + "/" + myGrooveData.noteValue;
		DBString += "\n|HasHiHatTab=" + tabLineFromAbcNoteArray("H", myGrooveData.hh_array, true, true, maxNotesInTab, 0);
		DBString += "\n|HasSnareAccentTab=" + tabLineFromAbcNoteArray("S", myGrooveData.snare_array, true, false, maxNotesInTab, 0);
		DBString += "\n|HasSnareOtherTab=" + tabLineFromAbcNoteArray("S", myGrooveData.snare_array, false, true, maxNotesInTab, 0);
		DBString += "\n|HasKickTab=" + tabLineFromAbcNoteArray("K", myGrooveData.kick_array, true, false, maxNotesInTab, 0);
		DBString += "\n|HasFootOtherTab=" + tabLineFromAbcNoteArray("K", myGrooveData.kick_array, false, true, maxNotesInTab, 0);
		DBString += "\n|HasTom1Tab=" + tabLineFromAbcNoteArray("T1", myGrooveData.toms_array[0], false, true, maxNotesInTab, 0);
		DBString += "\n|HasTom4Tab=" + tabLineFromAbcNoteArray("T4", myGrooveData.toms_array[3], false, true, maxNotesInTab, 0);
		DBString += "\n|HasEditData=" + undoStack[undoStack.length - 1]

		DBString += "\n}}";

		document.getElementById("GrooveDB_source").value = DBString;
	};
