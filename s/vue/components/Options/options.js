// Javascript for the Groove Scribe HTML application
// Groove Scribe is for drummers and helps create sheet music with an easy to use WYSIWYG groove editor.
//
// Functions for handling options
//

/**
 * Manages application-wide options and settings for the Groove Scribe editor.
 * Handles visibility toggles, editing modes, and debug settings.
 */
class Options {
    /** @type {boolean} Whether advanced editing features are enabled */
    advancedEditIsOn;

    /** @type {boolean} Whether note highlighting is enabled */
    #highlightOn;

    /** @type {boolean} Whether tom drums are visible in the editor */
    #tomsVisible = false;

    /** @type {boolean} Whether sticking notations are shown */
    #stickingsVisible = false;

    /** @type {boolean} Whether the legend is displayed */
    showLegend;

    /** @type {boolean} Whether the editor is in view-only mode */
    viewMode = false;

    /** @type {boolean} Whether debug mode is enabled */
    debugMode = false;

    /** @type {boolean} Whether groove database authoring is enabled */
    grooveDBAuthoring = false;

    #changeHandlers = [];

    /**
     * Initializes a new Options instance with default settings
     */
    constructor() {}

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
     * is note highlighting on
     * @returns {boolean} The current frequency
     */
    isHighlightOn() {
        return this.#highlightOn;
    }

    /**
     * Sets whether note highlighting is on
     * @param {boolean} isOn - is highlighting on
     */
    setHighlightOn(isOn) {
        this.#highlightOn = isOn;
        this.#notifyHandlers();
    }

    /**
     * is sticking visible
     * @returns {boolean} true if sticking visible
     */
    isStickingVisible() {
        return this.#stickingsVisible;
    }

    /**
     * Sets whether sticking is visible
     * @param {boolean} isVisible - is sticking visible
     */
    setStickingVisible(isVisible) {
        this.#stickingsVisible = isVisible;
        this.#notifyHandlers();
    }

    /**
     * are toms visible
     * @returns {boolean} true if toms visible
     */
    areTomsVisible() {
        return this.#tomsVisible;
    }

    /**
     * Sets whether toms are visible
     * @param {boolean} isVisible - is toms visible
     */
    setTomsVisible(isVisible) {
        this.#tomsVisible = isVisible;
        this.#notifyHandlers();
    }

    /**
     * are we in view only mode
     * @returns {boolean} true if view only mode
     */
    isViewMode() {
        return this.viewMode;
    }

    /**
     * Sets whether view only mode
     * @param {boolean} isViewMode - is view only mode
     */
    setViewMode(isViewMode) {
        this.viewMode = isViewMode;
        this.#notifyHandlers();
    }

    
    /**
     * Toggles the advanced edit mode and updates the button state accordingly.
     * When enabled, provides access to additional editing features.
     * 
     * @requires DOM elements:
     * - #advancedEditAnchor - The advanced edit button element
     * @requires Functions:
     * - selectButton - Function to visually select a button
     * - unselectButton - Function to visually unselect a button
     */
    toggleAdvancedEdit() {
        if (this.advancedEditIsOn) {
            this.advancedEditIsOn = false;
            unselectButton(document.getElementById("advancedEditAnchor"));
        } else {
            this.advancedEditIsOn = true;
            selectButton(document.getElementById("advancedEditAnchor"));
        }
    };
}