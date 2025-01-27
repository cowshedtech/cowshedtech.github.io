// Javascript for the Groove Scribe HTML application


// takes a character from tablature form and converts it to our ABC Notation form.
	// uses drum tab format adapted from wikipedia: http://en.wikipedia.org/wiki/Drum_tablature
	//
	//  Sticking support:
	//		R: right
	//    L: left
	//
	//  HiHat support:
	//		x: normal
	//		X: accent
	//		o: open
	//		+: close
	//		c: crash
	//		r: ride
	//		b: ride bell
	//		m: (more) cow bell
	//    s: stacker
	//    n: metroNome normal
	//    N: metroNome accent
	//		-: off
	//
	//   Snare support:
	//		o: normal
	//		O: accent
	//		g: ghost
	//		x: cross stick
	//		f: flam
	//		-: off
	//
	//   Kick support:
	//		o: normal
	//		x: hi hat splash with foot
	//		X: kick & hi hat splash with foot simultaneously
	//
	//  Kick can be notated either with a "K" or a "B"
	//
	//  Note that "|" and " " will be skipped so that standard drum tabs can be applied
	//  Example:
	//     H=|x---x---x---x---|x---x---x---x---|x---x---x---x---|
	// or  H=x-x-x-x-x-x-x-x-x-x-x-x-
	//     S=|----o-------o---|----o-------o---|----o-------o---|
	// or  S=--o---o---o---o---o---o-
	//     B=|o-------o-------|o-------o-o-----|o-----o-o-------|
	// or  K=o---o---o----oo-o--oo---|
	// or  T1=|o---o---o---o|
	// or  T2=|o---o---o---o|
	// or  T3=|o---o---o---o|
	// or  T4=|o---o---o---o|
	function tablatureToABCNotationPerNote(drumType, tablatureChar) {

		switch (tablatureChar) {
		case "b":
		case "B":
			if (drumType == "Stickings")
				return constant_ABC_STICK_BOTH;
			else if (drumType == "H")
				return constant_ABC_HH_Ride_Bell;
			else if (drumType == "S")
				return constant_ABC_SN_Buzz;
			break;
		case "c":
			if (drumType == "Stickings")
				return constant_ABC_STICK_COUNT;
			else if (drumType == "H")
				return constant_ABC_HH_Crash;
			break;
		case "d":
			if (drumType == "S")
				return constant_ABC_SN_Drag;
			break;
		case "f":
			if (drumType == "S")
				return constant_ABC_SN_Flam;
			break;
		case "g":
			if (drumType == "S")
				return constant_ABC_SN_Ghost;
			break;
		case "l":
		case "L":
			if (drumType == "Stickings")
				return constant_ABC_STICK_L;
			break;
		case "m":  // (more) cow bell
			if (drumType == "H")
				return constant_ABC_HH_Cow_Bell;
			break;
		case "n":  // (more) cow bell
			if (drumType == "H")
				return constant_ABC_HH_Metronome_Normal;
			break;
		case "N":  // (more) cow bell
			if (drumType == "H")
				return constant_ABC_HH_Metronome_Accent;
			break;
		case "O":
			if (drumType == "S")
				return constant_ABC_SN_Accent;
			break;
		case "o":
			switch (drumType) {
			case "H":
				return constant_ABC_HH_Open;
				//break;
			case "S":
				return constant_ABC_SN_Normal;
				//break;
			case "K":
			case "B":
				return constant_ABC_KI_Normal;
				//break;
			case "T1":
				return constant_ABC_T1_Normal;
				//break;
			case "T2":
				return constant_ABC_T2_Normal;
				//break;
			case "T3":
				return constant_ABC_T3_Normal;
				//break;
			case "T4":
				return constant_ABC_T4_Normal;
				//break;
			default:
				break;
			}
			break;
		case "r":
		case "R":
			switch (drumType) {
			case "H":
				return constant_ABC_HH_Ride;
				//break;
			case "Stickings":
				return constant_ABC_STICK_R;
				//break;
			default:
				break;
			}
			break;
		case "s":
			if (drumType == "H")
				return constant_ABC_HH_Stacker;
			break;
		case "x":
			switch (drumType) {
			case "S":
				return constant_ABC_SN_XStick;
				//break;
			case "K":
			case "B":
				return constant_ABC_KI_Splash;
				//break;
			case "H":
				return constant_ABC_HH_Normal;
				//break;
			case "T1":
				return constant_ABC_T1_Normal;
				//break;
			case "T4":
				return constant_ABC_T4_Normal;
				//break;
			default:
				break;
			}
			break;
		case "X":
			switch (drumType) {
			case "K":
				return constant_ABC_KI_SandK;
				//break;
			case "H":
				return constant_ABC_HH_Accent;
				//break;
			default:
				break;
			}
			break;
		case "+":
			if (drumType == "H") {
				return constant_ABC_HH_Close;
			}
			break;
		case "-":
			return false;
			//break;
		default:
			break;
		}

		console.log("Bad tablature note found in tablatureToABCNotationPerNote.  Tab: " + tablatureChar + " for drum type: " + drumType);
		return false;
	}

    // same as above, but reversed
	function abcNotationToTablaturePerNote(drumType, abcChar) {
		var tabChar = "-";

		switch (abcChar) {
		case constant_ABC_STICK_R:
			tabChar = "R";
			break;
		case constant_ABC_STICK_L:
			tabChar = "L";
			break;
		case constant_ABC_STICK_BOTH:
			tabChar = "B";
			break;
		case constant_ABC_STICK_OFF:
			tabChar = "-";
			break;
		case constant_ABC_STICK_COUNT:
			tabChar = "c";
			break;
		case constant_ABC_HH_Ride:
			tabChar = "r";
			break;
		case constant_ABC_HH_Ride_Bell:
			tabChar = "b";
			break;
		case constant_ABC_HH_Cow_Bell:
			tabChar = "m";
			break;
		case constant_ABC_HH_Crash:
			tabChar = "c";
			break;
		case constant_ABC_HH_Stacker:
			tabChar = "s";
			break;
    case constant_ABC_HH_Metronome_Normal:
        tabChar = "n";
        break;
    case constant_ABC_HH_Metronome_Accent:
        tabChar = "N";
        break;
    case constant_ABC_HH_Open:
			tabChar = "o";
			break;
		case constant_ABC_HH_Close:
			tabChar = "+";
			break;
		case constant_ABC_SN_Accent:
			tabChar = "O";
			break;
		case constant_ABC_SN_Buzz:
			tabChar = "b";
			break;
		case constant_ABC_HH_Normal:
		case constant_ABC_SN_XStick:
			tabChar = "x";
			break;
		case constant_ABC_SN_Ghost:
			tabChar = "g";
			break;
		case constant_ABC_SN_Normal:
		case constant_ABC_KI_Normal:
		case constant_ABC_T1_Normal:
		case constant_ABC_T2_Normal:
		case constant_ABC_T3_Normal:
		case constant_ABC_T4_Normal:
			tabChar = "o";
			break;
		case constant_ABC_SN_Flam:
			tabChar = "f";
			break;
		case constant_ABC_SN_Drag:
			tabChar = "d";
			break;
		case constant_ABC_HH_Accent:
		case constant_ABC_KI_SandK:
			tabChar = "X";
			break;
		case constant_ABC_KI_Splash:
			tabChar = "x";
			break;
		case constant_ABC_OFF:
			tabChar = "-";
			break;
		default:
			console.log("bad case in abcNotationToTablaturePerNote: " + abcChar);
			break;
		}

		return tabChar;
	}


