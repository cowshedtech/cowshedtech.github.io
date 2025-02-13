// Javascript for the Groove Scribe HTML application

function isInstrumentMuted(instrument, measure) {
    // find unmuteHHButton1  or unmuteSnareButton2
    var buttonName = "unmute" + instrument + "Button" + measure
    var button = document.getElementById(buttonName);
    if (button && button.style.display == "inline-block")
        return true;
    else
        return false;
}