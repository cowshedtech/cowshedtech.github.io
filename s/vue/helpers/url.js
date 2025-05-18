// Javascript for the Groove Scribe HTML application
// Groove Scribe is for drummers and helps create sheet music with an easy to use WYSIWYG groove editor.
//
// Functions for mapping between the browser URL and groove data
//


/**
 * Generates a URL string encoding all groove data and settings
 * @param {Object} track - The track object containing groove data
 * @param {Object} options - Display and behavior options
 * @param {Object} midiPlayer - MIDI player instance
 * @param {Object} metronome - Metronome settings
 * @param {string} url_destination - Target page type ('display' or 'fullGrooveScribe')
 * @returns {string} URL containing encoded groove data
 */
function getUrlStringFromGrooveData(track, options, midiPlayer, metronome, url_destination) {

    var fullURL = window.location.protocol + "//" + window.location.host + window.location.pathname;

    switch (url_destination) {
        case 'display':
            // Transform current URL to embed version
            fullURL = fullURL
                .replace(/index\.html$/, 'GrooveEmbed.html')
                .replace(/\/gscribe$/, '/groove/GrooveEmbed.html');
            if (!fullURL.endsWith('GrooveEmbed.html')) {
                fullURL += 'GrooveEmbed.html';
            }
            break;

        case 'fullGrooveScribe':
            fullURL = 'https://www.mikeslessons.com/gscribe';
            break;

        default: // groove writer display
            break;
    }

    fullURL += '?';

    if (options && options.debugMode) fullURL += "Debug=1&";
    if (options && options.viewMode) fullURL += "Mode=view&";
    if (options && options.grooveDBAuthoring) fullURL += "GDB_Author=1&";
    if (options && !options.isHighlightOn()) fullURL += "&Highlight=OFF";

    fullURL += 'TimeSig=' + track.numBeats + '/' + track.noteValue;
    fullURL += "&Div=" + track.timeDivision;

    if (track.title !== "") fullURL += "&Title=" + encodeURIComponent(track.title);
    if (track.author !== "") fullURL += "&Author=" + encodeURIComponent(track.author);
    if (track.comments !== "") fullURL += "&Comments=" + encodeURIComponent(track.comments);

    if (midiPlayer && midiPlayer.getTempo()) fullURL += "&Tempo=" + midiPlayer.getTempo();
    if (midiPlayer && midiPlayer.getSwing() > 0) fullURL += "&Swing=" + midiPlayer.getSwing();
    if (metronome && metronome.getFrequency() !== 0) fullURL += "&MetronomeFreq=" + metronome.getFrequency();

    fullURL += "&Measures=" + track.numberOfMeasures;

    if (track.repeatedMeasures.size > 0) {
        const content = Array.from(track.repeatedMeasures.entries())
            .map(([key, value]) => `${key}x${value}`)
            .join(",");
        fullURL += "&rMeasures=" + content;
    }

    // notes
    var total_notes = track.notesPerMeasure * track.numberOfMeasures;
    var HH = "&H=|" + tabLineFromAbcNoteArray('H', track.hh_array, true, true, total_notes, track.notesPerMeasure);
    var Snare = "&S=|" + tabLineFromAbcNoteArray('S', track.snare_array, true, true, total_notes, track.notesPerMeasure);
    var Kick = "&K=|" + tabLineFromAbcNoteArray('K', track.kick_array, true, true, total_notes, track.notesPerMeasure);

    fullURL += HH + Snare + Kick;

    // only add if we need them.  // they are long and ugly. :)
    if (options.areTomsVisible()) {
        var Tom1 = "&T1=|" + tabLineFromAbcNoteArray('T1', track.toms_array[0], true, true, total_notes, track.notesPerMeasure);
        var Tom4 = "&T4=|" + tabLineFromAbcNoteArray('T4', track.toms_array[3], true, true, total_notes, track.notesPerMeasure);
        fullURL += Tom1 + Tom4;
    }

    // only add if we need them.  // they are long and ugly. :)
    if (options.isStickingVisible()) {
        //var Stickings = "&Stickings=|" + tabLineFromAbcNoteArray('stickings', track.sticking_array, true, true, total_notes, track.notesPerMeasure);

        let notes = track.getInstrumentNotes(Instruments.STICKING)
        var Stickings = "&Stickings=|" + tabLineFromAbcNoteArray('stickings', notes, true, true, total_notes, track.notesPerMeasure);
        
        fullURL += Stickings;
    }

    return fullURL;
}


