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