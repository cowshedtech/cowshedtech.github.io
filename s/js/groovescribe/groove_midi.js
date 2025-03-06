// Javascript for the Groove Scribe HTML application
// Groove Scribe is for drummers and helps create sheet music with an easy to use WYSIWYG groove editor.
//
// Functions related to MIDI
//

// local constants
var CONSTANT_Midi_play_time_zero = "0:00";


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


// pass in a tag ID.  (not a class)
// HTML will be put within the tag replacing whatever else was there
 function AddMidiPlayerToPage(grooveUtil, HTML_Id_to_attach_to, division, expandable) {
    var html_element = document.getElementById(HTML_Id_to_attach_to);
    if (html_element)
        html_element.innerHTML = HTMLForMidiPlayer(grooveUtil, expandable);

    var browserInfo = getBrowserInfo();
    var isIE10 = false;
    if (browserInfo.browser == "MSIE" && browserInfo.version < 12)
        isIE10 = true;

    // now attach the onclicks
    html_element = document.getElementById("tempoInput" + grooveUtil.grooveUtilsUniqueIndex);
    if (html_element) {
        if (isIE10)
            html_element.addEventListener("click", grooveUtil.tempoUpdateFromSlider, false);
        else
            html_element.addEventListener("input", grooveUtil.tempoUpdateFromSlider, false);
    }

    html_element = document.getElementById("tempoTextField" + grooveUtil.grooveUtilsUniqueIndex);
    if (html_element) {
        html_element.addEventListener("change", grooveUtil.tempoUpdateFromTextField, false);
    }

    html_element = document.getElementById("swingInput" + grooveUtil.grooveUtilsUniqueIndex);
    if (html_element) {
        if (isIE10)
            html_element.addEventListener("click", grooveUtil.swingUpdateEvent, false);
        else
            html_element.addEventListener("input", grooveUtil.swingUpdateEvent, false);
    }

    html_element = document.getElementById("midiRepeatImage" + grooveUtil.grooveUtilsUniqueIndex);
    if (html_element) {
        html_element.addEventListener("click", grooveUtil.repeatMIDI_playback, false);
    }

    html_element = document.getElementById("midiExpandImage" + grooveUtil.grooveUtilsUniqueIndex);
    if (html_element) {
        html_element.addEventListener("click", expandOrRetractMIDI_playback, false);
    }

    html_element = document.getElementById("midiGSLogo" + grooveUtil.grooveUtilsUniqueIndex);
    if (html_element) {
        html_element.addEventListener("click", grooveUtil.loadFullScreenGrooveScribe, false);
    }

    html_element = document.getElementById("midiMetronomeMenu" + grooveUtil.grooveUtilsUniqueIndex);
    if (html_element) {
        html_element.addEventListener("click", grooveUtil.metronomeMiniMenuClick, false);
    }

    // enable or disable swing
    grooveUtil.swingEnabled(grooveUtil.doesDivisionSupportSwing(division));
};


