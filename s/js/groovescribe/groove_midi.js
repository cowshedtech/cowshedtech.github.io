// Javascript for the Groove Scribe HTML application
// Groove Scribe is for drummers and helps create sheet music with an easy to use WYSIWYG groove editor.
//
// Functions related to MIDI
//

var global_grooveUtilsScriptSrc = "";
if (document.currentScript)
	global_grooveUtilsScriptSrc = document.currentScript.src;


function play_single_note_for_note_setting(note_val) {
    if (MIDI.WebAudio) {
        MIDI.WebAudio.noteOn(9, note_val, constant_OUR_MIDI_VELOCITY_NORMAL, 0);
    } else if (MIDI.AudioTag) {
        MIDI.AudioTag.noteOn(9, note_val, constant_OUR_MIDI_VELOCITY_NORMAL, 0);
    }
}

function MIDI_build_midi_url_count_in_track(timeSigTop, timeSigBottom, tempo) {

    var midiFile = new Midi.File();
    var midiTrack = new Midi.Track();
    midiFile.addTrack(midiTrack);

    midiTrack.setTempo(tempo);
    midiTrack.setInstrument(0, 0x13);

    // start of midi track
    // Some sort of bug in the midi player makes it skip the first note without a blank
    // TODO: Find and fix midi bug
    midiTrack.addNoteOff(9, 60, 1); // add a blank note for spacing

    var noteDelay = 128;  // quarter notes over x/4 time
    if (timeSigBottom == 8)
        noteDelay = 64;  // 8th notes over x/8 time
    else if (timeSigBottom == 16)
        noteDelay = 32;  // 16th notes over x/16 time

    // add count in
    midiTrack.addNoteOn(9, constant_OUR_MIDI_METRONOME_1, 0, constant_OUR_MIDI_VELOCITY_NORMAL);
    midiTrack.addNoteOff(9, constant_OUR_MIDI_METRONOME_1, noteDelay);
    for (var i = 1; i < timeSigTop; i++) {
        midiTrack.addNoteOn(9, constant_OUR_MIDI_METRONOME_NORMAL, 0, constant_OUR_MIDI_VELOCITY_NORMAL);
        midiTrack.addNoteOff(9, constant_OUR_MIDI_METRONOME_NORMAL, noteDelay);
    }

    var midi_url = "data:audio/midi;base64," + btoa(midiFile.toBytes());

    return midi_url;
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

 function getMidiSoundFontLocation() {
    return getGrooveUtilsBaseLocation() + "../soundfont/";
};

function getMidiImageLocation() {
    return getGrooveUtilsBaseLocation() + "../images/";
};