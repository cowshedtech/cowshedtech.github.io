function MIDISaveAs() {
    var midi_url = createMidiUrlFromClickableUI("general_MIDI");

    // save as
    document.location = midi_url;
}