// Javascript for the Groove Scribe HTML application

var class_empty_note_array = Array(32).fill(false); // Optimized initialization

// build a string that looks like this
//  |----------------|----------------|
function GetEmptyGroove(notes_per_measure, numMeasures) {
	var oneMeasureString = "|" + "-".repeat(notes_per_measure) + "|"; // Optimized measure string creation
	var retString = oneMeasureString.repeat(numMeasures); // Use repeat to create the full string

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
	var maxLength = Math.max(dominateLine.length, subordinateLine.length);
	var newLine = "";

	for (var i = 0; i < maxLength; i++) {
		var dominateChar = dominateLine.charAt(i);
		var subordinateChar = subordinateLine.charAt(i);
		var newChar = dominateChar !== "-" ? dominateChar : subordinateChar;
		newLine += newChar !== "" ? newChar : "-";
	}

	return newLine;
};


// take an array of arrays and use a for loop to test to see
// if all of the arrays are equal to the "test_value" for a given "test_index"
// returns "true" if they are all equal.
// returns "false" if any one of them fails
function testArrayOfArraysForEquality(array_of_arrays, test_index, test_value) {
	return array_of_arrays.every(array => array[test_index] === test_value);
}

//
//
// function to return 1,e,&,a or 2,3,4,5,6, etc...
function figure_out_sticking_count_for_index(index, notes_per_measure, sub_division, time_sig_bottom) {

	// figure out the count state by looking at the id and the subdivision
	var note_index = index % notes_per_measure;
	var new_state = 0;
	var implied_sub_division = sub_division * (4 / time_sig_bottom);

	if (implied_sub_division === 4) {
		new_state = note_index + 1;   // 1,2,3,4,5, etc.
	} else if (implied_sub_division === 8) {
		new_state = (note_index % 2 === 0) ? Math.floor(note_index / 2) + 1 : "&";
	} else if (implied_sub_division === 12) {
		new_state = (note_index % 3 === 0) ? Math.floor(note_index / 3) + 1 : (note_index % 3 === 1 ? "&" : "a");
	} else if (implied_sub_division === 24) {
		new_state = (note_index % 3 === 0) ? Math.floor(note_index / 6) + 1 : (note_index % 3 === 1 ? "&" : "a");
	} else if (implied_sub_division === 48) {
		new_state = (note_index % 3 === 0) ? Math.floor(note_index / 12) + 1 : (note_index % 3 === 1 ? "&" : "a");
	} else {
		var whole_note_interval = implied_sub_division / 4;
		if (note_index % 4 === 0) {
			new_state = Math.floor(note_index / whole_note_interval) + 1;  // 1,1,2,2,3,3,4,4,5,5, etc.
		} else {
			new_state = (note_index % 4 === 1) ? "e" : (note_index % 4 === 2 ? "&" : "a");
		}
	}

	return new_state;
};


// converts the symbol for a sticking count to an actual count based on the time signature
function convert_sticking_counts_to_actual_counts(sticking_array, time_division, timeSigTop, timeSigBottom) {

	const cur_div_of_array = isTripletDivision(time_division) ? 48 : 32;
	const actual_notes_per_measure_in_this_array = calc_notes_per_measure(cur_div_of_array, timeSigTop, timeSigBottom);
	const notes_per_measure_in_time_division = ((time_division / 4) * timeSigTop) * (4 / timeSigBottom);

	sticking_array.forEach((count, i) => {
		if (count === constant_ABC_STICK_COUNT) {
			const adjusted_index = Math.floor(i / (actual_notes_per_measure_in_this_array / notes_per_measure_in_time_division));
			const new_count = figure_out_sticking_count_for_index(adjusted_index, notes_per_measure_in_time_division, time_division, timeSigBottom);
			sticking_array[i] = `"${new_count}"x`;
		}
	});
};


var baseLocation = ""; // global
function getGrooveUtilsBaseLocation() {

    if (baseLocation.length > 0)
        return baseLocation;

    if (global_grooveUtilsScriptSrc !== "") {
        var lastSlash = global_grooveUtilsScriptSrc.lastIndexOf("/");
        // lets find the slash before it since we need to go up a directory
        lastSlash = global_grooveUtilsScriptSrc.lastIndexOf("/", lastSlash - 1);
        baseLocation = global_grooveUtilsScriptSrc.slice(0, lastSlash + 1);
    }

    if (baseLocation.length < 1) {
        baseLocation = "https://b125c4f8bf7d89726feec9ab8202d31e0c8d14d8.googledrive.com/host/0B2wxVWzVoWGYfnB5b3VTekxyYUowVjZ5YVE3UllLaVk5dVd4TzF4Q2ZaUXVsazhNSTdRM1E/";
    }

    return baseLocation;
};