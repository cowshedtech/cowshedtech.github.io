// Javascript for the Groove Scribe HTML application

var class_cur_highlight_ids = {
    "hi-hat": false,
    "tom1": false,
    "tom4": false,
    "snare": false,
    "kick": false,
    "all_notes": false
};

//
//
//
function hilight_note(instrument, percent_complete, class_permutation_type, class_num_beats_per_measure, class_note_value_per_measure, class_number_of_measures, class_notes_per_measure, usingTriplets) {

    if (percent_complete < 0) {
        clear_all_highlights("clear");
        return;
    }

    // if we are in a permutation, highlight each measure as it goes
    if (class_permutation_type !== "none") {
        percent_complete = (percent_complete * get_numberOfActivePermutationSections()) % 1.0;
    }

    var notesPerMeasure = usingTriplets ? 48 : 32;
    var note_id_in_32 = Math.floor(percent_complete * calc_notes_per_measure(notesPerMeasure, class_num_beats_per_measure, class_note_value_per_measure) * class_number_of_measures);
    var real_note_id = note_id_in_32 / getNoteScaler(class_notes_per_measure, class_num_beats_per_measure, class_note_value_per_measure);

    hilight_all_notes_on_same_beat(instrument, real_note_id, class_notes_per_measure, class_number_of_measures);
}


//
//
//
function hilight_all_notes_on_same_beat(instrument, id, class_notes_per_measure, class_number_of_measures) {

    id = Math.floor(id);
    if (id < 0 || id >= class_notes_per_measure * class_number_of_measures)
        return;

    if (class_cur_highlight_ids.all_notes === id)
        return; // already highlighted

    // turn off old highlighting if necessary
    if (class_cur_highlight_ids.all_notes !== false) {
        var bg_ele = document.getElementById("bg-highlight" + class_cur_highlight_ids.all_notes);
        if (bg_ele) {
            bg_ele.style.background = "transparent";
        }
    }

    // turn this one on
    class_cur_highlight_ids.all_notes = id;
    document.getElementById("bg-highlight" + class_cur_highlight_ids.all_notes).style.background = "rgba(50, 126, 173, 0.2)";
}



//
//
//
function clear_all_highlights(instrument) {

    // now turn off notes if necessary;
    for (let key in class_cur_highlight_ids) {
        if (class_cur_highlight_ids[key] !== false) {
            document.getElementById(key + class_cur_highlight_ids[key]).style.borderColor = "transparent";
            class_cur_highlight_ids[key] = false;
        }
    }

    if (class_cur_highlight_ids.all_notes !== false) {
        // turn off old highlighting
        var bg_ele = document.getElementById("bg-highlight" + class_cur_highlight_ids.all_notes);
        if (bg_ele) {
            bg_ele.style.background = "transparent";
        }
        class_cur_highlight_ids.all_notes = false;
    }

}