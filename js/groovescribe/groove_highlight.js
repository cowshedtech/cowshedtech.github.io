// Javascript for the Groove Scribe HTML application
// highlight the note, this is used to play along with the midi track
	// only one note for each instrument can be highlighted at a time
	// Also unhighlight other instruments if their index is not equal to the passed in index
	// this means that only notes falling on the current beat will be highlighted.
	var class_cur_hh_highlight_id = false;
	var class_cur_tom1_highlight_id = false;
	var class_cur_tom4_highlight_id = false;
	var class_cur_snare_highlight_id = false;
	var class_cur_kick_highlight_id = false;

	function hilight_individual_note(instrument, id) {
		var hilight_all_notes = true; // on by default

		id = Math.floor(id);
		if (id < 0 || id >= class_notes_per_measure * class_number_of_measures)
			return;

		// turn this one on;
		document.getElementById(instrument + id).style.borderColor = "orange";

		// turn off all the previously highlighted notes that are not on the same beat
		if (class_cur_hh_highlight_id !== false && class_cur_hh_highlight_id != id) {
			if (class_cur_hh_highlight_id < class_notes_per_measure * class_number_of_measures)
				document.getElementById("hi-hat" + class_cur_hh_highlight_id).style.borderColor = "transparent";
			class_cur_hh_highlight_id = false;
		}
		if (class_cur_tom1_highlight_id !== false && class_cur_tom1_highlight_id != id) {
			if (class_cur_tom1_highlight_id < class_notes_per_measure * class_number_of_measures)
				document.getElementById("tom1-" + class_cur_tom4_highlight_id).style.borderColor = "transparent";
			class_cur_tom1_highlight_id = false;
		}
		if (class_cur_tom4_highlight_id !== false && class_cur_tom4_highlight_id != id) {
			if (class_cur_tom4_highlight_id < class_notes_per_measure * class_number_of_measures)
				document.getElementById("tom4-" + class_cur_tom4_highlight_id).style.borderColor = "transparent";
			class_cur_tom4_highlight_id = false;
		}
		if (class_cur_snare_highlight_id !== false && class_cur_snare_highlight_id != id) {
			if (class_cur_snare_highlight_id < class_notes_per_measure * class_number_of_measures)
				document.getElementById("snare" + class_cur_snare_highlight_id).style.borderColor = "transparent";
			class_cur_snare_highlight_id = false;
		}
		if (class_cur_kick_highlight_id !== false && class_cur_kick_highlight_id != id) {
			if (class_cur_kick_highlight_id < class_notes_per_measure * class_number_of_measures)
				document.getElementById("kick" + class_cur_kick_highlight_id).style.borderColor = "transparent";
			class_cur_kick_highlight_id = false;
		}

		switch (instrument) {
			case "hi-hat":
				class_cur_hh_highlight_id = id;
				break;
			case "tom1":
				class_cur_tom1_highlight_id = id;
				break;
			case "tom4":
				class_cur_tom4_highlight_id = id;
				break;
			case "snare":
				class_cur_snare_highlight_id = id;
				break;
			case "kick":
				class_cur_kick_highlight_id = id;
				break;
			default:
				console.log("bad case in hilight_note");
				break;
		}

	}

	var class_cur_all_notes_highlight_id = false;

	function hilight_all_notes_on_same_beat(instrument, id, class_notes_per_measure, class_number_of_measures) {

		id = Math.floor(id);
		if (id < 0 || id >= class_notes_per_measure * class_number_of_measures)
			return;

		if (class_cur_all_notes_highlight_id === id)
			return; // already highligted

		if (class_cur_all_notes_highlight_id !== false) {
			// turn off old highlighting
			var bg_ele = document.getElementById("bg-highlight" + class_cur_all_notes_highlight_id)
			if (bg_ele) {
				bg_ele.style.background = "transparent";
			}
		}

		// turn this one on;
		class_cur_all_notes_highlight_id = id;
		document.getElementById("bg-highlight" + class_cur_all_notes_highlight_id).style.background = "rgba(50, 126, 173, 0.2)";
	}

	function hilight_note(instrument, percent_complete, class_permutation_type, class_num_beats_per_measure, class_note_value_per_measure, class_number_of_measures, class_notes_per_measure, usingTriplets) {

		if (percent_complete < 0) {
			clear_all_highlights("clear");
			return;
		}

		// if we are in a permutation, hightlight each measure as it goes
        // TODO
		if (class_permutation_type != "none")
			percent_complete = (percent_complete * get_numberOfActivePermutationSections()) % 1.0;

		var note_id_in_32 = Math.floor(percent_complete * calc_notes_per_measure((usingTriplets ? 48 : 32), class_num_beats_per_measure, class_note_value_per_measure) * class_number_of_measures);
        //var note_id_in_32 = Math.floor(percent_complete * calc_notes_per_measure((usingTriplets() ? 48 : 32), class_num_beats_per_measure, class_note_value_per_measure) * class_number_of_measures);
		var real_note_id = (note_id_in_32 / getNoteScaler(class_notes_per_measure, class_num_beats_per_measure, class_note_value_per_measure));

		//hilight_individual_note(instrument, id);
		hilight_all_notes_on_same_beat(instrument, real_note_id, class_notes_per_measure, class_number_of_measures);
	}

	function clear_all_highlights(instrument) {

		// now turn off  notes if necessary;
		if (class_cur_hh_highlight_id !== false) {
			document.getElementById("hi-hat" + class_cur_hh_highlight_id).style.borderColor = "transparent";
			class_cur_hh_highlight_id = false;
		}
		if (class_cur_tom1_highlight_id !== false) {
			document.getElementById("tom1-" + class_cur_tom1_highlight_id).style.borderColor = "transparent";
			class_cur_tom1_highlight_id = false;
		}
		if (class_cur_tom4_highlight_id !== false) {
			document.getElementById("tom4-" + class_cur_tom4_highlight_id).style.borderColor = "transparent";
			class_cur_tom4_highlight_id = false;
		}
		if (class_cur_snare_highlight_id !== false) {
			document.getElementById("snare" + class_cur_snare_highlight_id).style.borderColor = "transparent";
			class_cur_snare_highlight_id = false;
		}
		if (class_cur_kick_highlight_id !== false) {
			document.getElementById("kick" + class_cur_kick_highlight_id).style.borderColor = "transparent";
			class_cur_kick_highlight_id = false;
		}

		if (class_cur_all_notes_highlight_id !== false) {
			// turn off old highlighting
			var bg_ele = document.getElementById("bg-highlight" + class_cur_all_notes_highlight_id)
			if (bg_ele) {
				bg_ele.style.background = "transparent";
			}
			class_cur_all_notes_highlight_id = false;
		}

	}