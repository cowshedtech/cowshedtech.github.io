// public function
// function to create HTML for the music staff and notes.   We usually want more than one of these
// baseIndex is the index for the css labels "staff-container1, staff-container2"
// indexStartForNotes is the index for the note ids.
function HTMLforPermutationOptions(class_permutation_type, usingTriplets) {

    if (class_permutation_type == "none")
        return "";

    var optionTypeArray = [{
        id: "PermuationOptionsOstinato",
        subid: "PermuationOptionsOstinato_sub",
        name: "Ostinato",
        SubOptions: [],
        defaultOn: false
    }, {
        id: "PermuationOptionsSingles",
        subid: "PermuationOptionsSingles_sub",
        name: "Singles",
        SubOptions: ["1", "&", "a"],
        defaultOn: true
    }, {
        id: "PermuationOptionsDoubles",
        subid: "PermuationOptionsDoubles_sub",
        name: "Doubles",
        SubOptions: ["1", "&", "a"],
        defaultOn: true
    }, {
        id: "PermuationOptionsTriples",
        subid: "PermuationOptionsTriples_sub",
        name: "Triples",
        SubOptions: [],
        defaultOn: true
    }
    ];

    // change and add other options for non triplet based ostinatos
    // Most of the types have 4 sub options
    // add up beats and down beats
    // add quads
    if (!usingTriplets) {
        optionTypeArray[1].SubOptions = ["1", "e", "&", "a"]; // singles
        optionTypeArray[2].SubOptions = ["1", "e", "&", "a"]; // doubles
        optionTypeArray[3].SubOptions = ["1", "e", "&", "a"]; // triples
        optionTypeArray.splice(3, 0, {
            id: "PermuationOptionsUpsDowns",
            subid: "PermuationOptionsUpsDowns_sub",
            name: "Downbeats/Upbeats",
            SubOptions: ["downs", "ups"],
            defaultOn: false
        });
        optionTypeArray.splice(5, 0, {
            id: "PermuationOptionsQuads",
            subid: "PermuationOptionsQuads_sub",
            name: "Quads",
            SubOptions: [],
            defaultOn: false
        });
    }

    switch (class_permutation_type) {
        case "snare_16ths":
            optionTypeArray.splice(0, 0, {
                id: "PermuationOptionsAccentGrid",
                subid: "",
                name: "Use Accent Grid",
                SubOptions: [],
                defaultOn: false
            });
            break;
        case "kick_16ths":
            if (!usingTriplets)
                optionTypeArray.splice(0, 0, {
                    id: "PermuationOptionsSkipSomeFirstNotes",
                    subid: "",
                    name: "Simplify multiple kicks",
                    SubOptions: [],
                    defaultOn: false
                });
            break;
        default:
            console.log("Bad case in HTMLforPermutationOptions()");
            break;
    }

    var newHTML = '<span id="PermutationOptionsHeader">Permutation Options</span>\n';

    newHTML += '<span class="PermutationOptionWrapper">';

    for (var optionType in optionTypeArray) {

        newHTML += '' +
            '<div class="PermutationOptionGroup" id="' + optionTypeArray[optionType].id + 'Group">\n' +
            '<div class="PermutationOption">\n' +
            '<input ' + (optionTypeArray[optionType].defaultOn ? "checked" : "") + ' type="checkbox" class="myCheckbox" id="' + optionTypeArray[optionType].id + '" onClick="myGrooveWriter.permutationOptionClick(event)">' +
            '<label for="' + optionTypeArray[optionType].id + '">' + optionTypeArray[optionType].name + '</label>\n' +
            '</div>' +
            '<span class="permutationSubOptionContainer" id="' + optionTypeArray[optionType].subid + '">\n';

        var count = 0;
        for (var optionName in optionTypeArray[optionType].SubOptions) {
            count++;
            newHTML += '' +
                '<span class="PermutationSubOption">\n' +
                '	<input ' + (optionTypeArray[optionType].defaultOn ? "checked" : "") + ' type="checkbox" class="myCheckbox" id="' + optionTypeArray[optionType].subid + count + '" onClick="myGrooveWriter.permutationSubOptionClick(event)">' +
                '	<label for="' + optionTypeArray[optionType].subid + count + '">' + optionTypeArray[optionType].SubOptions[optionName] + '</label>' +
                '</span>';
        }

        newHTML += '' +
            '	</span>\n' +
            '</div>\n';
    }

    newHTML += '</span>\n';
    return newHTML;
};


