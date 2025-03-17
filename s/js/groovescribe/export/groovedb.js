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

		var track = editor.grooveDataFromClickableUI();

		var notesPerMeasureInTab = calc_notes_per_measure((usingTriplets() ? 48 : 32), editor.track.numBeats, editor.class_note_value_per_measure);
		var maxNotesInTab = track.numberOfMeasures * notesPerMeasureInTab;

		// scale up all the arrays to 48 or 32 notes so that they look normalized

		track.hh_array = scaleNoteArrayToFullSize(track.hh_array, track.numberOfMeasures, track.notesPerMeasure, track.numBeats, track.noteValue);
		track.snare_array = scaleNoteArrayToFullSize(track.snare_array, track.numberOfMeasures, track.notesPerMeasure, track.numBeats, track.noteValue);
		track.kick_array = scaleNoteArrayToFullSize(track.kick_array, track.numberOfMeasures, track.notesPerMeasure, track.numBeats, track.noteValue);
		track.toms_array[0] = scaleNoteArrayToFullSize(track.toms_array[0], track.numberOfMeasures, track.notesPerMeasure, track.numBeats, track.noteValue);
		track.toms_array[3] = scaleNoteArrayToFullSize(track.toms_array[3], track.numberOfMeasures, track.notesPerMeasure, track.numBeats, track.noteValue);

		var DBString = "{{GrooveTab";

		DBString += "\n|HasTempo=" + midiPlayer.getTempo();
		DBString += "\n|HasSwingPercent=" + midiPlayer.getSwing();
		DBString += "\n|HasDivision=" + track.notesPerMeasure;
		DBString += "\n|HasMeasures=" + track.numberOfMeasures;
		DBString += "\n|HasNotesPerMeasure=" + notesPerMeasureInTab;
		DBString += "\n|HasTimeSignature=" + track.numBeats + "/" + track.noteValue;
		DBString += "\n|HasHiHatTab=" + tabLineFromAbcNoteArray("H", track.hh_array, true, true, maxNotesInTab, 0);
		DBString += "\n|HasSnareAccentTab=" + tabLineFromAbcNoteArray("S", track.snare_array, true, false, maxNotesInTab, 0);
		DBString += "\n|HasSnareOtherTab=" + tabLineFromAbcNoteArray("S", track.snare_array, false, true, maxNotesInTab, 0);
		DBString += "\n|HasKickTab=" + tabLineFromAbcNoteArray("K", track.kick_array, true, false, maxNotesInTab, 0);
		DBString += "\n|HasFootOtherTab=" + tabLineFromAbcNoteArray("K", track.kick_array, false, true, maxNotesInTab, 0);
		DBString += "\n|HasTom1Tab=" + tabLineFromAbcNoteArray("T1", track.toms_array[0], false, true, maxNotesInTab, 0);
		DBString += "\n|HasTom4Tab=" + tabLineFromAbcNoteArray("T4", track.toms_array[3], false, true, maxNotesInTab, 0);
		DBString += "\n|HasEditData=" + undoStack[undoStack.length - 1]

		DBString += "\n}}";

		document.getElementById("GrooveDB_source").value = DBString;
	};
