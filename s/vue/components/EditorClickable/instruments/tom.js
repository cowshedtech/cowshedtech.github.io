// Javascript for the Groove Scribe HTML application

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


function showHideToms(force, showElseHide, dontRefreshScreen) {
    var OnElseOff = toggleVisibilityByClass(".toms-container", force, showElseHide);
    toggleVisibilityByClass(".tom-label", force, showElseHide);    
};