// 16th note permutation array expressed in 32nd notes
// some kicks are excluded at the beginning of the measure to make the groupings
// easier to play through continuously
function get_kick16th_minus_some_strait_permutation_array(section) {
    var kick_array;

    switch (section) {
        case 0:
            kick_array = [false, false, false, false, false, false, false, false,
                false, false, false, false, false, false, false, false,
                false, false, false, false, false, false, false, false,
                false, false, false, false, false, false, false, false];
            break;
        case 1:
            kick_array = ["F", false, false, false, false, false, false, false,
                "F", false, false, false, false, false, false, false,
                "F", false, false, false, false, false, false, false,
                "F", false, false, false, false, false, false, false];
            break;
        case 2:
            kick_array = [false, false, "F", false, false, false, false, false,
                false, false, "F", false, false, false, false, false,
                false, false, "F", false, false, false, false, false,
                false, false, "F", false, false, false, false, false];
            break;
        case 3:
            kick_array = [false, false, false, false, "F", false, false, false,
                false, false, false, false, "F", false, false, false,
                false, false, false, false, "F", false, false, false,
                false, false, false, false, "F", false, false, false];
            break;
        case 4:
            kick_array = [false, false, false, false, false, false, "F", false,
                false, false, false, false, false, false, "F", false,
                false, false, false, false, false, false, "F", false,
                false, false, false, false, false, false, "F", false];
            break;
        case 5:
            kick_array = ["F", false, "F", false, false, false, false, false,
                "F", false, "F", false, false, false, false, false,
                "F", false, "F", false, false, false, false, false,
                "F", false, "F", false, false, false, false, false];
            break;
        case 6:
            kick_array = [false, false, "F", false, "F", false, false, false,
                false, false, "F", false, "F", false, false, false,
                false, false, "F", false, "F", false, false, false,
                false, false, "F", false, "F", false, false, false];
            break;
        case 7:
            kick_array = [false, false, false, false, "F", false, "F", false,
                false, false, false, false, "F", false, "F", false,
                false, false, false, false, "F", false, "F", false,
                false, false, false, false, "F", false, "F", false];
            break;
        case 8:
            kick_array = [false, false, false, false, false, false, "F", false,
                "F", false, false, false, false, false, "F", false,
                "F", false, false, false, false, false, "F", false,
                "F", false, false, false, false, false, "F", false];
            break;
        case 9: // downbeats
            kick_array = ["F", false, false, false, "F", false, false, false,
                "F", false, false, false, "F", false, false, false,
                "F", false, false, false, "F", false, false, false,
                "F", false, false, false, "F", false, false, false];
            break;
        case 10: // upbeats
            kick_array = [false, false, "F", false, false, false, "F", false,
                false, false, "F", false, false, false, "F", false,
                false, false, "F", false, false, false, "F", false,
                false, false, "F", false, false, false, "F", false];
            break;
        case 11:
            kick_array = ["F", false, "F", false, "F", false, false, false,
                "F", false, "F", false, "F", false, false, false,
                "F", false, "F", false, "F", false, false, false,
                "F", false, "F", false, "F", false, false, false];
            break;
        case 12:
            kick_array = [false, false, "F", false, "F", false, "F", false,
                false, false, "F", false, "F", false, "F", false,
                false, false, "F", false, "F", false, "F", false,
                false, false, "F", false, "F", false, "F", false];
            break;
        case 13:
            kick_array = [false, false, false, false, "F", false, "F", false,
                "F", false, false, false, "F", false, "F", false,
                "F", false, false, false, "F", false, "F", false,
                "F", false, false, false, "F", false, "F", false];
            break;
        case 14:
            kick_array = [false, false, false, false, false, false, "F", false,
                "F", false, "F", false, false, false, "F", false,
                "F", false, "F", false, false, false, "F", false,
                "F", false, "F", false, false, false, "F", false];
            break;
        case 15:
        /* falls through */
        default:
            kick_array = ["F", false, "F", false, "F", false, "F", false,
                "F", false, "F", false, "F", false, "F", false,
                "F", false, "F", false, "F", false, "F", false,
                "F", false, "F", false, "F", false, "F", false];
            break;
    }

    return kick_array;
}

