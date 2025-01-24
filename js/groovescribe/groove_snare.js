// Javascript for the Groove Scribe HTML application
// Groove Scribe is for drummers and helps create sheet music with an easy to use WYSIWYG groove editor.
//
// Author: Lou Montulli
// Original Creation date: Feb 2015.
//
//  Copyright 2015-2020 Lou Montulli, Mike Johnston
//
//  This file is part of Project Groove Scribe.
//
//  Groove Scribe is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 2 of the License, or
//  (at your option) any later version.
//
//  Groove Scribe is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with Groove Scribe.  If not, see <http://www.gnu.org/licenses/>.

/*jshint multistr: true */
/*jslint browser:true devel:true */

/*global GrooveUtils, Midi, Share */
/*global MIDI, constant_MAX_MEASURES, constant_DEFAULT_TEMPO, constant_ABC_STICK_R, constant_ABC_STICK_L, constant_ABC_STICK_BOTH, constant_ABC_STICK_OFF, constant_ABC_STICK_COUNT, constant_ABC_HH_Ride, constant_ABC_HH_Ride_Bell, constant_ABC_HH_Cow_Bell, constant_ABC_HH_Crash, constant_ABC_HH_Stacker, constant_ABC_HH_Open, constant_ABC_HH_Close, constant_ABC_HH_Accent, constant_ABC_HH_Normal, constant_ABC_SN_Ghost, constant_ABC_SN_Accent, constant_ABC_SN_Normal, constant_ABC_SN_XStick, constant_ABC_SN_Buzz, constant_ABC_SN_Flam, constant_ABC_SN_Drag, constant_ABC_KI_SandK, constant_ABC_KI_Splash, constant_ABC_KI_Normal, constant_ABC_T1_Normal, constant_ABC_T2_Normal, constant_ABC_T3_Normal, constant_ABC_T4_Normal, constant_NUMBER_OF_TOMS, constant_ABC_OFF, constant_OUR_MIDI_VELOCITY_NORMAL, constant_OUR_MIDI_VELOCITY_ACCENT, constant_OUR_MIDI_VELOCITY_GHOST, constant_OUR_MIDI_METRONOME_1, constant_OUR_MIDI_METRONOME_NORMAL, constant_OUR_MIDI_HIHAT_NORMAL, constant_OUR_MIDI_HIHAT_OPEN, constant_OUR_MIDI_HIHAT_ACCENT, constant_OUR_MIDI_HIHAT_CRASH, constant_OUR_MIDI_HIHAT_STACKER, constant_OUR_MIDI_HIHAT_RIDE, constant_OUR_MIDI_HIHAT_FOOT, constant_OUR_MIDI_SNARE_NORMAL, constant_OUR_MIDI_SNARE_ACCENT, constant_OUR_MIDI_SNARE_GHOST, constant_OUR_MIDI_SNARE_XSTICK, constant_OUR_MIDI_SNARE_XSTICK, constant_OUR_MIDI_SNARE_FLAM, onstant_OUR_MIDI_SNARE_DRAG, constant_OUR_MIDI_KICK_NORMAL, constant_OUR_MIDI_TOM1_NORMAL, constant_OUR_MIDI_TOM2_NORMAL, constant_OUR_MIDI_TOM4_NORMAL, constant_OUR_MIDI_TOM4_NORMAL */

// GrooveWriter class.   The only one in this file.

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

function is_snare_on(id) {
    return get_snare_state(id, "ABC") !== false;
}

function play_single_note_for_note_setting(note_val) {
    const midiSystem = MIDI.WebAudio || MIDI.AudioTag;
    if (midiSystem) {
        midiSystem.noteOn(9, note_val, constant_OUR_MIDI_VELOCITY_NORMAL, 0);
    }
}


// returns the ABC notation for the snare state
	// false = off
	//
	//  c == Snare Normal</li>
	//  !accent!c == Snare Accent</li>
	//  _c == Ghost Note    shows an x with a circle around it.   Needs improvement
	//  ^c == xstick   shows an x
