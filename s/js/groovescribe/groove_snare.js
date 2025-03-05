// Javascript for the Groove Scribe HTML application


const COLORS = {
    noteOn: {
        hex: '#000000',
        rgb: 'rgb(0, 0, 0)'
    },
    noteOff: '#FFFFFF',
    noteBorder: '#999999',
    noteHidden: 'transparent',
    snareAccent: '#FFFFFF',
    snareAccentRGB: 'rgb(255, 255, 255)'
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
            propertValue: COLORS.noteOn.rgb,
            values: { ABC: constant_ABC_SN_Flam, URL: "f" }
        },
        {
            id: "snare_drag",
            property: "color",
            propertValue: COLORS.noteOn.rgb,
            values: { ABC: constant_ABC_SN_Drag, URL: "d" }
        },
        {
            id: "snare_ghost",
            property: "color",
            propertValue: COLORS.noteOn.rgb,
            values: { ABC: constant_ABC_SN_Ghost, URL: "g" }
        },
        {
            id: "snare_accent",
            property: "color",
            propertValue: COLORS.snareAccentRGB,
            values: { ABC: constant_ABC_SN_Accent, URL: "O" }
        },
        {
            id: "snare_circle",
            property: "backgroundColor",
            propertValue: COLORS.noteOn.rgb,
            values: { ABC: constant_ABC_SN_Normal, URL: "o" }
        },
        {
            id: "snare_xstick",
            property: "color",
            propertValue: COLORS.noteOn.rgb,
            values: { ABC: constant_ABC_SN_XStick, URL: "x" }
        },
        {
            id: "snare_buzz",
            property: "color",
            propertValue: COLORS.noteOn.rgb,
            values: { ABC: constant_ABC_SN_Buzz, URL: "b" }
        }
    ];

    // Check each note type
    for (const note of noteTypes) {
        const element = document.getElementById(note.id + id);
        if (element.style[note.property] === note.propertValue) {
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

// build a string that looks like this
// |--------O---------------O-------|
function GetDefaultSnareGroove(notes_per_measure, timeSigTop, timeSigBottom, numMeasures) {
    var retString = "";
    var oneMeasureString = "|";
    var i;
    var notes_per_grouping = (notes_per_measure / timeSigTop);

    for(i = 0; i < notes_per_measure; i++) {
        // if the note falls on the beginning of a group
        // and the group is odd
        if(i % notes_per_grouping === 0 && (i / notes_per_grouping) % 2 !== 0)
            oneMeasureString += "O";
        else
            oneMeasureString += "-";
    }
    for (i = 0; i < numMeasures; i++)
            retString += oneMeasureString;
        retString += "|";

    return retString;

};


//
	//
	//
	function generateSnareContainerHTML(indexStartForNotes, baseindex, class_notes_per_measure, class_num_beats_per_measure, class_note_value_per_measure, indexStartForNotes ) {
		let newHTML = ('\
			<div class="snare-container">\
				<div class="opening_note_space"> </div> ');
		for (let i = indexStartForNotes; i < class_notes_per_measure + indexStartForNotes; i++) {
			const snareId = `snare${i}`;
			const snareGhostId = `snare_ghost${i}`;
			const snareCircleId = `snare_circle${i}`;
			const snareXstickId = `snare_xstick${i}`;
			const snareBuzzId = `snare_buzz${i}`;
			const snareFlamId = `snare_flam${i}`;
			const snareDragId = `snare_drag${i}`;
			const snareAccentId = `snare_accent${i}`;

			newHTML += `
				<div id="${snareId}" class="snare" onClick="myGrooveWriter.noteLeftClick(event, 'snare', ${i})" oncontextmenu="event.preventDefault(); myGrooveWriter.noteRightClick(event, 'snare', ${i})" onmouseenter="myGrooveWriter.noteOnMouseEnter(event, 'snare', ${i})">
					<div class="snare_ghost note_part" id="${snareGhostId}">(<i class="fa fa-circle dot_in_snare_ghost_note"></i>)</div>
					<div class="snare_circle note_part" id="${snareCircleId}"></div>
					<div class="snare_xstick note_part" id="${snareXstickId}"><i class="fa fa-times"></i></div>
					<div class="snare_buzz note_part" id="${snareBuzzId}"><i class="fa fa-bars"></i></div>
					<div class="snare_flam note_part" id="${snareFlamId}">${generateFlamSVG()}</div>
					<div class="snare_drag note_part" id="${snareDragId}">${generateDragSVG()}</div>
					<div class="snare_accent note_part" id="${snareAccentId}">
						<i class="fa fa-chevron-right"></i>
					</div>
				</div>
			`;

			if ((i - (indexStartForNotes - 1)) % noteGroupingSize(class_notes_per_measure, class_num_beats_per_measure, class_note_value_per_measure) === 0 && i < class_notes_per_measure + indexStartForNotes - 1) {
				newHTML += '<div class="space_between_note_groups"> </div>';
			}
		}

		function generateFlamSVG() {
			return `
				<i class="fa ">
					<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" width="30" height="30">
						<style type="text/css">
							.flam_fill {fill: currentColor}
							.flam_stroke {stroke: currentColor; fill: none; stroke-width: .7}
						</style>
						<defs>
							<path id="flam_ghd" class="flam_fill" d="m1.7-1c-1-1.7-4.5 0.2-3.4 2 1 1.7 4.5-0.2 3.4-2"></path>
							<ellipse id="flam_hd" rx="4.1" ry="2.9" transform="rotate(-20)" class="flam_fill"></ellipse>
						</defs>
						<g id="note" transform="translate(-44 -35)">
							<path class="flam_stroke" d="m52.1 53.34v-14M52.1 39.34c0.6 3.4 5.6 3.8 3 10 1.2-4.4-1.4-7-3-7"></path>
							<use x="50.50" y="53.34" xlink:href="#flam_ghd"></use>
							<path class="flam_stroke" d="m49.5 49.34l9-5"></path>
							<path class="flam_stroke" d="m50.5 58.34c2.9 3 11.6 3 14.5 0M69.5 53.34v-21"></path>
							<use x="66.00" y="53.34" xlink:href="#flam_hd"></use>
						</g>
					</svg>
				</i>
			`;
		}

		function generateDragSVG() {
			return `
				<i class="fa ">
					<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" width="30" height="30">
						<style type="text/css">
							.drag_fill {fill: currentColor}
							.drag_stroke {stroke: currentColor; fill: none; stroke-width: .7}
						</style>
						<defs>
							<path id="drag_ghd" class="drag_fill" d="m1.7-1c-1-1.7-4.5 0.2-3.4 2 1 1.7 4.5-0.2 3.4-2"></path>
							<ellipse id="drag_hd" rx="4.1" ry="2.9" transform="rotate(-20)" class="drag_fill"></ellipse>
						</defs>
						<g id="note" transform="translate(-44 -35)">
							<path class="fill" d="m51.81 38.34 l8.58 0.00v1.60l-8.58 0.00"></path>
							<path class="fill" d="m52.10 41.34 l8.00 0.00v1.60l-8.00 0.00"></path>
							<path class="drag_stroke" d="m52.1 53.34v-15.00"></path>
							<use x="50.50" y="53.34" xlink:href="#drag_ghd"></use>
							<path class="drag_stroke" d="m49.50 49.34l8.00 -15.00"></path>
							<path class="drag_stroke" d="m60.10 53.34v-15.00"></path>
							<use x="58.50" y="53.34" xlink:href="#drag_hd"></use>
							<path class="drag_stroke" d="m50.5 58.34c2.9 3 11.6 3 14.5 0M69.5 53.34v-21"></path>
							<use x="66.00" y="53.34" xlink:href="#drag_hd"></use>
						</g>
					</svg>
				</i>
			`;
		}

		newHTML += '<span class="unmuteSnareButton" id="unmutesnareButton' + baseindex + '" onClick=\'myGrooveWriter.muteInstrument("snare", ' + baseindex + ', false)\'><span class="fa-stack unmuteStack"><i class="fa fa-ban fa-stack-2x" style="color:red"></i><i class="fa fa-volume-down fa-stack-1x"></i></span>';
		newHTML += ('<div class="end_note_space"></div>\n</div>\n');

		return newHTML; // Return the generated HTML
	}	