// 16th note permutation array expressed in 32nd notes
// all kicks are included, including the ones that start the measure
function get_kick16th_strait_permutation_array(section) {
    var kick_array = [];
    for (var index = 0; index < 32; index++) {
        switch (section) {
            case 0:
                // no notes on
                kick_array.push(false);
                break;
            case 1:
                // every 0th note of 8
                kick_array.push((index % 8) ? false : 'F');
                break;
            case 2:
                // every 2nd note of 8
                kick_array.push(((index - 2) % 8) ? false : 'F');
                break;
            case 3:
                // every 4nd note of 8
                kick_array.push(((index - 4) % 8) ? false : 'F');
                break;
            case 4:
                // every 6nd note of 8
                kick_array.push(((index - 6) % 8) ? false : 'F');
                break;
            case 5:
                // every 0th and 2nd
                if ((index % 8) == 0)
                    kick_array.push('F');
                else if (((index - 2) % 8) == 0)
                    kick_array.push('F');
                else
                    kick_array.push(false);
                break;
            case 6:
                // every 2nd & 4th
                if (((index - 2) % 8) == 0)
                    kick_array.push('F');
                else if (((index - 4) % 8) == 0)
                    kick_array.push('F');
                else
                    kick_array.push(false);
                break;
            case 7:
                // every 4th & 6th
                if (((index - 4) % 8) == 0)
                    kick_array.push('F');
                else if (((index - 6) % 8) == 0)
                    kick_array.push('F');
                else
                    kick_array.push(false);
                break;
            case 8:
                // every 0th & 6th
                if (((index - 0) % 8) == 0)
                    kick_array.push('F');
                else if (((index - 6) % 8) == 0)
                    kick_array.push('F');
                else
                    kick_array.push(false);
                break;
            case 9: // downbeats
                // every 0th note of 4
                kick_array.push((index % 4) ? false : 'F');
                break;
            case 10: // upbeats
                // every 2nd note of 4
                kick_array.push(((index - 2) % 4) ? false : 'F');
                break;
            case 11:
                return kick_array = ["F", false, "F", false, "F", false, false, false,
                    "F", false, "F", false, "F", false, false, false,
                    "F", false, "F", false, "F", false, false, false,
                    "F", false, "F", false, "F", false, false, false];
                break;
            case 12:
                return kick_array = [false, false, "F", false, "F", false, "F", false,
                    false, false, "F", false, "F", false, "F", false,
                    false, false, "F", false, "F", false, "F", false,
                    false, false, "F", false, "F", false, "F", false];
                break;
            case 13:
                return kick_array = ["F", false, false, false, "F", false, "F", false,
                    "F", false, false, false, "F", false, "F", false,
                    "F", false, false, false, "F", false, "F", false,
                    "F", false, false, false, "F", false, "F", false];
                break;
            case 14:
                return kick_array = ["F", false, "F", false, false, false, "F", false,
                    "F", false, "F", false, false, false, "F", false,
                    "F", false, "F", false, false, false, "F", false,
                    "F", false, "F", false, false, false, "F", false];
                break;
            case 15:
            /* falls through */
            default:
                // every 0th note of 2  (quads)
                kick_array.push((index % 2) ? false : 'F');
                break;
                break;
        }
    }

    console.log(kick_array)
    return kick_array;
}

