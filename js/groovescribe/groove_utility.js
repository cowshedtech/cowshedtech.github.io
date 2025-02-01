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


// take an array of arrays and use a for loop to test to see
// if all of the arrays are equal to the "test_value" for a given "test_index"
// returns "true" if they are all equal.
// returns "false" if any one of them fails
function testArrayOfArraysForEquality(array_of_arrays, test_index, test_value) {

	for(var i = 0; i < array_of_arrays.length; i++) {
		if(array_of_arrays[i][test_index] !== undefined && array_of_arrays[i][test_index] !== test_value)
			return false;
	}

	return true;
}



// function to return 1,e,&,a or 2,3,4,5,6, etc...
function figure_out_sticking_count_for_index(index, notes_per_measure, sub_division, time_sig_bottom) {

	// figure out the count state by looking at the id and the subdivision
	var note_index = index % notes_per_measure;
	var new_state = 0;
	// 4/2 time changes the implied time from 4 up to 8, etc
	// 6/8 time changes the implied time from 8 down to 4
	var implied_sub_division = sub_division * (4 / time_sig_bottom);
	switch (implied_sub_division) {
		case 4:
			new_state = note_index + 1;   // 1,2,3,4,5, etc.
			break;
		case 8:
			if (note_index % 2 === 0)
				new_state = Math.floor(note_index / 2) + 1;  // 1,2,3,4,5, etc.
			else
				new_state = "&";
			break;
		case 12:  // 8th triplets
			if (note_index % 3 === 0)
				new_state = Math.floor(note_index / 3) + 1;  // 1,2,3,4,5, etc.
			else if (note_index % 3 == 1)
				new_state = "&";
			else
				new_state = "a";
			break;
		case 24:  // 16th triplets
			if (note_index % 3 === 0)
				new_state = Math.floor(note_index / 6) + 1;  // 1,2,3,4,5, etc.
			else if (note_index % 3 == 1)
				new_state = "&";
			else
				new_state = "a";
			break;
		case 48:  // 32nd triplets
			if (note_index % 3 === 0)
				new_state = Math.floor(note_index / 12) + 1;  // 1,2,3,4,5, etc.
			else if (note_index % 3 == 1)
				new_state = "&";
			else
				new_state = "a";
			break;
		case 16:
		case 32:  // fall through
		default:
			var whole_note_interval = implied_sub_division / 4;
			if (note_index % 4 === 0)
				new_state = Math.floor(note_index / whole_note_interval) + 1;  // 1,1,2,2,3,3,4,4,5,5, etc.
			else if (note_index % 4 === 1)
				new_state = "e";
			else if (note_index % 4 === 2)
				new_state = "&";
			else
				new_state = "a";
			break;
	}

	return new_state;
};


// converts the symbol for a sticking count to an actual count based on the time signature
function convert_sticking_counts_to_actual_counts(sticking_array, time_division, timeSigTop, timeSigBottom) {

	var cur_div_of_array = 32;
	if (isTripletDivision(time_division))
		cur_div_of_array = 48;

	var actual_notes_per_measure_in_this_array = calc_notes_per_measure(cur_div_of_array, timeSigTop, timeSigBottom);

	// Time division is 4, 8, 16, 32, 12, 24, or 48
	var notes_per_measure_in_time_division = ((time_division / 4) * timeSigTop) * (4 / timeSigBottom);

	for (var i in sticking_array) {
		if (sticking_array[i] == constant_ABC_STICK_COUNT) {
			// convert the COUNT into an actual letter or number
			// convert the index into what it would have been if the array was "notes_per_measure" sized
			var adjusted_index = Math.floor(i / (actual_notes_per_measure_in_this_array / notes_per_measure_in_time_division));
			var new_count = figure_out_sticking_count_for_index(adjusted_index, notes_per_measure_in_time_division, time_division, timeSigBottom);
			var new_count_string = '"' + new_count + '"x';
			sticking_array[i] = new_count_string;
		}
	}
};