function HTMLForMidiPlayer(grooveUtil, expandable) {
    var newHTML = '' +
        '<div id="playerControl' + grooveUtil.grooveUtilsUniqueIndex + '" class="playerControl">' +
        '	<div class="playerControlsRow" id="playerControlsRow' + grooveUtil.grooveUtilsUniqueIndex + '">' +
        '		<span title="Play/Pause" class="midiPlayImage" id="midiPlayImage' + grooveUtil.grooveUtilsUniqueIndex + '"></span>' +
        '       <span class="MIDIPlayTime" id="MIDIPlayTime' + grooveUtil.grooveUtilsUniqueIndex + '">' + CONSTANT_Midi_play_time_zero + '</span>';

    if (expandable)
        newHTML += '' +
            '       <span title="Metronome controls" class="midiMetronomeMenu" id="midiMetronomeMenu' + grooveUtil.grooveUtilsUniqueIndex + '">' +
            addInlineMetronomeSVG() +
            '       </span>'


    newHTML += '<span class="tempoAndProgress" id="tempoAndProgress' + grooveUtil.grooveUtilsUniqueIndex + '">' +
        '			<div class="tempoRow">' +
        '				<span class="tempoLabel">BPM</span>' +
        '				<input type="text" for="tempo" class="tempoTextField" pattern="\\d+" id="tempoTextField' + grooveUtil.grooveUtilsUniqueIndex + '" value="80"></input>' +
        '				<input type=range min=30 max=300 value=90 class="tempoInput' + (is_touch_device() ? ' touch' : '') + '" id="tempoInput' + grooveUtil.grooveUtilsUniqueIndex + '" list="tempoSettings">' +
        '			</div>' +
        '			<div class="swingRow">' +
        '				<span class="swingLabel">SWING</span>' +
        '				<span for="swingAmount" class="swingOutput" id="swingOutput' + grooveUtil.grooveUtilsUniqueIndex + '">0% swing</span>' +
        '				<input type=range min=0 max=50 value=0 class="swingInput' + (is_touch_device() ? ' touch' : '') + '" id="swingInput' + grooveUtil.grooveUtilsUniqueIndex + '" list="swingSettings" step=5 >' +
        '			</div>' +
        '       </span>';

    if (expandable)
        newHTML +=
            '       <span title="Expand full screen in GrooveScribe" class="midiGSLogo" id="midiGSLogo' + grooveUtil.grooveUtilsUniqueIndex + '">' +
            addInLineGScribeLogoLoneGSVG() +
            '       </span>' +
            '		<span title="Expand/Retract player" class="midiExpandImage" id="midiExpandImage' + grooveUtil.grooveUtilsUniqueIndex + '"></span>';

    newHTML += '</div>';

    return newHTML;
};


function expandOrRetractMIDI_playback(force, expandElseContract) {

    var playerControlElement = document.getElementById('playerControl' + root.grooveUtilsUniqueIndex);
    var playerControlRowElement = document.getElementById('playerControlsRow' + root.grooveUtilsUniqueIndex);
    var tempoAndProgressElement = document.getElementById('tempoAndProgress' + root.grooveUtilsUniqueIndex);
    var midiMetronomeMenuElement = document.getElementById('midiMetronomeMenu' + root.grooveUtilsUniqueIndex);
    var gsLogoLoadFullGSElement = document.getElementById('midiGSLogo' + root.grooveUtilsUniqueIndex);
    var midiExpandImageElement = document.getElementById('midiExpandImage' + root.grooveUtilsUniqueIndex);
    var midiPlayTime = document.getElementById('MIDIPlayTime' + root.grooveUtilsUniqueIndex);

    if (playerControlElement.className.indexOf("small") > -1 || (force && expandElseContract)) {
        // make large
        playerControlElement.className = playerControlElement.className.replace(" small", "") + " large";
        playerControlRowElement.className = playerControlRowElement.className.replace(" small", "") + " large";
        tempoAndProgressElement.className = tempoAndProgressElement.className.replace(" small", "") + " large";
        midiMetronomeMenuElement.className = midiMetronomeMenuElement.className.replace(" small", "") + " large";
        gsLogoLoadFullGSElement.className = gsLogoLoadFullGSElement.className.replace(" small", "") + " large";
        midiExpandImageElement.className = midiExpandImageElement.className.replace(" small", "") + " large";
        midiPlayTime.className = midiPlayTime.className.replace(" small", "") + " large";
    } else {
        // make small
        playerControlElement.className = playerControlElement.className.replace(" large", "") + " small";
        playerControlRowElement.className = playerControlRowElement.className.replace(" large", "") + " small";
        midiMetronomeMenuElement.className = midiMetronomeMenuElement.className.replace(" large", "") + " small";
        tempoAndProgressElement.className = tempoAndProgressElement.className.replace(" large", "") + " small";
        gsLogoLoadFullGSElement.className = gsLogoLoadFullGSElement.className.replace(" large", "") + " small";
        midiExpandImageElement.className = midiExpandImageElement.className.replace(" large", "") + " small";
        midiPlayTime.className = midiPlayTime.className.replace(" large", "") + " small";
    }

};


