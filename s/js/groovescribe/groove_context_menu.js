// Javascript for the Groove Scribe HTML application

//
//
//
var isContextMenuVisible = false; // a single context menu can be visible at a time.


/**
 * Shows a context menu and handles its positioning
 * @param {HTMLElement} contextMenu - The context menu element to display
 */
function showContextMenu(contextMenu) {
    // Close any existing open context menu
    if (isContextMenuVisible) hideContextMenu(isContextMenuVisible);
    
    // Show the new context menu
    contextMenu.style.display = "block";
    isContextMenuVisible = contextMenu;

    // Adjust position if menu extends beyond viewport
    const viewportHeight = document.documentElement.clientHeight;
    const menuBottom = contextMenu.offsetTop + contextMenu.clientHeight;
    
    if (menuBottom > viewportHeight) {
        contextMenu.style.top = `${viewportHeight - contextMenu.clientHeight}px`;
    }

    // Setup click handler to close menu
    requestAnimationFrame(() => {
        document.onclick = documentOnClickHandlerCloseContextMenu;
        document.body.style.cursor = "pointer"; // Enable click events on iPad
    });
}


/**
 * Hides the context menu and resets document click handling
 * @param {HTMLElement} contextMenu - The context menu element to hide
 */
function hideContextMenu(contextMenu) {
    // Reset document click handling
    document.onclick = null;
    document.body.style.cursor = "auto";

    // Hide menu if it exists
    if (contextMenu) {
        contextMenu.style.display = "none";
        isContextMenuVisible = false;
    }
}


/**
 * Global click handler to close context menu when clicking outside
 * @param {MouseEvent} event - The click event
 */
function documentOnClickHandlerCloseContextMenu(event) {
    if (!isContextMenuVisible) return;

    const isClickOutsideMenu = !isContextMenuVisible.contains(event.target);
    if (isClickOutsideMenu) {
        hideContextMenu(isContextMenuVisible);
    }
}
