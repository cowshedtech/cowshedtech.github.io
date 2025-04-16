class SheetMusic {

    #changeHandlers = [];
    #track;
    #svg;
    #highlightedNoteIndex


    constructor() { }

    /**
     * Adds a new change event handler
     * @param {Function} handler - The callback function to be called when changes occur
     * @returns {Function} - A function to remove this handler
     */
    addChangeHandler(handler) {
        this.#changeHandlers.push(handler);
        return () => this.removeChangeHandler(handler);
    }


    /**
     * Removes a change event handler
     * @param {Function} handler - The callback function to remove
     */
    removeChangeHandler(handler) {
        const index = this.#changeHandlers.indexOf(handler);
        if (index !== -1) this.#changeHandlers.splice(index, 1);
    }


    /**
     * Notifies all registered handlers of a change
     */
    #notifyHandlers() {
        this.#changeHandlers.forEach(handler => handler());
    }


    /**
     * Update our sheet music 
     * @param {string} abc_source - The abc notation for our track
     */    
    update(track, abc_source) {
        
        var svg_return = renderABCtoSVG(editor.track, abc_source);

        var diverr = document.getElementById("diverr");
        diverr.innerHTML = svg_return.error_html;        
        
        // this.setSVG()    
        this.#svg = svg_return.svg;
        this.#track = track;
        this.#notifyHandlers();    
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

        if (this.#track.noteMappingArray === null) return
            
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