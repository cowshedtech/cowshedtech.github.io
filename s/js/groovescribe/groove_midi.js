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


/*
	 * midi_output_type:  "general_MIDI" or "Custom"
	 * num_notes: number of notes in the arrays  (currently expecting 32 notes per measure)
	 * metronome_frequency: 0, 4, 8, 16   None, quarter notes, 8th notes, 16ths
	 * num_notes_for_swing: how many notes are we using.   Since we need to know where the upstrokes are we need to know
	 *                      what the proper division is.   It can change when we are doing permutations, otherwise it is what is the
	 *                      class_notes_per_measure
	 *
	 * The arrays passed in contain the ABC notation for a given note value or false for a rest.
	 */
 function MIDI_from_HH_Snare_Kick_Arrays(midiTrack, HH_Array, Snare_Array, Kick_Array, Toms_Array, midi_output_type, metronome_frequency, num_notes, num_notes_for_swing, swing_percentage, timeSigTop, timeSigBottom, metronomeSolo) {
    var prev_metronome_note = false;
    var prev_hh_note = 46;  // default to open hi-hat so that the first hi-hat note also mutes any previous hh open.
    var prev_snare_note = false;
    var prev_kick_note = false;
    var prev_kick_splash_note = false;
    var midi_channel = 9;  // percussion

    if (swing_percentage < 0 || swing_percentage > 0.99) {
        console.log("Swing percentage out of range in GrooveUtils.MIDI_from_HH_Snare_Kick_Arrays");
        swing_percentage = 0;
    }

    // start of midi track
    // Some sort of bug in the midi player makes it skip the first note without a blank
    // TODO: Find and fix midi bug
    if (midiTrack.events.length < 4) {
        midiTrack.addNoteOff(midi_channel, 60, 1); // add a blank note for spacing
    }

    var isTriplets = isTripletDivisionFromNotesPerMeasure(num_notes, timeSigTop, timeSigBottom);
    var offsetClickStartBeat = getMetronomeOptionsOffsetClickStartRotation(isTriplets);
    var delay_for_next_note = 0;

    for (var i = 0; i < num_notes; i++) {

        var duration = 0;

        if (isTriplets) {
            duration = 10.666; // "ticks"   16 for 32nd notes.  10.66 for 48th triplets
        } else {
            duration = 16;
        }

        if (swing_percentage !== 0) {
            // swing effects the note placement of the e and the a.  (1e&a)
            // swing increases the distance between the 1 and the e ad shortens the distance between the e and the &
            // likewise the distance between the & and the a is increased and the a and the 1 is shortened
            //  So it sounds like this:   1-e&-a2-e&-a3-e&-a4-e&-a
            var scaler = num_notes / num_notes_for_swing;
            var val = i % (4 * scaler);

            if (val < scaler) {
                // this is the 1, increase the distance between this note and the e
                duration += (duration * swing_percentage);
            } else if (val < scaler * 2) {
                // this is the e, shorten the distance between this note and the &
                duration -= (duration * swing_percentage);
            } else if (val < scaler * 3) {
                // this is the &, increase the distance between this note and the a
                duration += (duration * swing_percentage);
            } else if (val < scaler * 4) {
                // this is the a, shorten the distance between this note and the 2
                duration -= (duration * swing_percentage);
            }
        }

        // Metronome sounds.
        var metronome_note = false;
        var metronome_velocity = constant_OUR_MIDI_VELOCITY_ACCENT;
        if (metronome_frequency > 0) {
            var quarterNoteFrequency = (isTriplets ? 12 : 8);
            var eighthNoteFrequency = (isTriplets ? 6 : 4);
            var sixteenthNoteFrequency = (isTriplets ? 2 : 2);

            var metronome_specific_index = i;
            switch (offsetClickStartBeat) {
                case "1":
                    // default do nothing
                    break;
                case "E":
                    if (isTriplets)
                        console.log("OffsetClickStart error in MIDI_from_HH_Snare_Kick_Arrays");
                    // shift by one sixteenth note
                    metronome_specific_index -= sixteenthNoteFrequency;
                    break;
                case "AND":
                    if (isTriplets)
                        console.log("OffsetClickStart error in MIDI_from_HH_Snare_Kick_Arrays");
                    // shift by two sixteenth notes
                    metronome_specific_index -= (2 * sixteenthNoteFrequency);
                    break;
                case "A":
                    if (isTriplets)
                        console.log("OffsetClickStart error in MIDI_from_HH_Snare_Kick_Arrays");
                    // shift by three sixteenth notes
                    metronome_specific_index -= (3 * sixteenthNoteFrequency);
                    break;
                case "TI":
                    if (!isTriplets)
                        console.log("OffsetClickStart error in MIDI_from_HH_Snare_Kick_Arrays");
                    // shift by one sixteenth note
                    metronome_specific_index -= sixteenthNoteFrequency * 2;
                    break;
                case "TA":
                    if (!isTriplets)
                        console.log("OffsetClickStart error in MIDI_from_HH_Snare_Kick_Arrays");
                    // shift by two sixteenth notes
                    metronome_specific_index -= (2 * (sixteenthNoteFrequency * 2));
                    break;
                default:
                    console.log("bad case in MIDI_from_HH_Snare_Kick_Arrays");
                    break;
            }

            if (metronome_specific_index >= 0) { // can go negative due to MetronomeOffsetClickStart shift above
                // Special sound on the one
                if (metronome_specific_index === 0 || (metronome_specific_index % (quarterNoteFrequency * timeSigTop * (4 / timeSigBottom))) === 0) {
                    metronome_note = constant_OUR_MIDI_METRONOME_1; // 1 count

                } else if ((metronome_specific_index % quarterNoteFrequency) === 0) {
                    metronome_note = constant_OUR_MIDI_METRONOME_NORMAL; // standard metronome click
                }

                if (!metronome_note && metronome_frequency == 8) { // 8th notes requested
                    if ((metronome_specific_index % eighthNoteFrequency) === 0) {
                        // click every 8th note
                        metronome_note = constant_OUR_MIDI_METRONOME_NORMAL; // standard metronome click
                    }

                } else if (!metronome_note && metronome_frequency == 16) { // 16th notes requested
                    if ((metronome_specific_index % sixteenthNoteFrequency) === 0) {
                        // click every 16th note
                        metronome_note = constant_OUR_MIDI_METRONOME_NORMAL; // standard metronome click
                        metronome_velocity = 25; // not as loud as the normal click
                    }
                }
            }

            if (metronome_note !== false) {
                //if(prev_metronome_note != false)
                //	midiTrack.addNoteOff(midi_channel, prev_metronome_note, 0);
                midiTrack.addNoteOn(midi_channel, metronome_note, delay_for_next_note, metronome_velocity);
                delay_for_next_note = 0; // zero the delay
                //prev_metronome_note = metronome_note;
            }
        }

        if (!metronomeSolo) { // midiSolo means to play just the metronome
            var hh_velocity = constant_OUR_MIDI_VELOCITY_NORMAL;
            var hh_note = false;
            switch (HH_Array[i]) {
                case constant_ABC_HH_Normal: // normal
                case constant_ABC_HH_Close: // normal
                    hh_note = constant_OUR_MIDI_HIHAT_NORMAL;
                    break;
                case constant_ABC_HH_Accent: // accent
                    if (midi_output_type == "general_MIDI") {
                        hh_note = constant_OUR_MIDI_HIHAT_NORMAL;
                        hh_velocity = constant_OUR_MIDI_VELOCITY_ACCENT;
                    } else {
                        hh_note = constant_OUR_MIDI_HIHAT_ACCENT;
                    }
                    break;
                case constant_ABC_HH_Open: // open
                    hh_note = constant_OUR_MIDI_HIHAT_OPEN;
                    break;
                case constant_ABC_HH_Ride: // ride
                    hh_note = constant_OUR_MIDI_HIHAT_RIDE;
                    break;
                case constant_ABC_HH_Ride_Bell: // ride bell
                    hh_note = constant_OUR_MIDI_HIHAT_RIDE_BELL;
                    break;
                case constant_ABC_HH_Cow_Bell: // cow bell
                    hh_note = constant_OUR_MIDI_HIHAT_COW_BELL;
                    break;
                case constant_ABC_HH_Crash: // crash
                    hh_note = constant_OUR_MIDI_HIHAT_CRASH;
                    break;
                case constant_ABC_HH_Stacker: // stacker
                    hh_note = constant_OUR_MIDI_HIHAT_STACKER;
                    break;
                case constant_ABC_HH_Metronome_Normal: // Metronome beep
                    hh_note = constant_OUR_MIDI_HIHAT_METRONOME_NORMAL;
                    break;
                case constant_ABC_HH_Metronome_Accent: // Metronome beep
                    hh_note = constant_OUR_MIDI_HIHAT_METRONOME_ACCENT;
                    break;
                case false:
                    break;
                default:
                    console.log("Bad case in GrooveUtils.MIDI_from_HH_Snare_Kick_Arrays");
                    break;
            }

            if (hh_note !== false) {
                // need to end hi-hat open notes else the hh open sounds horrible
                if (prev_hh_note !== false) {
                    midiTrack.addNoteOff(midi_channel, prev_hh_note, delay_for_next_note);
                    prev_hh_note = false;
                    delay_for_next_note = 0; // zero the delay
                }
                midiTrack.addNoteOn(midi_channel, hh_note, delay_for_next_note, hh_velocity);
                delay_for_next_note = 0; // zero the delay

                // this if means that only the open hi-hat will get stopped on the next note
                if (HH_Array[i] == constant_ABC_HH_Open)
                    prev_hh_note = hh_note;
            }

            var snare_velocity = constant_OUR_MIDI_VELOCITY_NORMAL;
            var snare_note = false;
            switch (Snare_Array[i]) {
                case constant_ABC_SN_Normal: // normal
                    snare_note = constant_OUR_MIDI_SNARE_NORMAL;
                    break;
                case constant_ABC_SN_Flam: // flam
                    if (midi_output_type == "general_MIDI") {
                        snare_note = constant_OUR_MIDI_SNARE_NORMAL;
                        snare_velocity = constant_OUR_MIDI_VELOCITY_ACCENT;
                    } else {
                        snare_note = constant_OUR_MIDI_SNARE_FLAM;
                        snare_velocity = constant_OUR_MIDI_VELOCITY_NORMAL;
                    }
                    break;
                case constant_ABC_SN_Drag: // drag
                    if (midi_output_type == "general_MIDI") {
                        snare_note = constant_OUR_MIDI_SNARE_NORMAL;
                        snare_velocity = constant_OUR_MIDI_VELOCITY_ACCENT;
                    } else {
                        snare_note = constant_OUR_MIDI_SNARE_DRAG;
                        snare_velocity = constant_OUR_MIDI_VELOCITY_NORMAL;
                    }
                    break;
                case constant_ABC_SN_Accent: // accent
                    if (midi_output_type == "general_MIDI") {
                        snare_note = constant_OUR_MIDI_SNARE_NORMAL;
                        snare_velocity = constant_OUR_MIDI_VELOCITY_ACCENT;
                    } else {
                        snare_note = constant_OUR_MIDI_SNARE_ACCENT; // custom note
                    }
                    break;
                case constant_ABC_SN_Ghost: // ghost
                    if (midi_output_type == "general_MIDI") {
                        snare_note = constant_OUR_MIDI_SNARE_NORMAL;
                        snare_velocity = constant_OUR_MIDI_VELOCITY_GHOST;
                    } else {
                        snare_note = constant_OUR_MIDI_SNARE_GHOST;
                        snare_velocity = constant_OUR_MIDI_VELOCITY_GHOST;
                    }
                    break;
                case constant_ABC_SN_XStick: // xstick
                    snare_note = constant_OUR_MIDI_SNARE_XSTICK;
                    break;
                case constant_ABC_SN_Buzz: // xstick
                    snare_note = constant_OUR_MIDI_SNARE_BUZZ;
                    break;
                case false:
                    break;
                default:
                    console.log("Bad case in GrooveUtils.MIDI_from_HH_Snare_Kick_Arrays");
                    break;
            }

            if (snare_note !== false) {
                //if(prev_snare_note != false)
                //	midiTrack.addNoteOff(midi_channel, prev_snare_note, 0);
                midiTrack.addNoteOn(midi_channel, snare_note, delay_for_next_note, snare_velocity);
                delay_for_next_note = 0; // zero the delay
                //prev_snare_note = snare_note;
            }

            var kick_note = false;
            var kick_splash_note = false;
            switch (Kick_Array[i]) {
                case constant_ABC_KI_Splash: // just HH Foot
                    kick_splash_note = constant_OUR_MIDI_HIHAT_FOOT;
                    break;
                case constant_ABC_KI_SandK: // Kick & HH Foot
                    kick_splash_note = constant_OUR_MIDI_HIHAT_FOOT;
                    kick_note = constant_OUR_MIDI_KICK_NORMAL;
                    break;
                case constant_ABC_KI_Normal: // just Kick
                    kick_note = constant_OUR_MIDI_KICK_NORMAL;
                    break;
                case false:
                    break;
                default:
                    console.log("Bad case in GrooveUtils.MIDI_from_HH_Snare_Kick_Arrays");
                    break;
            }
            if (kick_note !== false) {
                //if(prev_kick_note != false)
                //	midiTrack.addNoteOff(midi_channel, prev_kick_note, 0);
                midiTrack.addNoteOn(midi_channel, kick_note, delay_for_next_note, constant_OUR_MIDI_VELOCITY_NORMAL);
                delay_for_next_note = 0; // zero the delay
                //prev_kick_note = kick_note;
            }
            if (kick_splash_note !== false) {
                if (prev_hh_note !== false) {
                    midiTrack.addNoteOff(midi_channel, prev_hh_note, delay_for_next_note);
                    prev_hh_note = false;
                    delay_for_next_note = 0; // zero the delay
                }
                //if(prev_kick_splash_note != false)
                //	midiTrack.addNoteOff(midi_channel, prev_kick_splash_note, 0);
                midiTrack.addNoteOn(midi_channel, kick_splash_note, delay_for_next_note, constant_OUR_MIDI_VELOCITY_NORMAL);
                delay_for_next_note = 0; // zero the delay
                //prev_kick_splash_note = kick_splash_note;
            }

            if (Toms_Array) {
                for (var which_array = 0; which_array < constant_NUMBER_OF_TOMS; which_array++) {
                    var tom_note = false;
                    if (Toms_Array[which_array][i] !== undefined) {
                        switch (Toms_Array[which_array][i]) {
                            case constant_ABC_T1_Normal: // Tom 1
                                tom_note = constant_OUR_MIDI_TOM1_NORMAL;  // midi code High tom 2
                                break;
                            case constant_ABC_T2_Normal: // Midi code Mid tom 1
                                tom_note = constant_OUR_MIDI_TOM2_NORMAL;
                                break;
                            case constant_ABC_T3_Normal: // Midi code Mid tom 2
                                tom_note = constant_OUR_MIDI_TOM3_NORMAL;
                                break;
                            case constant_ABC_T4_Normal: // Midi code Low Tom 1
                                tom_note = constant_OUR_MIDI_TOM4_NORMAL;
                                break;
                            case false:
                                break;
                            default:
                                console.log("Bad case in GrooveUtils.MIDI_from_HH_Snare_Kick_Arrays");
                                break;
                        }
                    }
                    if (tom_note !== false) {
                        midiTrack.addNoteOn(midi_channel, tom_note, delay_for_next_note, constant_OUR_MIDI_VELOCITY_NORMAL);
                        delay_for_next_note = 0; // zero the delay
                    }
                }
            }

        } // end metronomeSolo

        delay_for_next_note += duration;
    }

    if (delay_for_next_note)
        midiTrack.addNoteOff(0, 60, delay_for_next_note - 1); // add a blank note for spacing

}; // end of function