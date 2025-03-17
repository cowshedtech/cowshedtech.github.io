// Javascript for the Groove Scribe HTML application
// Groove Scribe is for drummers and helps create sheet music with an easy to use WYSIWYG groove editor.
//
// Functions for handling help
//


/**
 * Event handler for the help button click. Displays a context menu positioned below the help anchor.
 * The menu is positioned relative to the help anchor's position, offset by its height and width.
 * 
 * @param {Event} event - The click event object (unused in current implementation)
 * @requires DOM elements:
 * - #helpContextMenu - The context menu element to show
 * - #helpAnchor - The anchor point element for positioning
 * @requires getTagPosition - Function to get an element's position
 * @see showContextMenu - Function called to display the context menu
 */
function helpAnchorClick(event) {
    const contextMenu = document.getElementById('helpContextMenu');
    if (!contextMenu) return;

    const anchorPoint = document.getElementById('helpAnchor');
    if (!anchorPoint) {
        showContextMenu(contextMenu);
        return;
    }

    const anchorPos = getTagPosition(anchorPoint);
    const MENU_OFFSET = 150;

    contextMenu.style.top = `${anchorPos.y + anchorPoint.offsetHeight}px`;
    contextMenu.style.left = `${anchorPos.x + anchorPoint.offsetWidth - MENU_OFFSET}px`;

    showContextMenu(contextMenu);
}


/**
 * Handles clicks on help menu items. Opens help/about pages in new windows or triggers undo/redo actions.
 * 
 * @param {string} help_type - The type of help action to perform:
 *   - 'help' - Opens the help documentation
 *   - 'about' - Opens the about page
 *   - 'undo' - Triggers the undo command
 *   - 'redo' - Triggers the redo command
 * @requires Functions:
 * - undoCommand - Function to handle undo operations
 * - redoCommand - Function to handle redo operations
 */
function helpMenuPopupClick(help_type) {
    const HELP_ACTIONS = {
        help: () => openHelpWindow('./content/gscribe_help.html'),
        about: () => openHelpWindow('./content/gscribe_about.html'),
        undo: undoCommand,
        redo: redoCommand
    };

    const action = HELP_ACTIONS[help_type];
    if (!action) {
        console.warn(`Invalid help type: ${help_type}`);
        return;
    }

    action();
}


/**
 * Helper function to open a help window in a new tab and focus it
 * @param {string} url - The URL to open
 */
function openHelpWindow(url) {
    const win = window.open(url, '_blank');
    if (win) win.focus();
}