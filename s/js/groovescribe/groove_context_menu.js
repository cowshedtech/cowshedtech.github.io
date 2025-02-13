// Javascript for the Groove Scribe HTML application

//
//
//
var visible_context_menu = false; // a single context menu can be visible at a time.


// every document click passes through here.
// close a popup if one is up and we click off of it.
function documentOnClickHanderCloseContextMenu(event) {
    if (visible_context_menu) {
        hideContextMenu(visible_context_menu);
    }
};


//
//
//
function showContextMenu(contextMenu) {

    // if there is another context menu open, close it
    if (visible_context_menu) {
        hideContextMenu(visible_context_menu);
    }

    contextMenu.style.display = "block";
    visible_context_menu = contextMenu;

    // Check for screen visibility of the bottom of the menu
    if (contextMenu.offsetTop + contextMenu.clientHeight > document.documentElement.clientHeight) {
        // the menu has gone off the bottom of the screen
        contextMenu.style.top = document.documentElement.clientHeight - contextMenu.clientHeight + 'px';
    }

    // use a timeout to setup the onClick handler otherwise the click that opened the menu will close it right away.  :(
    setTimeout(function () {
        document.onclick = documentOnClickHanderCloseContextMenu;
        document.body.style.cursor = "pointer"; // make document.onclick work on iPad

    }, 100);
};


//
//
//
function hideContextMenu(contextMenu) {
    document.onclick = false;
    document.body.style.cursor = "auto"; // make document.onclick work on iPad

    if (contextMenu) {
        contextMenu.style.display = "none";
    }
    visible_context_menu = false;
};