// take an array of notes in ABC format and convert it into a drum tab String
// drumType - H, S, K, or Stickings
// noteArray - pass in an ABC array of notes
// getAccents - true to get accent notes.  (false to ignore accents)
// getOthers - true to get non-accent notes.  (false to ignore non-accents)
// maxLength - set smaller than noteArray length to get fewer notes
// separatorDistance - set to greater than zero integer to add "|" between measures
function tabLineFromAbcNoteArray(drumType, noteArray, getAccents, getOthers, maxLength, separatorDistance) {
    var returnTabLine = "";

    if (maxLength > noteArray.length)
        maxLength = noteArray.length;

    for (var i = 0; i < maxLength; i++) {
        var newTabChar = abcNotationToTablaturePerNote(drumType, noteArray[i]);

        if (drumType == "H" && newTabChar == "X") {
            if (getAccents)
                returnTabLine += newTabChar;
            else
                returnTabLine += "-";
        } else if ((drumType == "K" || drumType == "S") && (newTabChar == "o" || newTabChar == "O")) {
            if (getAccents)
                returnTabLine += newTabChar;
            else
                returnTabLine += "-";
        } else if (drumType == "K" && newTabChar == "X") {
            if (getAccents && getOthers)
                returnTabLine += "X"; // kick & splash
            else if (getAccents)
                returnTabLine += "o"; // just kick
            else
                returnTabLine += "x"; // just splash
        } else {
            // all the "others"
            if (getOthers)
                returnTabLine += newTabChar;
            else
                returnTabLine += "-";
        }

        if ((separatorDistance > 0) && ((i+1) % separatorDistance) === 0)
            returnTabLine += "|";
    }

    return returnTabLine;
};

