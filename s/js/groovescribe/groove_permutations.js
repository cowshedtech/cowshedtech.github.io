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