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
}