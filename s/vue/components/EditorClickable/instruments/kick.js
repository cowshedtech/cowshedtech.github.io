// Javascript for the Groove Scribe HTML application

// local constants
var constant_default_tempo = 80;
var constant_note_stem_off_color = "transparent";
var constant_note_on_color_hex = "#000000"; // black
var constant_note_on_color_rgb = 'rgb(0, 0, 0)'; // black
var constant_note_off_color_hex = "#FFF";
var constant_note_off_color_rgb = 'rgb(255, 255, 255)'; // white
var constant_note_border_color_hex = "#999";
var constant_hihat_note_off_color_hex = "#CCC";
var constant_hihat_note_off_color_rgb = 'rgb(204, 204, 204)'; // grey
var constant_note_hidden_color_rgb = "transparent";
var constant_sticking_right_on_color_rgb = "rgb(36, 132, 192)";
var constant_sticking_left_on_color_rgb = "rgb(57, 57, 57)";
var constant_sticking_both_on_color_rgb = "rgb(57, 57, 57)";
var constant_sticking_count_on_color_rgb = "rgb(57, 57, 57)";
var constant_sticking_right_off_color_rgb = "rgb(204, 204, 204)";
var constant_sticking_left_off_color_rgb = "rgb(204, 204, 204)";
var constant_snare_accent_on_color_hex = "#FFF";
var constant_snare_accent_on_color_rgb = "rgb(255, 255, 255)";






// build a string that looks like this
// |o---------------o---------------|
// function GetDefaultKickGroove(notes_per_measure, timeSigTop, timeSigBottom, numMeasures) {
//     var retString = "";
//     var oneMeasureString = "|";
//     var i;
//     var notes_per_grouping = (notes_per_measure / timeSigTop);

//     for(i = 0; i < notes_per_measure; i++) {
//         // if the note falls on the beginning of a group
//         // and the group is even
//         if(i % notes_per_grouping === 0 && (i / notes_per_grouping) % 2 === 0)
//             oneMeasureString += "o";
//         else
//             oneMeasureString += "-";
//     }
//     for (i = 0; i < numMeasures; i++)
//             retString += oneMeasureString;
//         retString += "|";

//     return retString;
// };


// merge 2 kick arrays
//  4 possible states
//  false   (off)
//  constant_ABC_KI_Normal
//  constant_ABC_KI_SandK
//  constant_ABC_KI_Splash
function merge_kick_arrays(primary_kick_array, secondary_kick_array) {
    var new_kick_array = [];

    for (var i in primary_kick_array) {

        switch (primary_kick_array[i]) {
            case false:
                new_kick_array.push(secondary_kick_array[i]);
                break;

            case constant_ABC_KI_SandK:
                new_kick_array.push(constant_ABC_KI_SandK);
                break;

            case constant_ABC_KI_Normal:
                if (secondary_kick_array[i] == constant_ABC_KI_SandK ||
                    secondary_kick_array[i] == constant_ABC_KI_Splash)
                    new_kick_array.push(constant_ABC_KI_SandK);
                else
                    new_kick_array.push(constant_ABC_KI_Normal);
                break;

            case constant_ABC_KI_Splash:
                if (secondary_kick_array[i] == constant_ABC_KI_Normal ||
                    secondary_kick_array[i] == constant_ABC_KI_SandK)
                    new_kick_array.push(constant_ABC_KI_SandK);
                else
                    new_kick_array.push(constant_ABC_KI_Splash);
                break;

            default:
                console.log("bad case in merge_kick_arrays()");
                new_kick_array.push(primary_kick_array[i]);
                break;
        }
    }

    return new_kick_array;
}