// returns a URL that is a MIDI track
function create_MIDIURLFromGrooveData(myGrooveData, MIDI_type, metronomeSolo) {

    var midiFile = new Midi.File();
    var midiTrack = new Midi.Track();
    midiFile.addTrack(midiTrack);

    midiTrack.setTempo(myGrooveData.tempo);
    midiTrack.setInstrument(0, 0x13);

    var swing_percentage = myGrooveData.swingPercent / 100;

    // the midi converter expects all the arrays to be 32 or 48 notes long.
    // Expand them
    var FullNoteHHArray = scaleNoteArrayToFullSize(myGrooveData.hh_array, myGrooveData.numberOfMeasures, myGrooveData.notesPerMeasure, myGrooveData.numBeats, myGrooveData.noteValue);
    var FullNoteSnareArray = scaleNoteArrayToFullSize(myGrooveData.snare_array, myGrooveData.numberOfMeasures, myGrooveData.notesPerMeasure, myGrooveData.numBeats, myGrooveData.noteValue);
    var FullNoteKickArray = scaleNoteArrayToFullSize(myGrooveData.kick_array, myGrooveData.numberOfMeasures, myGrooveData.notesPerMeasure, myGrooveData.numBeats, myGrooveData.noteValue);

    // the midi functions expect just one measure at a time to work correctly
    // call once for each measure
    var measure_notes = FullNoteHHArray.length / myGrooveData.numberOfMeasures;
    for (var measureIndex = 0; measureIndex < myGrooveData.numberOfMeasures; measureIndex++) {

        var FullNoteTomsArray = [];
        for (var i = 0; i < constant_NUMBER_OF_TOMS; i++) {
            var orig_measure_notes = myGrooveData.notesPerMeasure;
            FullNoteTomsArray[i] = scaleNoteArrayToFullSize(myGrooveData.toms_array[i].slice(orig_measure_notes * measureIndex, orig_measure_notes * (measureIndex + 1)),
                1,
                myGrooveData.notesPerMeasure,
                myGrooveData.numBeats,
                myGrooveData.noteValue);
        }

        MIDI_from_HH_Snare_Kick_Arrays(midiTrack,
            FullNoteHHArray.slice(measure_notes * measureIndex, measure_notes * (measureIndex + 1)),
            FullNoteSnareArray.slice(measure_notes * measureIndex, measure_notes * (measureIndex + 1)),
            FullNoteKickArray.slice(measure_notes * measureIndex, measure_notes * (measureIndex + 1)),
            FullNoteTomsArray,
            MIDI_type,
            myGrooveData.metronomeFrequency,
            measure_notes,
            myGrooveData.timeDivision,
            swing_percentage,
            myGrooveData.numBeats,
            myGrooveData.noteValue,
            metronomeSolo);
    }

    var midi_url = "data:audio/midi;base64," + btoa(midiFile.toBytes());

    return midi_url;
};


var root; 
function midiLoaderCallback(grooveUtils) {
    root = grooveUtils;
    MIDI.Player.addListener(ourMIDICallback);
}

function loadMIDIFromURL(grooveUtils, midiURL, tempo) {

    MIDI.Player.timeWarp = 1; // speed the song is played back
    MIDI.Player.BPM = tempo
    MIDI.Player.loadFile(midiURL, midiLoaderCallback(grooveUtils));
};

function pauseMIDI_playback(grooveUtils) {
    if (grooveUtils.isMIDIPaused === false) {
        grooveUtils.isMIDIPaused = true;
        grooveUtils.midiEventCallbacks.pauseEvent(grooveUtils.midiEventCallbacks.classRoot);
        MIDI.Player.pause();
        grooveUtils.midiEventCallbacks.notePlaying(grooveUtils.midiEventCallbacks.classRoot, "clear", -1);
        clearHighlightNoteInABCSVG(grooveUtils.grooveUtilsUniqueIndex);
    }
};


