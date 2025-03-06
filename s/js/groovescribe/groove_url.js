// get a really long URL that encodes all of the notes and the rest of the state of the page.
// this will allow us to bookmark or reference a groove and handle undo/redo.
//

 function getUrlStringFromGrooveData(myGrooveData, url_destination) {

    var fullURL = window.location.protocol + "//" + window.location.host + window.location.pathname;

    if (!url_destination) {
        // then assume it is the groove writer display.  Do nothing
    } else if (url_destination == "display") {
        // asking for the "groove_display" page
        if (fullURL.includes('index.html'))
            fullURL = fullURL.replace('index.html', 'GrooveEmbed.html');
        else if (fullURL.includes('/gscribe'))
            fullURL = fullURL.replace('/gscribe', '/groove/GrooveEmbed.html');
        else
            fullURL += 'GrooveEmbed.html';
    } else if (url_destination == "fullGrooveScribe") {
        // asking for the full GrooveScribe link
        fullURL = 'https://www.mikeslessons.com/gscribe';
    }

    fullURL += '?';

    if (myGrooveData.debugMode)
        fullURL += "Debug=1&";

    if (myGrooveData.viewMode)
        fullURL += "Mode=view&";

    if (myGrooveData.grooveDBAuthoring)
        fullURL += "GDB_Author=1&";

    fullURL += 'TimeSig=' + myGrooveData.numBeats + '/' + myGrooveData.noteValue;

    // # of notes
    fullURL += "&Div=" + myGrooveData.timeDivision;

    if (myGrooveData.title !== "")
        fullURL += "&Title=" + encodeURIComponent(myGrooveData.title);

    if (myGrooveData.author !== "")
        fullURL += "&Author=" + encodeURIComponent(myGrooveData.author);

    if (myGrooveData.comments !== "")
        fullURL += "&Comments=" + encodeURIComponent(myGrooveData.comments);

    fullURL += "&Tempo=" + myGrooveData.tempo;

    if (myGrooveData.swingPercent > 0)
        fullURL += "&Swing=" + myGrooveData.swingPercent;

    if (!myGrooveData.highlightOn)
        fullURL += "&Highlight=OFF";

    // # of measures
    fullURL += "&Measures=" + myGrooveData.numberOfMeasures;

    // if (myGrooveData.repeatedMeasures.size > 0) {
    // 	let content = "";
    // 	for (let measure of myGrooveData.repeatedMeasures.keys()) {
    // 		if (content.length > 0) content += ","
    // 		content += measure + 'x' + myGrooveData.repeatedMeasures.get(measure)
    // 	}
    // 	fullURL += "&rMeasures=" + content;
    // }
    if (myGrooveData.repeatedMeasures.size > 0) {
        const content = Array.from(myGrooveData.repeatedMeasures.entries())
            .map(([key, value]) => `${key}x${value}`)
            .join(",");
        fullURL += "&rMeasures=" + content;
    }

    // # metronome setting
    if (myGrooveData.metronomeFrequency !== 0) {
        fullURL += "&MetronomeFreq=" + myGrooveData.metronomeFrequency;
    }

    // notes
    var total_notes = myGrooveData.notesPerMeasure * myGrooveData.numberOfMeasures;
    var HH = "&H=|" + tabLineFromAbcNoteArray('H', myGrooveData.hh_array, true, true, total_notes, myGrooveData.notesPerMeasure);
    var Snare = "&S=|" + tabLineFromAbcNoteArray('S', myGrooveData.snare_array, true, true, total_notes, myGrooveData.notesPerMeasure);
    var Kick = "&K=|" + tabLineFromAbcNoteArray('K', myGrooveData.kick_array, true, true, total_notes, myGrooveData.notesPerMeasure);

    fullURL += HH + Snare + Kick;

    // only add if we need them.  // they are long and ugly. :)
    if (myGrooveData.showToms) {
        var Tom1 = "&T1=|" + tabLineFromAbcNoteArray('T1', myGrooveData.toms_array[0], true, true, total_notes, myGrooveData.notesPerMeasure);
        var Tom4 = "&T4=|" + tabLineFromAbcNoteArray('T4', myGrooveData.toms_array[3], true, true, total_notes, myGrooveData.notesPerMeasure);
        fullURL += Tom1 + Tom4;
    }

    // only add if we need them.  // they are long and ugly. :)
    if (myGrooveData.showStickings) {
        var Stickings = "&Stickings=|" + tabLineFromAbcNoteArray('stickings', myGrooveData.sticking_array, true, true, total_notes, myGrooveData.notesPerMeasure);
        fullURL += Stickings;
    }

    return fullURL;
}

