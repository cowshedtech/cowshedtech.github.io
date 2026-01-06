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
    advancedEditIsOn = false;

    /** @type {boolean} Whether note highlighting is enabled */
    highlightOn = true;

    /** @type {boolean} Whether tom drums are visible in the editor */
    tomsVisible = false;

    /** @type {boolean} Whether sticking notations are shown */
    stickingsVisible = false;

    /** @type {boolean} Whether the legend is displayed */
    showLegend = false;

    /** @type {boolean} Whether the editor is in view-only mode */
    viewMode = false;

    /** @type {boolean} Whether debug mode is enabled */
    debugMode = false;

    /** @type {boolean} Whether groove database authoring is enabled */
    grooveDBAuthoring = false;

    /**
     * Initializes a new Options instance with default settings
     */
    constructor() {}

    /**
     * is note highlighting on
     * @returns {boolean} The current frequency
     */
    isHighlightOn() {
        return this.highlightOn;
    }

    /**
     * Sets whether note highlighting is on
     * @param {boolean} isOn - is highlighting on
     */
    setHighlightOn(isOn) {
        this.highlightOn = isOn;
        window.eventBus.$emit('options-updated');
    }

    /**
     * is sticking visible
     * @returns {boolean} true if sticking visible
     */
    isStickingVisible() {
        return this.stickingsVisible;
    }

    /**
     * Sets whether sticking is visible
     * @param {boolean} isVisible - is sticking visible
     */
    setStickingVisible(isVisible) {
        this.stickingsVisible = isVisible;
        window.eventBus.$emit('options-updated');
    }

    /**
     * are toms visible
     * @returns {boolean} true if toms visible
     */
    areTomsVisible() {
        return this.tomsVisible;
    }

    /**
     * Sets whether toms are visible
     * @param {boolean} isVisible - is toms visible
     */
    setTomsVisible(isVisible) {
        this.tomsVisible = isVisible;
        window.eventBus.$emit('options-updated');
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
        window.eventBus.$emit('options-updated');
    }

     /**
     * should we show legend
     * @returns {boolean} true if show legend
     */
    isShowLegend() {
        return this.showLegend;
    }

    /**
     * Sets whether we should show legend
     * @param {boolean} showLegend - is view only mode
     */
    setShowLegend(showLegend) {
        this.showLegend = showLegend;
        window.eventBus.$emit('options-updated');
    }

     /**
     * Is advanced edit enabled
     * @returns {boolean} true if show legend
     */
    isAdvancedEdit() {
        return this.advancedEditIsOn;
    }

    /**
     * Sets whether advanced edit enabled
     * @param {boolean} advancedEdit - is avanced edit
     */
    setAdvancedEdit(advancedEdit) {
        this.advancedEditIsOn = advancedEdit;
        window.eventBus.$emit('options-updated');
    }
}