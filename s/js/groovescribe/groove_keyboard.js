function setupHotKeys() {

    var isCtrl = false;
    document.onkeyup = function (e) {
        if (e.which == 17)
            isCtrl = false;
    };

    document.onkeydown = function (e) {
        if (e.which == 17)
            isCtrl = true;
        /*
        if(e.which == 83 && isCtrl == true) {
        alert('CTRL-S pressed');
        return false;
        }
         */
        // only accept the event if it not going to an INPUT field
        // otherwise we can't use spacebar in text fields :(
        if (e.which == 32 && (e.target.type == "range" || (e.target.tagName.toUpperCase() != "INPUT" && e.target.tagName.toUpperCase() != "TEXTAREA"))) {

            // spacebar
            midiPlayer.startOrStop();
            return false;
        }
        if (e.which == 179) {
            // Play button
            midiPlayer.startOrPause();
        }
        if (e.which == 178) {
            // Stop button
            midiPlayer.stop();
        }

        return true;
    };
}