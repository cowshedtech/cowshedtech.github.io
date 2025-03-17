// Javascript for the Groove Scribe HTML application
// Groove Scribe is for drummers and helps create sheet music with an easy to use WYSIWYG groove editor.
//
// Functions for handling downloads
//


/**
 * Event handler for the download button click. Displays a context menu positioned relative to the click coordinates.
 * The menu appears 150px offset from both the X and Y click position to avoid covering the clicked element.
 * 
 * @param {MouseEvent} [event] - The click event object. Falls back to window.event for older browsers
 * @requires DOM elements:
 * - #downloadContextMenu - The context menu element to show
 * - #downloadButton - The anchor point element for positioning
 * @see showContextMenu - Function called to display the context menu
 */
function downloadAnchorClick(event) {
    const contextMenu = document.getElementById('downloadContextMenu');
    if (!contextMenu) return;

    // Normalize event object for cross-browser compatibility
    const e = event || window.event;
    if (!e) return;

    // Position menu relative to click coordinates with a 150px offset
    const OFFSET = 150;
    if (typeof e.clientX === 'number' && typeof e.clientY === 'number') {
        contextMenu.style.top = `${e.clientY - OFFSET}px`;
        contextMenu.style.left = `${e.clientX - OFFSET}px`;
    }

    showContextMenu(contextMenu);
}