// Javascript for the Groove Scribe HTML application

var metronomeSolo = false;
var metronomeOffsetClickStart = "1";
// start with last in the rotation so the next rotation brings it to '1'
var metronomeOffsetClickStartRotation = 0;


function addInlineMetronomeSVG() {
    return '<svg class="midiMetronomeImage" version="1.1" width="30" height="30"' +
        'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" ' +
        'xml:space="preserve"><path d="M86.945,10.635c-0.863-0.494-1.964-0.19-2.455,0.673l-8.31,14.591l-2.891-1.745l-1.769,9.447l0.205,0.123' +
        'l-1.303,2.286L63.111,6.819c-0.25-1-1.299-1.819-2.33-1.819H37.608c-1.031,0-2.082,0.818-2.334,1.818L13.454,93.182' +
        'c-0.253,1,0.385,1.818,1.416,1.818h68.459c1.031,0,1.67-0.818,1.42-1.818L71.69,41.061l3.117-5.475l0.152,0.092l7.559-5.951' +
        'l-3.257-1.966l8.355-14.67C88.11,12.226,87.81,11.127,86.945,10.635z M71.58,70.625H54.855l12.946-22.737l5.197,20.789' +
        'C73.25,69.678,72.61,70.625,71.58,70.625z M50.714,70.625H26.57c-1.031,0-1.669-0.994-1.416-1.994L39.59,11.5' +
        'c0.253-1,1.303-1.812,2.334-1.812h14.431c1.032,0,2.081,0.725,2.331,1.725l7.854,31.421L50.714,70.625z"></path></svg>'
}


function getMetronomeSolo() {
    return metronomeSolo;
};

function setMetronomeSolo(trueElseFalse) {
    metronomeSolo = trueElseFalse;
};


function getMetronomeOffsetClickStart() {
    return metronomeOffsetClickStart;
};

function getMetronomeOffsetClickStartIsRotating() {
    return metronomeOffsetClickStart == 'ROTATE';
};

function setMetronomeOffsetClickStart(value) {
    metronomeOffsetClickStart = value;
};

// if the Metronome offset click start is set to rotate this
// will advance the position of the rotation and return TRUE
// returns FALSE if rotation is OFF
function advanceMetronomeOptionsOffsetClickStartRotation(isTriplets) {
    if (getMetronomeOffsetClickStartIsRotating()) {
        metronomeOffsetClickStartRotation++;
        return true;
    } else {
        return false;
    }
};


function getMetronomeOptionsOffsetClickStartRotation(isTriplets) {
    if (getMetronomeOffsetClickStartIsRotating()) {
        // constrain the rotation
        if (isTriplets && metronomeOffsetClickStartRotation > 2)
            metronomeOffsetClickStartRotation = 0;
        else if (metronomeOffsetClickStartRotation > 3)
            metronomeOffsetClickStartRotation = 0;

        switch (metronomeOffsetClickStartRotation) {
            case 0:
                return '1';
            case 1:
                if (isTriplets)
                    return 'TI';
                else
                    return 'E';
            case 2:
                if (isTriplets)
                    return 'TA';
                else
                    return 'AND';
            case 3:
                return 'A';
        }
    } else {
        return metronomeOffsetClickStart
    }
};

function resetMetronomeOptionsOffsetClickStartRotation(value) {
    // start with last in the rotation so the next rotation brings it to '1'
    return metronomeOffsetClickStartRotation = 0;
};

