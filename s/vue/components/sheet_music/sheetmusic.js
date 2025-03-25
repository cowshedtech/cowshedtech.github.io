class SheetMusic {

    #changeHandlers = [];
    #svg;

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

        // called by generate_ABC to remake the sheet music on the page
    displayNewSVG() {
        var svgTarget = document.getElementById("svgTarget"),
            diverr = document.getElementById("diverr");

        var abc_source = document.getElementById("ABCsource").value;
        var svg_return = renderABCtoSVG(editor.track, abc_source);

        diverr.innerHTML = svg_return.error_html;
        // svgTarget.innerHTML = svg_return.svg;
        
        this.setSVG(svg_return.svg)        
    };


    /**
     * Gets the current svg
     * @returns {string} The current svg
     */
    getSVG() {
        return this.#svg;
    }

    /**
     * Sets a new svg and notifies handlers
     * @param {string} svg - The new svg to set
     */
    setSVG(svg) {
        this.#svg = svg;
        this.#notifyHandlers();
    }


}
