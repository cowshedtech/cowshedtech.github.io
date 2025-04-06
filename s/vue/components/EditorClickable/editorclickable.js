class EditorClickable {

    #changeHandlers = [];
    #track;
    

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

    stop() {
        this.clearHighlight()
    }

    //
    //
    clearHighlight(instrument) {

        if (class_cur_highlight_ids.all_notes !== false) {
            var bg_ele = document.getElementById("bg-highlight" + class_cur_highlight_ids.all_notes);
            if (bg_ele) {
                bg_ele.style.background = "transparent";
            }
            class_cur_highlight_ids.all_notes = false;
        }
    }    
}