/**
 * Decodes groove data and settings from a URL string and updates the provided objects
 * 
 * @param {string} encodedURLData - URL string containing encoded groove parameters
 * @param {Object} track - Track object to update with groove data
 * @param {Object} options - Display and behavior options to update
 * @param {Object} midiPlayer - MIDI player instance to update
 * @param {Object} metronome - Metronome settings to update
 * @param {boolean} debugMode - Whether to enable debug mode
 * @returns {Object} Updated track object with decoded groove data
 */
function getGrooveDataFromUrlString(encodedURLData, track, options, midiPlayer, metronome, debugMode) {

    let debug = parseInt(getQueryVariableFromURL("Debug", "0"), 10);
	if (debug !== 0) options.debugMode = true;
    
    options.viewMode = ("view" === getQueryVariableFromURL("Mode", "edit"));

    var stickingsString = getQueryVariableFromString("Stickings", false, encodedURLData);
    if (!stickingsString) {
        stickingsString = track.getEmptyGroove();
        options.setStickingVisible(false);
    } else {
        options.setStickingVisible(true);
    }

    let highlight = getQueryVariableFromString("Highlight", "ON", encodedURLData);
    if (highlight && highlight.length > 0) {
        if (highlight.toUpperCase() == "OFF") {
            options.setHighlightOn(false)
        } else {
            options.setHighlightOn(true)
        }
    }

    var timeSigArray = parseTimeSigString(getQueryVariableFromString("TimeSig", "4/4", encodedURLData));
    track.numBeats = timeSigArray[0];
    track.noteValue = timeSigArray[1];

    track.timeDivision = parseInt(getQueryVariableFromString("Div", 16, encodedURLData), 10);
    track.notesPerMeasure = calc_notes_per_measure(track.timeDivision, track.numBeats, track.noteValue);

    if (metronome) metronome.setFrequency(parseInt(getQueryVariableFromString("MetronomeFreq", "0", encodedURLData), 10));

    track.numberOfMeasures = parseInt(getQueryVariableFromString("Measures", 1, encodedURLData), 10);
    if (track.numberOfMeasures < 1 || isNaN(track.numberOfMeasures))
        track.numberOfMeasures = 1;
    else if (track.numberOfMeasures > constant_MAX_MEASURES)
        track.numberOfMeasures = constant_MAX_MEASURES;

    let repeatedMeasures = getQueryVariableFromString("rMeasures", 1, encodedURLData);
    if (repeatedMeasures && repeatedMeasures.length > 0) {
        repeatedMeasures.split(",").forEach(element => {
            let [key, value] = element.split('x');
            track.repeatedMeasures.set(Number(key), Number(value));
        });
    }

    var highhatString = getQueryVariableFromString("H", false, encodedURLData);
    if (!highhatString) {
        getQueryVariableFromString("HH", false, encodedURLData);
        if (!highhatString) {
            highhatString = track.getDefaultHHGroove();
        }
    }

    var snareString = getQueryVariableFromString("S", false, encodedURLData);
    if (!snareString) {
        snareString = track.getDefaultSnareGroove(track.notesPerMeasure, track.numBeats, track.noteValue, track.numberOfMeasures);
    }

    var kickString = getQueryVariableFromString("K", false, encodedURLData);
    if (!kickString) {
        getQueryVariableFromString("B", false, encodedURLData);
        if (!kickString) {
            kickString = track.getDefaultKickGroove();
        }
    }

    // Get the Toms
    options.setTomsVisible(false);
    for (i = 0; i < 4; i++) {
        // toms are named T1, T2, T3, T4
        var Tom_string = getQueryVariableFromString("T" + (i + 1), false, encodedURLData);
        if (!Tom_string) {
            Tom_string = track.getEmptyGroove();            
        } else {
            options.setTomsVisible(true);
        }

        /// the toms array index starts at zero (0) the first one is T1
        track.toms_array[i] = noteArraysFromURLData("T" + (i + 1), Tom_string, track.notesPerMeasure, track.numberOfMeasures);
    }

    track.sticking_array = noteArraysFromURLData("Stickings", stickingsString, track.notesPerMeasure, track.numberOfMeasures);
    track.hh_array = noteArraysFromURLData("H", highhatString, track.notesPerMeasure, track.numberOfMeasures);
    track.snare_array = noteArraysFromURLData("S", snareString, track.notesPerMeasure, track.numberOfMeasures);
    track.kick_array = noteArraysFromURLData("K", kickString, track.notesPerMeasure, track.numberOfMeasures);

    let title = getQueryVariableFromString("Title", "", encodedURLData);
    title = decodeURIComponent(title);
    title = title.replace(/\+/g, " ");
    track.setTitle(title);

    let author = getQueryVariableFromString("Author", "", encodedURLData);
    author = decodeURIComponent(author);
    author = author.replace(/\+/g, " ");
    track.setAuthor(author);

    let comments = getQueryVariableFromString("Comments", "", encodedURLData);
    comments = decodeURIComponent(comments);
    comments = comments.replace(/\+/g, " ");
    track.setComments(comments);

    midiPlayer.setTempo(parseInt(getQueryVariableFromString("Tempo", constant_DEFAULT_TEMPO, encodedURLData), 10));
    tempo = midiPlayer.getTempo();
    if (isNaN(tempo) || tempo < 20 || tempo > 400)
        midiPlayer.setTempo(constant_DEFAULT_TEMPO);

    midiPlayer.setSwing(parseInt(getQueryVariableFromString("Swing", 0, encodedURLData), 10));
    swing = midiPlayer.getSwing();
    if (isNaN(swing) || swing < 0 || swing > 100)
        midiPlayer.setSwing(0);

    return track;
};


