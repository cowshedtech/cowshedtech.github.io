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