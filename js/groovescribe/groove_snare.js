// Javascript for the Groove Scribe HTML application


const COLORS = {
    noteOn: {
        hex: '#000000',
        rgb: 'rgb(0, 0, 0)'
    },
    noteOff: '#FFFFFF',
    noteBorder: '#999999',
    noteHidden: 'transparent',
    snareAccent: '#FFFFFF'
};


//
//
//
function is_snare_on(id) {
    return get_snare_state(id, "ABC") !== false;
}

//
//
//
function get_snare_state(id, returnType) {
    // Validate and normalize returnType
    if (returnType !== "ABC" && returnType !== "URL") {
        console.log("bad returnType in get_snare_state()");
        returnType = "ABC";
    }

    // Define mapping of element IDs to their return values
    const noteTypes = [
        {
            id: "snare_flam",
            property: "color",
            values: { ABC: constant_ABC_SN_Flam, URL: "f" }
        },
        {
            id: "snare_drag",
            property: "color",
            values: { ABC: constant_ABC_SN_Drag, URL: "d" }
        },
        {
            id: "snare_ghost",
            property: "color",
            values: { ABC: constant_ABC_SN_Ghost, URL: "g" }
        },
        {
            id: "snare_accent",
            property: "color",
            values: { ABC: constant_ABC_SN_Accent, URL: "O" }
        },
        {
            id: "snare_circle",
            property: "backgroundColor",
            values: { ABC: constant_ABC_SN_Normal, URL: "o" }
        },
        {
            id: "snare_xstick",
            property: "color",
            values: { ABC: constant_ABC_SN_XStick, URL: "x" }
        },
        {
            id: "snare_buzz",
            property: "color",
            values: { ABC: constant_ABC_SN_Buzz, URL: "b" }
        }
    ];

    // Check each note type
    for (const note of noteTypes) {
        const element = document.getElementById(note.id + id);
        if (element.style[note.property] === COLORS.noteOn.rgb) {
            return note.values[returnType];
        }
    }

    // Return default value if no match found
    return returnType === "ABC" ? false : "-";
}

//
//
//
function set_snare_state(id, mode, make_sound) {
    
    // Build out our dom element IDs
    const elements = [
        'circle', 'ghost', 'accent', 'xstick', 'buzz', 'flam', 'drag'
    ].map(type => document.getElementById(`snare_${type}${id}`));

    // Configuration map for different modes
    const modeConfig = {
        off: {
            element: 'circle',
            styles: { backgroundColor: COLORS.noteOff, borderColor: COLORS.noteBorder }
        },
        normal: {
            element: 'circle',
            styles: { backgroundColor: COLORS.noteOn.hex, borderColor: COLORS.noteBorder },
            midiNote: constant_OUR_MIDI_SNARE_NORMAL
        },
        flam: {
            element: 'flam',
            styles: { color: COLORS.noteOn.hex },
            midiNote: constant_OUR_MIDI_SNARE_FLAM
        },
        drag: {
            element: 'drag',
            styles: { color: COLORS.noteOn.hex },
            midiNote: constant_OUR_MIDI_SNARE_DRAG
        },
        ghost: {
            element: 'ghost',
            styles: { color: COLORS.noteOn.hex },
            midiNote: constant_OUR_MIDI_SNARE_GHOST
        },
        accent: {
            element: 'circle',
            styles: { 
                backgroundColor: COLORS.noteOn.hex, 
                borderColor: COLORS.noteBorder,
                accentColor: COLORS.snareAccent 
            },
            midiNote: constant_OUR_MIDI_SNARE_ACCENT
        },
        xstick: {
            element: 'xstick',
            styles: { color: COLORS.noteOn.hex },
            midiNote: constant_OUR_MIDI_SNARE_XSTICK
        },
        buzz: {
            element: 'buzz',
            styles: { color: COLORS.noteOn.hex },
            midiNote: constant_OUR_MIDI_SNARE_BUZZ
        }
    };

    // Reset all elements to hidden
    elements.forEach(el => {
        el.style.backgroundColor = COLORS.noteHidden;
        el.style.borderColor = COLORS.noteHidden;
        el.style.color = COLORS.noteHidden;
    });

    // Handle invalid mode
    if (!modeConfig[mode]) {
        console.warn(`Invalid mode: ${mode}`);
        return;
    }

    // Apply the new styles
    const config = modeConfig[mode];
    const targetElement = document.getElementById(`snare_${config.element}${id}`);
    
    Object.entries(config.styles).forEach(([property, value]) => {
        if (property === 'accentColor') {
            document.getElementById(`snare_accent${id}`).style.color = value;
        } else {
            targetElement.style[property] = value;
        }
    });

    // Play sound if required
    if (make_sound && config.midiNote) {
        play_single_note_for_note_setting(config.midiNote);
    }
}