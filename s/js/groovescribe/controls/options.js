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
    highlightOn;

    /** @type {boolean} Whether tom drums are visible in the editor */
    tomsVisible;

    /** @type {boolean} Whether sticking notations are shown */
    showStickings;

    /** @type {boolean} Whether the legend is displayed */
    showLegend;

    /** @type {boolean} Whether the editor is in view-only mode */
    viewMode = false;

    /** @type {boolean} Whether debug mode is enabled */
    debugMode;

    /** @type {boolean} Whether groove database authoring is enabled */
    grooveDBAuthoring;

    /**
     * Initializes a new Options instance with default settings
     */
    constructor() {}

    /**
     * Event handler for options menu button click. Displays the options context menu
     * positioned relative to the options anchor element.
     * 
     * @param {Event} event - The click event object (unused in current implementation)
     * @requires DOM elements:
     * - #optionsContextMenu - The context menu element to show
     * - #optionsAnchor - The anchor point element for positioning
     * @requires getTagPosition - Function to get an element's position
     * @requires showContextMenu - Function to display the context menu
     */
    optionsAnchorClick = (event) => {
        const contextMenu = document.getElementById('optionsContextMenu');
        if (!contextMenu) return;

        const anchorPoint = document.getElementById('optionsAnchor');
        if (anchorPoint) {
            const anchorPos = getTagPosition(anchorPoint);
            const MENU_OFFSET = 150;

            contextMenu.style.top = `${anchorPos.y + anchorPoint.offsetHeight}px`;
            contextMenu.style.left = `${anchorPos.x + anchorPoint.offsetWidth - MENU_OFFSET}px`;
        }

        this.optionsMenuSetSelectedState();
        showContextMenu(contextMenu);
    };

    /**
     * Updates the visual state of options menu items to reflect current settings.
     * Specifically handles the highlight option checkbox state.
     * 
     * @requires addOrRemoveKeywordFromClassById - Function to modify element classes
     * @requires DOM elements:
     * - #optionsContextMenuHighlight - The highlight option menu item
     */
    optionsMenuSetSelectedState() {
        if (this.highlightOn) {
            addOrRemoveKeywordFromClassById("optionsContextMenuHighlight", "menuChecked", true);			
        } else {
            addOrRemoveKeywordFromClassById("optionsContextMenuHighlight", "menuChecked", false);
        }
    };

    /**
     * Toggles the highlight feature on/off and updates the UI accordingly.
     * Also ensures proper cleanup of existing highlights when turning off.
     * 
     * @param {string} option_type - The type of option being toggled (unused in current implementation)
     * @requires Functions:
     * - clear_all_highlights - Function to remove all current highlights
     * - clearHighlightNoteInABCSVG - Function to clear ABC notation highlights
     * - updateCurrentURL - Function to update browser URL with new state
     */
    optionsHighlightPopupClick(option_type) {

        this.highlightOn = !this.highlightOn
        editor.track.highlightOn = this.highlightOn
        
        // Ensure current highlighting removed if highlighing now off
        if (!this.highlightOn) clear_all_highlights(null);
        if (!this.highlightOn) clearHighlightNoteInABCSVG(editor.track.trackID);
        
        this.optionsMenuSetSelectedState();
        updateCurrentURL();
    };


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