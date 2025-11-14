// Javascript for the Groove Scribe HTML application

var class_empty_note_array = Array(32).fill(false); // Optimized initialization

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


var global_grooveUtilsScriptSrc = "";
if (document.currentScript)
	global_grooveUtilsScriptSrc = document.currentScript.src;

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


function fill_array_with_value_false(array_of_notes, number_of_notes) {
	for (var i = 0; i < number_of_notes; i++) {
		array_of_notes[i] = false;
	}
}

// create a new instance of an array with all the values prefilled with false
function get_empty_note_array(number_of_notes) {

	var newArray = [number_of_notes];
	fill_array_with_value_false(newArray, number_of_notes);
	return newArray;
}


// create a new instance of an array with all the values prefilled with false
// the array size is 32nd notes for the current time signature
// 4/4 would be 32 notes
// 5/4 would be 40 notes
// 2/4 would be 16 notes
// 4/2 would be 32 notes
function get_empty_note_array_in_32nds() {
	var notes_per_4_beats = 32;
	if (usingTriplets())
		notes_per_4_beats = 48;
	var num_notes = (editor.track.numBeats * notes_per_4_beats) / editor.track.noteValue;

	return get_empty_note_array(num_notes);
}

/**
     * Format milliseconds into a duration string
     * @param {number} ms - Milliseconds
     * @returns {string} Formatted duration string
     */
function formatDuration(ms) {
	const hours = ms.getUTCHours();
	const minutes = ms.getUTCMinutes().toString().padStart(2, '0');
	const seconds = ms.getSeconds().toString().padStart(2, '0');
	return hours > 0 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
}

// Deep copy utility function
function deepCopy(obj) {
	if (obj === null || typeof obj !== 'object') return obj;
	
	if (Array.isArray(obj)) {
	  return obj.map(item => deepCopy(item));
	}
	
	const copy = {};
	for (const key in obj) {
	  if (Object.prototype.hasOwnProperty.call(obj, key)) {
		copy[key] = deepCopy(obj[key]);
	  }
	}
	return copy;
  }