// the top stuff in the ABC that doesn't depend on the notes
function get_top_ABC_BoilerPlate(isPermutation, tuneTitle, tuneAuthor, tuneComments, showLegend, isTriplets, kick_stems_up, timeSigTop, timeSigBottom, renderWidth, grooveUtilsUniqueIndex) {

    // boiler plate
    var fullABC = '%abc\n%%fullsvg _' + grooveUtilsUniqueIndex + '\nX:6\n';

    fullABC += "M:" + timeSigTop + "/" + timeSigBottom + "\n";

    // always add a Title even if it's blank
    fullABC += "T: " + tuneTitle + "\n";

    if (tuneAuthor !== "") {
        fullABC += "C: " + tuneAuthor + "\n";
        fullABC += "%%musicspace 20px\n"; // add some more space
    }

    if (renderWidth < 400)
        renderWidth = 400; // min-width
    if (renderWidth > 3000)
        renderWidth = 3000; // max-width
    // the width of the music is always 25% bigger than what we pass in.   Go figure.
    renderWidth = Math.floor(renderWidth * 0.75);

    fullABC += "L:1/" + (32) + "\n"; // 4/4 = 32,  6/8 = 64

    if (isPermutation)
        fullABC += "%%stretchlast 0\n";
    else
        fullABC += "%%stretchlast 1\n";

    fullABC += '%%flatbeams 1\n' +
    '%%ornament up\n' +
    '%%pagewidth ' + renderWidth + 'px\n' +
    '%%leftmargin 0cm\n' +
    '%%rightmargin 0cm\n' +
    '%%topspace 10px\n' +
    '%%titlefont calibri 20\n' +
    '%%partsfont calibri 16\n' +
    '%%gchordfont calibri 16\n' +
    '%%annotationfont calibri 16\n' +
    '%%infofont calibri 16\n' +
    '%%textfont calibri 16\n' +
    '%%deco (. 0 a 5 1 1 "@-8,-3("\n' +
    '%%deco ). 0 a 5 1 1 "@4,-3)"\n' +
    '%%beginsvg\n' +
    ' <defs>\n' +
    ' <path id="Xhead" d="m-3,-3 l6,6 m0,-6 l-6,6" class="stroke" style="stroke-width:1.2"/>\n' +
    ' <path id="Trihead" d="m-3,2 l 6,0 l-3,-6 l-3,6 l6,0" class="stroke" style="stroke-width:1.2"/>\n' +
    ' </defs>\n' +
    '%%endsvg\n' +
    '%%map drum ^g heads=Xhead print=g       % Hi-Hat\n' +
    '%%map drum ^c\' heads=Xhead print=c\'   % Crash\n' +
    '%%map drum ^d\' heads=Xhead print=d\'   % Stacker\n' +
    '%%map drum ^e\' heads=Xhead print=e\'   % Metronome click\n' +
    '%%map drum ^f\' heads=Xhead print=f\'   % Metronome beep\n' +
    '%%map drum ^A\' heads=Xhead print=A\'   % Ride\n' +
    '%%map drum ^B\' heads=Trihead print=A\' % Ride Bell\n' +
    '%%map drum ^D\' heads=Trihead print=g   % Cow Bell\n' +
    '%%map drum ^c heads=Xhead print=c  % Cross Stick\n' +
    '%%map drum ^d, heads=Xhead print=d,  % Foot Splash\n';

    //if(kick_stems_up)
    //fullABC += "%%staves (Stickings Hands)\n";
    //else
    fullABC += "%%staves (Stickings Hands Feet)\n";

    // print comments below the legend if there is one, otherwise in the header section
    if (tuneComments !== "") {
        fullABC += "P: " + tuneComments + "\n";
        fullABC += "%%musicspace 20px\n"; // add some more space
    }

    // the K ends the header;
    fullABC += "K:C clef=perc\n";

    if (showLegend) {
        fullABC += 'V:Stickings\n' +
        'x8 x8 x8 x8 x8 x8 x8 x8 ||\n' +
        'V:Hands stem=up \n' +
        '%%voicemap drum\n' +
        '"^Hi-Hat"^g4 "^Open"!open!^g4 ' +
        '"^Crash"^c\'4 "^Stacker"^d\'4 "^Ride"^A\'4 "^Ride Bell"^B\'4 x2 "^Tom"e4 "^Tom"A4 "^Snare"c4 "^Buzz"!///!c4 "^Cross"^c4 "^Ghost  "!(.!!).!c4 "^Flam"{/c}c4  x10 ||\n' +
        'V:Feet stem=down \n' +
        '%%voicemap drum\n' +
        'x52 "^Kick"F4 "^HH foot"^d,4 x4 ||\n' +
        'T:\n';
    }

    // tempo setting
    //fullABC += "Q: 1/4=" + getTempo() + "\n";

    return fullABC;
};


