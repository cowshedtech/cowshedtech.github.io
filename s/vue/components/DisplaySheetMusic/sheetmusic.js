class SheetMusic {

    #track;
    #svg;
    #highlightedNoteIndex


    constructor() { 
        this.#highlightedNoteIndex = -1;
    }

    /**
     * Update our sheet music 
     * @param {string} abc_source - The abc notation for our track
     */    
    updateFromTrack(track) {
        
        var renderWidth = 600;
        var svgTarget = document.getElementById("svgTarget");
        if (svgTarget) {
            renderWidth = svgTarget.offsetWidth - 100;
            renderWidth = Math.floor(renderWidth * 0.8);  // reduce width by 20% (This actually makes the notes bigger, because we scale up everything to max width)
        }

        var abc_source = generate_ABC_from_track(renderWidth, track);    
        var svg_return = renderABCtoSVG(track, abc_source);

        // TODO
        // var diverr = document.getElementById("diverr");
        // diverr.innerHTML = svg_return.error_html;        
        
        this.#svg = svg_return.svg;
        this.#track = track;
        window.eventBus.$emit('sheet-music-updated');
    };


    /**
     * Gets the current svg
     * @returns {string} The current svg
     */
    getSVG() {
        return this.#svg;
    }

    stop() {
        this.clearHighlight()
    }


    /**
     * Sets a new svg and notifies handlers
     * @param {string} svg - The new svg to set
     */
    // setSVG(svg) {
    //     this.#svg = svg;
    //     this.#notifyHandlers();
    // }

    /**
     * cross index the percent complete with the myGrooveData note arrays to find the nth note, higlight note
     * @param
     * @param
     */
    highlightNote(percentComplete) {

        if (!this.#track || !Array.isArray(this.#track.noteMappingArray) || this.#track.noteMappingArray.length === 0) return
            
        // How many measures do we have when we include repeats
        let totalMeasures = this.#track.numberOfMeasures + Array.from(this.#track.repeatedMeasures.values()).reduce((sum, repeats) => sum + (repeats - 1), 0);
        
        // How far through are we when we consider repeats in the total
        var curNoteIndexNew = percentComplete * 32 * totalMeasures;
        
        // Which measure are we currently on taking account of repeated measures
        let measure = getCurrentMeasureWithRepeats(curNoteIndexNew, this.#track.numberOfMeasures, this.#track.repeatedMeasures);
        
        // Figure out our adjusted note position taking account of repeated measures
        let adjusted_note_id_in_32 = measure * 32 + curNoteIndexNew % 32;
        
        // Now figure out which actual note we are on in abc
        var real_note_index = this.#getRealNoteIndex(adjusted_note_id_in_32, this.#track.noteMappingArray);
        
        // now the real_note_index should map to the correct abc note, highlight italics
        this.#highlightNoteByIndex(real_note_index);	
    };

    
    /* 
    * Cross index the percent complete with the myGrooveData note arrays to find the nth note, higlight note
    * @param
    * @param
    */
    #highlightNoteByIndex(noteToHighlight) {

        this.clearHighlight();

        var myElements = document.querySelectorAll("#abcNoteNum_" + this.#track.trackID + "_" + noteToHighlight);
        for (var i = 0; i < myElements.length; i++) {
            myElements[i].setAttribute("class", myElements[i].getAttribute("class") + " highlighted");
            this.#highlightedNoteIndex = noteToHighlight;
        }
    };


    /* 
    * Cross index the percent complete with the myGrooveData note arrays to find the nth note, higlight note
    * @param
    * @param
    */
    clearHighlight() {
        if (!this.#track || this.#highlightedNoteIndex < 0) return;
        
        var myElements = document.querySelectorAll("#abcNoteNum_" + this.#track.trackID + "_" + this.#highlightedNoteIndex);
        for (var i = 0; i < myElements.length; i++) {
            //note.className = note.className.replace(new RegExp(' highlighted', 'g'), "");
            var class_name = myElements[i].getAttribute("class");
            myElements[i].setAttribute("class", class_name.replace(new RegExp(' highlighted', 'g'), ""));

            // TODO
            // if (options.debugMode && i === 0) {
            //     if (!isElementOnScreen(myElements[i])) {
            //         if (this.#highlightedNoteIndex === 0)
            //             myElements[i].scrollIntoView({ block: "start", behavior: "smooth" });   // autoscroll if necessary
            //         else
            //             myElements[i].scrollIntoView({ block: "end", behavior: "smooth" });   // autoscroll if necessary
            //     }
            // }
        }
        this.#highlightedNoteIndex = -1;        
    };


    /* 
    * 
    */
    #getRealNoteIndex(notePosition, noteMappingArray) {
        var real_note_index = -1;
        for (var i = 0; i < notePosition && i < noteMappingArray.length; i++) {
            if (noteMappingArray[i]) real_note_index++;
        }
        return real_note_index;
    };

}





//
//
//
function getCurrentMeasureWithRepeats(curNoteIndexNew, numberOfMeasures, repeatedMeasures) {
    let cursor = 0;
    let measure = 0;
    for (let i = 0; i < numberOfMeasures; i++) {
        let repeats = repeatedMeasures.get(i) || 1; 
        let nextCursor = cursor + 32 * repeats - 1; 
        if (curNoteIndexNew > cursor && curNoteIndexNew < nextCursor) {
            measure = i;        
            break;
        }
        cursor = nextCursor; // Update cursor to next position
    }
    return measure;
};