var debug_note_count = 0;
//var class_midi_note_num = 0;  // global, but only used in this function
// This is the function that the 3rd party midi library calls to give us events.
// This is different from the callbacks that we use for the midi code in this library to
// do events.   (Double chaining)
function ourMIDICallback(data) {
    var percentComplete = (data.now / data.end);
    root.midiEventCallbacks.percentProgress(root.midiEventCallbacks.classRoot, percentComplete * 100);

    if (root.lastMidiTimeUpdate && root.lastMidiTimeUpdate < (data.now + 800)) {
        root.updateMidiPlayTime();
        root.lastMidiTimeUpdate = data.now;
    }

    if (data.now < 16) {
        // this is considered the start.   It doesn't come in at zero for some reason
        // The second note should always be at least 16 ms behind the first
        //class_midi_note_num = 0;
        root.lastMidiTimeUpdate = -1;
    }
    if (data.now == data.end) {

        // at the end of a song
        root.midiEventCallbacks.notePlaying(root.midiEventCallbacks.classRoot, "complete", 1);

        if (root.shouldMIDIRepeat) {

            global_total_midi_repeats++;

            // regenerate the MIDI if the data needs refreshing or the OffsetClick is rotating every time
            // advanceMetronomeOptionsOffsetClickStartRotation will return false if not rotating
            if (advanceMetronomeOptionsOffsetClickStartRotation() || root.midiEventCallbacks.doesMidiDataNeedRefresh(root.midiEventCallbacks.classRoot)) {
                MIDI.Player.stop();
                root.midiEventCallbacks.loadMidiDataEvent(root.midiEventCallbacks.classRoot, false);
                MIDI.Player.start();
                //  } else {
                // let midi.loop handle the repeat for us
                //MIDI.Player.stop();
                //MIDI.Player.start();
            }
            if (root.repeatCallback) {
                root.repeatCallback();
            }
        } else {
            // not repeating, so stopping
            MIDI.Player.stop();
            root.midiEventCallbacks.percentProgress(root.midiEventCallbacks.classRoot, 100);
            root.midiEventCallbacks.stopEvent(root.midiEventCallbacks.classRoot);
        }
    }

    // note on
    var note_type = false;
    if (data.message == 144) {
        if (data.note == constant_OUR_MIDI_METRONOME_1 || data.note == constant_OUR_MIDI_METRONOME_NORMAL) {
            note_type = "metronome";
        } else if (data.note == constant_OUR_MIDI_HIHAT_NORMAL || data.note == constant_OUR_MIDI_HIHAT_OPEN ||
            data.note == constant_OUR_MIDI_HIHAT_ACCENT || data.note == constant_OUR_MIDI_HIHAT_CRASH ||
            data.note == constant_OUR_MIDI_HIHAT_RIDE || data.note == constant_OUR_MIDI_HIHAT_STACKER ||
            data.note == constant_OUR_MIDI_HIHAT_RIDE_BELL || data.note == constant_OUR_MIDI_HIHAT_COW_BELL ||
            data.note == constant_OUR_MIDI_HIHAT_METRONOME_NORMAL || data.note == constant_OUR_MIDI_HIHAT_METRONOME_NORMAL) {
            note_type = "hi-hat";
        } else if (data.note == constant_OUR_MIDI_SNARE_NORMAL || data.note == constant_OUR_MIDI_SNARE_ACCENT ||
            data.note == constant_OUR_MIDI_SNARE_GHOST || data.note == constant_OUR_MIDI_SNARE_XSTICK ||
            data.note == constant_OUR_MIDI_SNARE_FLAM || data.note == constant_OUR_MIDI_SNARE_DRAG ||
            data.note == constant_OUR_MIDI_SNARE_BUZZ) {
            note_type = "snare";
        } else if (data.note == constant_OUR_MIDI_KICK_NORMAL || data.note == constant_OUR_MIDI_HIHAT_FOOT) {
            note_type = "kick";
        } else if (data.note == constant_OUR_MIDI_TOM1_NORMAL || data.note == constant_OUR_MIDI_TOM2_NORMAL || data.note == constant_OUR_MIDI_TOM3_NORMAL || data.note == constant_OUR_MIDI_TOM4_NORMAL) {
            note_type = "tom";
        }
        if (note_type) {
            global_total_midi_notes++;
            root.midiEventCallbacks.notePlaying(root.midiEventCallbacks.classRoot, note_type, percentComplete);
            if (root.highlightOn) highlightNoteInABCSVGFromPercentComplete(root.rootsUniqueIndex, root.note_mapping_array, percentComplete, root.numberOfMeasures, root.repeatedMeasures);
            if (root.noteCallback) {
                root.noteCallback(note_type);
            }
        }
    }

    // this used to work when we used note 60 as a spacer between chords
    //if(data.note == 60)
    //	class_midi_note_num++;
    /*
    if (0 && data.message == 144) {
    debug_note_count++;
    // my debugging code for midi
    var newHTML = "";
    if (data.note != 60)
    newHTML += "<b>";

    newHTML += note_type + " total notes: " + debug_note_count + " - count#: " + class_midi_note_num +
    " now: " + data.now +
    " note: " + data.note +
    " message: " + data.message +
    " channel: " + data.channel +
    " velocity: " + data.velocity +
    "<br>";

    if (data.note != 60)
    newHTML += "</b>";

    document.getElementById("midiTextOutput").innerHTML += newHTML;
    }
        */
}




 function midiEventCallbackClass(classRoot) {
    this.classRoot = classRoot;
    this.noteHasChangedSinceLastDataLoad = false;

    this.playEvent = function (root) {
        var icon = document.getElementById("midiPlayImage" + root.grooveUtilsUniqueIndex);
        if (icon)
            icon.className = "midiPlayImage Playing";
        if (this.classRoot.playEventCallback) {
            this.classRoot.playEventCallback();
        }
    };
    // default loadMIDIDataEvent.  You probably want to override this
    // it will only make changes to the tempo and swing
    // playStarting: boolean that is true on the first time through the midi playback
    this.loadMidiDataEvent = function (classRoot, playStarting) {
        if (classRoot.myGrooveData) {
            classRoot.myGrooveData.tempo = classRoot.getTempo();
            classRoot.myGrooveData.swingPercent = classRoot.getSwing();
            var midiURL = create_MIDIURLFromGrooveData(classRoot.myGrooveData, classRoot.metrononeSolo);
            loadMIDIFromURL(classRoot, midiURL, classRoot.getTempo());
            classRoot.midiEventCallbacks.noteHasChangedSinceLastDataLoad = false;
        } else {
            console.log("can't load midi song.   myGrooveData is empty");
        }
    };
    this.doesMidiDataNeedRefresh = function (classRoot) {
        return classRoot.midiEventCallbacks.noteHasChangedSinceLastDataLoad;
    };
    this.pauseEvent = function (classRoot) {
        var icon = document.getElementById("midiPlayImage" + classRoot.grooveUtilsUniqueIndex);
        if (icon)
            icon.className = "midiPlayImage Paused";
    };

    this.resumeEvent = function (classRoot) { };
    this.stopEvent = function (classRoot) {
        var icon = document.getElementById("midiPlayImage" + classRoot.grooveUtilsUniqueIndex);
        if (icon)
            icon.className = "midiPlayImage Stopped";
    };
    this.repeatChangeEvent = function (classRoot, newValue) {
        if (newValue)
            document.getElementById("midiRepeatImage" + classRoot.grooveUtilsUniqueIndex).src = getMidiImageLocation() + "repeat.png";
        else
            document.getElementById("midiRepeatImage" + classRoot.grooveUtilsUniqueIndex).src = getMidiImageLocation() + "grey_repeat.png";
    };
    this.percentProgress = function (classRoot, percent) { };
    this.notePlaying = function (classRoot, note_type, note_position) { };

    this.midiInitialized = function (classRoot) {
        var icon = document.getElementById("midiPlayImage" + classRoot.grooveUtilsUniqueIndex);
        if (icon)
            icon.className = "midiPlayImage Stopped";
        document.getElementById("midiPlayImage" + classRoot.grooveUtilsUniqueIndex).onclick = function (event) {
            classRoot.startOrStopMIDI_playback();
        }; // enable play button
        setupHotKeys(classRoot); // spacebar to play
    };
};