// note1_array:   an array containing "false" or a note character in ABC to designate that is is on
	// note2_array:   an array containing "false" or a note character in ABC to designate that is is on
	// end_of_group:  when to stop looking ahead in the array.  (since we group notes in to beats)
	function getABCforNote(note_array_of_arrays, start_index, end_of_group, scaler) {

		var ABC_String = "";
		var abcNoteStrings = {
			notes1 : "",
			notes2 : "",
			notes3 : ""
		};
		var num_notes_on = 0;
		var nextCount;

		for(var which_array=0; which_array < note_array_of_arrays.length; which_array++) {

			if(note_array_of_arrays[which_array][start_index] !== undefined && note_array_of_arrays[which_array][start_index] !== false) {
				// look ahead and see when the next note is
				// the length of this note is dependant on when the next note lands
				// for every empty space we increment nextCount, and then make the note that long
				nextCount = 1;
				for (var indexA = start_index + 1; indexA < (start_index + end_of_group); indexA++) {
					if(!testArrayOfArraysForEquality(note_array_of_arrays, indexA, false)) {
						break;
					} else {
						nextCount++;
					}
				}

				abcNoteStrings.notes1 += note_array_of_arrays[which_array][start_index] + (scaler * nextCount);
				num_notes_on++;
			}
		}

		if (num_notes_on > 1) {
			// if multiple are on, we need to combine them with []
			// horrible hack.  Turns out ABC will render the accents wrong unless the are outside the brackets []
			// look for any accents that are delimited by "!"  (eg !accent!  or !plus!)
			// move the accents to the front
			ABC_String += moveAccentsOrOtherModifiersOutsideOfGroup(abcNoteStrings, "!accent!");
			// in case there are two accents (on both snare and hi-hat) we remove the second one
			moveAccentsOrOtherModifiersOutsideOfGroup(abcNoteStrings, "!accent!");
			ABC_String += moveAccentsOrOtherModifiersOutsideOfGroup(abcNoteStrings, "!plus!");
			ABC_String += moveAccentsOrOtherModifiersOutsideOfGroup(abcNoteStrings, "!open!");
			ABC_String += moveAccentsOrOtherModifiersOutsideOfGroup(abcNoteStrings, "!///!");

			// Look for '[' and ']'.   They are added on to the the kick and splash and could be added to other notes
			// in the future.   They imply that the notes are on the same beat.   Since we are already putting multiple
			// notes on the same beat (see code below this line that adds '[' & ']'), we need to remove them or the
			// resulting ABC will be invalid
			moveAccentsOrOtherModifiersOutsideOfGroup(abcNoteStrings, "[");
			moveAccentsOrOtherModifiersOutsideOfGroup(abcNoteStrings, "]");

			// this is the flam notation, it can't be in a sub grouping
			ABC_String += moveAccentsOrOtherModifiersOutsideOfGroup(abcNoteStrings, "{/c}");
			// this is the drag notation, it can't be in a sub grouping
			ABC_String += moveAccentsOrOtherModifiersOutsideOfGroup(abcNoteStrings, "{/cc}");

			ABC_String += "[" + abcNoteStrings.notes1 + abcNoteStrings.notes2 + abcNoteStrings.notes3 + "]"; // [^gc]
		} else {
			ABC_String += abcNoteStrings.notes1 + abcNoteStrings.notes2 + abcNoteStrings.notes3; // note this could be a noOp if all strings are blank
		}

		return ABC_String;
	}


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

    // looks for modifiers like !accent! or !plus! and moves them outside of the group abc array.
	// Most modifiers (but not all) will not render correctly if they are inside the abc group.
	// returns a string that should be added to the abc_notation if found.
	function moveAccentsOrOtherModifiersOutsideOfGroup(abcNoteStrings, modifier_to_look_for) {

		var found_modifier = false;
		var rindex = abcNoteStrings.notes1.lastIndexOf(modifier_to_look_for);
		if (rindex > -1) {
			found_modifier = true;
			abcNoteStrings.notes1 = abcNoteStrings.notes1.replace(modifier_to_look_for, "");
		}
		rindex = abcNoteStrings.notes2.lastIndexOf(modifier_to_look_for);
		if (rindex > -1) {
			found_modifier = true;
			abcNoteStrings.notes2 = abcNoteStrings.notes2.replace(modifier_to_look_for, "");
		}
		rindex = abcNoteStrings.notes3.lastIndexOf(modifier_to_look_for);
		if (rindex > -1) {
			found_modifier = true;
			abcNoteStrings.notes3 = abcNoteStrings.notes3.replace(modifier_to_look_for, "");
		}
		if (found_modifier)
			return modifier_to_look_for;

		return ""; // didn't find it so return nothing
	}


    // calculate the rest ABC string
	function getABCforRest(note_array_of_arrays, start_index, end_of_group, scaler, use_hidden_rest) {
		var ABC_String = "";

		// count the # of rest
		if (testArrayOfArraysForEquality(note_array_of_arrays, start_index, false)) {
			var restCount = 1;
			for (var indexB = start_index + 1; indexB < (start_index + end_of_group); indexB++) {
				if(!testArrayOfArraysForEquality(note_array_of_arrays, indexB, false))
					break;
				else
					restCount++;
			}

			// now output a rest for the duration of the rest count
			if (use_hidden_rest)
				ABC_String += "x" + (scaler * restCount);
			else
				ABC_String += "z" + (scaler * restCount);
		}

		return ABC_String;
	}

    // when we generate ABC we use a default larger note array and transpose it
	// For 8th note triplets that means we need to use a larger grouping to make it
	// scale correctly
	// The base array is now 32 notes long to support 32nd notes
	// since we would normally group by 4 we need to group by 8 since we are scaling it
	function abc_gen_note_grouping_size(usingTriplets, timeSigTop, timeSigBottom) {
		var note_grouping;

		if (usingTriplets) {
				note_grouping = 12;

		} else if(timeSigTop == 3) {
			// 3/4, 3/8, 3/16
			note_grouping =  8 * (4/timeSigBottom)
		} else if(timeSigTop % 6 == 0 && timeSigBottom % 8 == 0) {
			// 3/4, 6/8, 9/8, 12/8
			note_grouping = 12 * (8/timeSigBottom);
		} else {
			//note_grouping = 8 * (4/timeSigBottom);
			note_grouping = 8;
		}

		return note_grouping;
	}
