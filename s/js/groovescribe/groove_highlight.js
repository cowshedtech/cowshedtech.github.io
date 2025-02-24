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
function hilight_note(instrument, percent_complete, class_permutation_type, class_num_beats_per_measure, class_note_value_per_measure, class_number_of_measures, class_notes_per_measure, class_repeated_measures, usingTriplets) {

    if (percent_complete < 0) {
        clear_all_highlights("clear");
        return;
    }

    // if we are in a permutation, highlight each measure as it goes
    if (class_permutation_type !== "none") {
        percent_complete = (percent_complete * get_numberOfActivePermutationSections()) % 1.0;
    }

    // How many extra measures are there due to repeats
    let totalRepeatMeasures = Array.from(class_repeated_measures.values()).reduce((acc, repeatedCounts) => acc + repeatedCounts - 1, 0);
    
    var notesPerMeasure = usingTriplets ? 48 : 32;
    let notes = calc_notes_per_measure(notesPerMeasure, class_num_beats_per_measure, class_note_value_per_measure);        
    
    // Where does our note sit in the total score
    var note_id_in_32 = Math.floor(percent_complete * calc_notes_per_measure(notesPerMeasure, class_num_beats_per_measure, class_note_value_per_measure) * (class_number_of_measures + totalRepeatMeasures));
    
    // Which measure are we currently on taking account of repeated measures
    let cursor = 0;
    let measure = 0;
    for (let i = 0; i < class_number_of_measures; i++) {
        let repeats = class_repeated_measures.get(i) || 1; 
        let nextCursor = cursor + notes * repeats - 1; // Calculate next cursor position once
        if (note_id_in_32 > cursor && note_id_in_32 < nextCursor) {
            measure = i;        
            break;
        }
        cursor = nextCursor; // Update cursor to next position
    }

    let adjusted_note_id_in_32 = measure * notesPerMeasure + note_id_in_32 % notesPerMeasure;
    var real_note_id = adjusted_note_id_in_32 / getNoteScaler(class_notes_per_measure, class_num_beats_per_measure, class_note_value_per_measure);

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

    if (class_cur_highlight_ids.all_notes !== false) {
        var bg_ele = document.getElementById("bg-highlight" + class_cur_highlight_ids.all_notes);
        if (bg_ele) {
            bg_ele.style.background = "transparent";
        }
        class_cur_highlight_ids.all_notes = false;
    }
}


// create an array that can be used for note mapping
// it is just an array of true/false that specifies weather a note can appear at that index
function create_note_mapping_array_for_highlighting(HH_array, snare_array, kick_array, toms_array, num_notes) {
    var mapping_array = new Array(num_notes).fill(false); // create large empty array and initialize to false

    for (var i = 0; i < num_notes; i++) {
        // Check if any of the main arrays have a true value
        if ((HH_array && HH_array[i]) || (snare_array && snare_array[i]) || (kick_array && kick_array[i])) {
            mapping_array[i] = true;
        } else if (toms_array) { // Only check toms if necessary
            for (var j = 0; j < constant_NUMBER_OF_TOMS; j++) {
                if (toms_array[j][i]) { // Simplified check
                    mapping_array[i] = true;
                    break; // Exit loop early if a match is found
                }
            }
        }
    }

    return mapping_array;
};


// Helper function to calculate the real note index from the mapping array
function getRealNoteIndex(notePosition, noteMappingArray) {
    var real_note_index = -1;
    for (var i = 0; i < notePosition && i < noteMappingArray.length; i++) {
        if (noteMappingArray[i]) real_note_index++;
    }
    return real_note_index;
};


//
//
//
function getCurrentMeasureWithRepeats(curNoteIndexNew, numberOfMeasures, repeatedMeasures) {
    let cursor = 0;
    let measure = 0;
    for (let i = 0; i < numberOfMeasures; i++) {
        let repeats = repeatedMeasures.get(i) || 1; 
        let nextCursor = cursor + 32 * repeats - 1; 
        if (curNoteIndexNew > cursor && curNoteIndexNew < nextCursor) {
            measure = i;        
            break;
        }
        cursor = nextCursor; // Update cursor to next position
    }
    return measure;
};

var abcNoteNumCurrentlyHighlighted = -1;
function clearHighlightNoteInABCSVG(grooveUtilsUniqueIndex) {
    if (abcNoteNumCurrentlyHighlighted > -1) {
        var myElements = document.querySelectorAll("#abcNoteNum_" + grooveUtilsUniqueIndex + "_" + abcNoteNumCurrentlyHighlighted);
        for (var i = 0; i < myElements.length; i++) {
            //note.className = note.className.replace(new RegExp(' highlighted', 'g'), "");
            var class_name = myElements[i].getAttribute("class");
            myElements[i].setAttribute("class", class_name.replace(new RegExp(' highlighted', 'g'), ""));

            // TODO
            // if (root.debugMode && i === 0) {
            //     if (!isElementOnScreen(myElements[i])) {
            //         if (abcNoteNumCurrentlyHighlighted === 0)
            //             myElements[i].scrollIntoView({ block: "start", behavior: "smooth" });   // autoscroll if necessary
            //         else
            //             myElements[i].scrollIntoView({ block: "end", behavior: "smooth" });   // autoscroll if necessary
            //     }
            // }
        }
        abcNoteNumCurrentlyHighlighted = -1;
    }
};

	
// set note to -1 to unhighlight all notes
function highlightNoteInABCSVGByIndex(grooveUtilsUniqueIndex, noteToHighlight) {

    clearHighlightNoteInABCSVG(grooveUtilsUniqueIndex);

    var myElements = document.querySelectorAll("#abcNoteNum_" + grooveUtilsUniqueIndex + "_" + noteToHighlight);
    for (var i = 0; i < myElements.length; i++) {
        myElements[i].setAttribute("class", myElements[i].getAttribute("class") + " highlighted");
        abcNoteNumCurrentlyHighlighted = noteToHighlight;
    }
};

// cross index the percent complete with the myGrooveData note arrays to find the nth note
// Then highlight the note
function highlightNoteInABCSVGFromPercentComplete(grooveUtilsUniqueIndex, note_mapping_array, percentComplete, numberOfMeasures, repeatedMeasures) {

    if (note_mapping_array === null) return
        
    // How many measures do we have when we include repeats
    let totalMeasures = numberOfMeasures + Array.from(repeatedMeasures.values()).reduce((sum, repeats) => sum + (repeats - 1), 0);
    
    // How far through are we when we consider repeats in the total
    var curNoteIndexNew = percentComplete * 32 * totalMeasures;
    
    // Which measure are we currently on taking account of repeated measures
    let measure = getCurrentMeasureWithRepeats(curNoteIndexNew, numberOfMeasures, repeatedMeasures);
    
    // Figure out our adjusted note position taking account of repeated measures
    let adjusted_note_id_in_32 = measure * 32 + curNoteIndexNew % 32;
    
    // Now figure out which actual note we are on in abc
    var real_note_index = getRealNoteIndex(adjusted_note_id_in_32, note_mapping_array);
    
    // now the real_note_index should map to the correct abc note, highlight italics
    highlightNoteInABCSVGByIndex(grooveUtilsUniqueIndex, real_note_index);	
};