/**
 * Updates the browser's URL and page title to reflect the current groove state.
 * This enables proper page reloads, history navigation, link sharing, and bookmarking.
 * 
 * Side effects:
 * - Updates the GrooveScribe external link href
 * - Adds the current URL to the undo stack
 * - Updates the page title with tune and author information
 * - Updates browser history state
 * - In debug mode, displays the URL search parameters at the bottom of the page
 * 
 * @requires editor - Global editor instance with get_FullURLForPage and constant_APP_TITLE
 * @requires options - Global options object with debugMode setting
 * @requires linkGrooveScribe - Optional global link element for external GrooveScribe URL
 */
function updateCurrentURL() {
    var newURL = editor.get_FullURLForPage();
    
    addFullURLToUndoStack(newURL);

    var newTitle = false;
    var title = editor.track.getTitle();
    if (title !== "") newTitle = title;

    var author = editor.track.getAuthor();
    if (author !== "") {
        if (title)
            newTitle += " by " + author;
        else
            newTitle = "Groove by " + author;
    }

    if (!newTitle) newTitle = constant_APP_TITLE;

    document.title = newTitle;
    try {
        window.history.replaceState(null, newTitle, newURL);
    } catch (err) {
        /* empty */
    }

    if (options.debugMode) {
        // put the search data on the bottom of the page to make it easy to cut & paste
        var searchDataEle = document.getElementById("URLSearchData");
        if (searchDataEle) {
            var searchIndex = newURL.indexOf("?");
            var searchURL = newURL.substring(searchIndex).replace("Debug=1&", "");
            searchDataEle.innerHTML = '<p style="margin-left: 10px;"><b>' + searchURL + '</b><p>';
        }
    }
};