function getGrooveDataFromUrlString(encodedURLData, myGrooveData, debugMode) {
    var Stickings_string;
    var HH_string;
    var Snare_string;
    var Kick_string;
    var stickings_set_from_URL = false;
    var i;

    myGrooveData.debugMode = parseInt(getQueryVariableFromString("Debug", debugMode, encodedURLData), 10);

    var timeSigArray = parseTimeSigString(getQueryVariableFromString("TimeSig", "4/4", encodedURLData));
    myGrooveData.numBeats = timeSigArray[0];
    myGrooveData.noteValue = timeSigArray[1];

    myGrooveData.timeDivision = parseInt(getQueryVariableFromString("Div", 16, encodedURLData), 10);
    myGrooveData.notesPerMeasure = calc_notes_per_measure(myGrooveData.timeDivision, myGrooveData.numBeats, myGrooveData.noteValue);

    myGrooveData.metronomeFrequency = parseInt(getQueryVariableFromString("MetronomeFreq", "0", encodedURLData), 10);

    myGrooveData.numberOfMeasures = parseInt(getQueryVariableFromString("measures", 1, encodedURLData), 10);
    if (myGrooveData.numberOfMeasures < 1 || isNaN(myGrooveData.numberOfMeasures))
        myGrooveData.numberOfMeasures = 1;
    else if (myGrooveData.numberOfMeasures > constant_MAX_MEASURES)
        myGrooveData.numberOfMeasures = constant_MAX_MEASURES;

    let repeatedMeasures = getQueryVariableFromString("rMeasures", 1, encodedURLData);
    if (repeatedMeasures && repeatedMeasures.length > 0) {
        repeatedMeasures.split(",").forEach(element => {
        let [key, value] = element.split('x');
            myGrooveData.repeatedMeasures.set(Number(key), Number(value));
        });
    }

    let highlight = getQueryVariableFromString("Highlight", "ON", encodedURLData);
    if (highlight && highlight.length > 0) {
        if (highlight.toUpperCase() == "OFF") {
            myGrooveData.highlightOn = false
        } else {
            myGrooveData.highlightOn = true
        }			
    }
    
    Stickings_string = getQueryVariableFromString("Stickings", false, encodedURLData);
    if (!Stickings_string) {
        Stickings_string = GetDefaultStickingsGroove(myGrooveData.notesPerMeasure, myGrooveData.numBeats, myGrooveData.noteValue, myGrooveData.numberOfMeasures);
        myGrooveData.showStickings = false;
    } else {
        myGrooveData.showStickings = true;
    }

    HH_string = getQueryVariableFromString("H", false, encodedURLData);
    if (!HH_string) {
        getQueryVariableFromString("HH", false, encodedURLData);
        if (!HH_string) {
            HH_string = GetDefaultHHGroove(myGrooveData.notesPerMeasure, myGrooveData.numBeats, myGrooveData.noteValue, myGrooveData.numberOfMeasures);
        }
    }

    Snare_string = getQueryVariableFromString("S", false, encodedURLData);
    if (!Snare_string) {
        Snare_string = GetDefaultSnareGroove(myGrooveData.notesPerMeasure, myGrooveData.numBeats, myGrooveData.noteValue, myGrooveData.numberOfMeasures);
    }

    Kick_string = getQueryVariableFromString("K", false, encodedURLData);
    if (!Kick_string) {
        getQueryVariableFromString("B", false, encodedURLData);
        if (!Kick_string) {
            Kick_string = GetDefaultKickGroove(myGrooveData.notesPerMeasure, myGrooveData.numBeats, myGrooveData.noteValue, myGrooveData.numberOfMeasures);
        }
    }

    // Get the Toms
    for (i = 0; i < 4; i++) {
        // toms are named T1, T2, T3, T4
        var Tom_string = getQueryVariableFromString("T" + (i + 1), false, encodedURLData);
        if (!Tom_string) {
            Tom_string = GetDefaultTomGroove(myGrooveData.notesPerMeasure, myGrooveData.numBeats, myGrooveData.noteValue, myGrooveData.numberOfMeasures);
        } else {
            myGrooveData.showToms = true;
        }

        /// the toms array index starts at zero (0) the first one is T1
        myGrooveData.toms_array[i] = noteArraysFromURLData("T" + (i + 1), Tom_string, myGrooveData.notesPerMeasure, myGrooveData.numberOfMeasures);
    }

    myGrooveData.sticking_array = noteArraysFromURLData("Stickings", Stickings_string, myGrooveData.notesPerMeasure, myGrooveData.numberOfMeasures);
    myGrooveData.hh_array = noteArraysFromURLData("H", HH_string, myGrooveData.notesPerMeasure, myGrooveData.numberOfMeasures);
    myGrooveData.snare_array = noteArraysFromURLData("S", Snare_string, myGrooveData.notesPerMeasure, myGrooveData.numberOfMeasures);
    myGrooveData.kick_array = noteArraysFromURLData("K", Kick_string, myGrooveData.notesPerMeasure, myGrooveData.numberOfMeasures);

    myGrooveData.title = getQueryVariableFromString("title", "", encodedURLData);
    myGrooveData.title = decodeURIComponent(myGrooveData.title);
    myGrooveData.title = myGrooveData.title.replace(/\+/g, " ");

    myGrooveData.author = getQueryVariableFromString("author", "", encodedURLData);
    myGrooveData.author = decodeURIComponent(myGrooveData.author);
    myGrooveData.author = myGrooveData.author.replace(/\+/g, " ");

    myGrooveData.comments = getQueryVariableFromString("comments", "", encodedURLData);
    myGrooveData.comments = decodeURIComponent(myGrooveData.comments);
    myGrooveData.comments = myGrooveData.comments.replace(/\+/g, " ");

    myGrooveData.tempo = parseInt(getQueryVariableFromString("tempo", constant_DEFAULT_TEMPO, encodedURLData), 10);
    if (isNaN(myGrooveData.tempo) || myGrooveData.tempo < 20 || myGrooveData.tempo > 400)
        myGrooveData.tempo = constant_DEFAULT_TEMPO;

    myGrooveData.swingPercent = parseInt(getQueryVariableFromString("swing", 0, encodedURLData), 10);
    if (isNaN(myGrooveData.swingPercent) || myGrooveData.swingPercent < 0 || myGrooveData.swingPercent > 100)
        myGrooveData.swingPercent = 0;

    return myGrooveData;
};