function get_snare_state(id, returnType) {

    if (returnType != "ABC" && returnType != "URL") {
        console.log("bad returnType in get_snare_state()");
        returnType = "ABC";
    }

    if (document.getElementById("snare_flam" + id).style.color == constant_note_on_color_rgb) {
        if (returnType == "ABC")
            return constant_ABC_SN_Flam; // snare flam
        else if (returnType == "URL")
            return "f"; // snare flam
    }
    if (document.getElementById("snare_drag" + id).style.color == constant_note_on_color_rgb) {
        if (returnType == "ABC")
            return constant_ABC_SN_Drag; // snare drag
        else if (returnType == "URL")
            return "d"; // snare drag
    }
    if (document.getElementById("snare_ghost" + id).style.color == constant_note_on_color_rgb) {
        if (returnType == "ABC")
            return constant_ABC_SN_Ghost; // ghost note
        else if (returnType == "URL")
            return "g"; // ghost note
    }
    if (document.getElementById("snare_accent" + id).style.color == constant_snare_accent_on_color_rgb) {
        if (returnType == "ABC")
            return constant_ABC_SN_Accent; // snare accent
        else if (returnType == "URL")
            return "O"; // snare accent
    }
    if (document.getElementById("snare_circle" + id).style.backgroundColor == constant_note_on_color_rgb) {
        if (returnType == "ABC")
            return constant_ABC_SN_Normal; // snare normal
        else if (returnType == "URL")
            return "o"; // snare normal
    }
    if (document.getElementById("snare_xstick" + id).style.color == constant_note_on_color_rgb) {
        if (returnType == "ABC")
            return constant_ABC_SN_XStick; // snare Xstick
        else if (returnType == "URL")
            return "x"; // snare xstick
    }
    if (document.getElementById("snare_buzz" + id).style.color == constant_note_on_color_rgb) {
        if (returnType == "ABC")
            return constant_ABC_SN_Buzz; // snare Buzz
        else if (returnType == "URL")
            return "b"; // snare Buzz
    }

    if (returnType == "ABC")
        return false; // off (rest)
    else if (returnType == "URL")
        return "-"; // off (rest)
}

function set_snare_state(id, mode, make_sound) {

    // hide everything optional
    document.getElementById("snare_circle" + id).style.backgroundColor = constant_note_hidden_color_rgb;
    document.getElementById("snare_circle" + id).style.borderColor = constant_note_hidden_color_rgb;
    document.getElementById("snare_ghost" + id).style.color = constant_note_hidden_color_rgb;
    document.getElementById("snare_accent" + id).style.color = constant_note_hidden_color_rgb;
    document.getElementById("snare_xstick" + id).style.color = constant_note_hidden_color_rgb;
    document.getElementById("snare_buzz" + id).style.color = constant_note_hidden_color_rgb;
    document.getElementById("snare_flam" + id).style.color = constant_note_hidden_color_rgb;
    document.getElementById("snare_drag" + id).style.color = constant_note_hidden_color_rgb;

    // turn stuff on conditionally
    switch (mode) {
        case "off":
            document.getElementById("snare_circle" + id).style.backgroundColor = constant_note_off_color_hex;
            document.getElementById("snare_circle" + id).style.borderColor = constant_note_border_color_hex;
            break;
        case "normal":
            document.getElementById("snare_circle" + id).style.backgroundColor = constant_note_on_color_hex;
            document.getElementById("snare_circle" + id).style.borderColor = constant_note_border_color_hex;
            if (make_sound)
                play_single_note_for_note_setting(constant_OUR_MIDI_SNARE_NORMAL);
            break;
        case "flam":
            document.getElementById("snare_flam" + id).style.color = constant_note_on_color_hex;
            if (make_sound)
                play_single_note_for_note_setting(constant_OUR_MIDI_SNARE_FLAM);
            break;
        case "drag":
            document.getElementById("snare_drag" + id).style.color = constant_note_on_color_hex;
            if (make_sound)
                play_single_note_for_note_setting(constant_OUR_MIDI_SNARE_DRAG);
            break;
        case "ghost":
            document.getElementById("snare_ghost" + id).style.color = constant_note_on_color_hex;
            if (make_sound)
                play_single_note_for_note_setting(constant_OUR_MIDI_SNARE_GHOST);
            break;
        case "accent":
            document.getElementById("snare_circle" + id).style.backgroundColor = constant_note_on_color_hex;
            document.getElementById("snare_circle" + id).style.borderColor = constant_note_border_color_hex;
            document.getElementById("snare_accent" + id).style.color = constant_snare_accent_on_color_hex;
            if (make_sound)
                play_single_note_for_note_setting(constant_OUR_MIDI_SNARE_ACCENT);
            break;
        case "xstick":
            document.getElementById("snare_xstick" + id).style.color = constant_note_on_color_hex;
            if (make_sound)
                play_single_note_for_note_setting(constant_OUR_MIDI_SNARE_XSTICK);
            break;
        case "buzz":
            document.getElementById("snare_buzz" + id).style.color = constant_note_on_color_hex;
            if (make_sound)
                play_single_note_for_note_setting(constant_OUR_MIDI_SNARE_BUZZ);
            break;
        default:
            console.log("bad switch in set_snare_state");
            break;
    }
}