// 48th note triplet kick permutation
function get_kick16th_triplets_permutation_array(section) {
    var kick_array = [];
    for (var index = 0; index < 48; index++) {

        switch (section) {
            case 0:
                // no notes on
                kick_array.push(false);
                break;
            case 1:
                // every 0th note of 12
                kick_array.push((index % 12) ? false : 'F');
                break;
            case 2:
                // every 4th note of 12
                kick_array.push(((index - 4) % 12) ? false : 'F');
                break;
            case 3:
                // every 8th note of 12
                kick_array.push(((index - 8) % 12) ? false : 'F');
                break;

            case 5:
                // every 0th and 4th
                if ((index % 12) == 0)
                    kick_array.push('F');
                else if (((index - 4) % 12) == 0)
                    kick_array.push('F');
                else
                    kick_array.push(false);
                break;
            case 6:
                // every 4th && 8th
                if (((index - 4) % 12) == 0)
                    kick_array.push('F');
                else if (((index - 8) % 12) == 0)
                    kick_array.push('F');
                else
                    kick_array.push(false);
                break;
            case 7:
                // every 0th and 8th
                if ((index % 12) == 0)
                    kick_array.push('F');
                else if (((index - 8) % 12) == 0)
                    kick_array.push('F');
                else
                    kick_array.push(false);
                break;

            // these cases should not be called
            case 4: // 4th single
            case 8: // 4th double
            case 9: // 1st up/down
            case 10: // 2nd up/down
            case 12: // 2nd triplet
            case 13: // 3nd triplet
            case 14: // 4nd triplet
            case 15: // 1st Quad
                console.log("bad case in get_kick16th_triplets_permutation_array_for_16ths()");
                break;

            case 11: // first triplet
            /* falls through */
            default:
                // use default
                // every 4th note
                if (index % 4 == 0)
                    kick_array.push("F");
                else
                    kick_array.push(false);
                break;
        }
    }
    return kick_array;
}


function get_permutation_pre_ABC(section) {
    var abc = "";

    switch (section) {
        case 0:
            abc += "P:Ostinato\n%\n%\n%Just the Ositnato\n";
            break;
        case 1:
            abc += "T: \nP: Singles\n%\n%\n% singles on the \"1\"\n%\n";
            break;
        case 2:
            abc += "%\n%\n% singles on the \"e\"\n%\n";
            break;
        case 3:
            abc += "%\n%\n% singles on the \"&\"\n%\n";
            break;
        case 4:
            abc += "%\n%\n% singles on the \"a\"\n%\n";
            break;
        case 5:
            abc += "T: \nP: Doubles\n%\n%\n% doubles on the \"1\"\n%\n";
            break;
        case 6:
            abc += "%\n%\n% doubles on the \"e\"\n%\n";
            break;
        case 7:
            abc += "%\n%\n% doubles on the \"&\"\n%\n";
            break;
        case 8:
            abc += "%\n%\n% doubles on the \"a\"\n%\n";
            break;
        case 9:
            abc += "T: \nP: Down/Up Beats\n%\n%\n% upbeats on the \"1\"\n%\n";
            break;
        case 10:
            abc += "%\n%\n% downbeats on the \"e\"\n%\n";
            break;
        case 11:
            abc += "T: \nP: Triples\n%\n%\n% triples on the \"1\"\n%\n";
            break;
        case 12:
            abc += "%\n%\n% triples on the \"e\"\n%\n";
            break;
        case 13:
            abc += "%\n%\n% triples on the \"&\"\n%\n";
            break;
        case 14:
            abc += "%\n%\n% triples on the \"a\"\n%\n";
            break;
        case 15:
            abc += "T: \nP: Quads\n%\n%\n% quads\n%\n";
            break;
        default:
            abc += "\nT: Error: No index passed\n";
            break;
    }

    return abc;
}

function get_permutation_post_ABC(section, usingTriplets) {
    var abc = "";

    switch (section) {
        case 0:
            abc += "|\n";
            break;
        case 1:
            abc += "\\\n";
            break;
        case 2:
            abc += "\n";
            break;
        case 3:
            if (usingTriplets)
                abc += "|\n";
            else
                abc += "\\\n";
            break;
        case 4:
            abc += "|\n";
            break;
        case 5:
            abc += "\\\n";
            break;
        case 6:
            abc += "\n";
            break;
        case 7:
            if (usingTriplets)
                abc += "|\n";
            else
                abc += "\\\n";
            break;
        case 8:
            abc += "|\n";
            break;
        case 9:
            abc += "\\\n";
            break;
        case 10:
            abc += "|\n";
            break;
        case 11:
            if (usingTriplets)
                abc += "|\n";
            else
                abc += "\\\n";
            break;
        case 12:
            abc += "\n";
            break;
        case 13:
            abc += "\\\n";
            break;
        case 14:
            abc += "|\n";
            break;
        case 15:
            abc += "|\n";
            break;
        default:
            abc += "\nT: Error: No index passed\n";
            break;
    }

    return abc;
}