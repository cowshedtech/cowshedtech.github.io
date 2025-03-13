// the user has clicked on the options menu
optionsAnchorClick = function (event) {

    var contextMenu = document.getElementById("optionsContextMenu");
    if (contextMenu) {
        var anchorPoint = document.getElementById("optionsAnchor");

        if (anchorPoint) {
            var anchorPos = getTagPosition(anchorPoint);
            contextMenu.style.top = anchorPos.y + anchorPoint.offsetHeight + "px";
            contextMenu.style.left = anchorPos.x + anchorPoint.offsetWidth - 150 + "px";
        }
        root.optionsMenuSetSelectedState()
        showContextMenu(contextMenu);
    }
};

root.optionsMenuSetSelectedState = function () {

    if (root.myGrooveUtils.highlightOn) {
        addOrRemoveKeywordFromClassById("optionsContextMenuHighlight", "menuChecked", true);			
    } else {
        addOrRemoveKeywordFromClassById("optionsContextMenuHighlight", "menuChecked", false);
    }
};

root.optionsHighlightPopupClick = function (option_type) {

    class_highlight_on = !class_highlight_on
    root.myGrooveUtils.highlightOn = class_highlight_on
    
    // Ensure current highlighting removed if highlighing now off
    if (!class_highlight_on) clear_all_highlights(null);
    if (!class_highlight_on) clearHighlightNoteInABCSVG(root.myGrooveUtils.grooveUtilsUniqueIndex);
    
    root.optionsMenuSetSelectedState();
    root.updateCurrentURL();
};


// user has clicked on the advanced edit button
this.toggleAdvancedEdit = function () {
    if (class_advancedEditIsOn) {
        // turn it off
        class_advancedEditIsOn = false;
        unselectButton(document.getElementById("advancedEditAnchor"));
    } else {
        class_advancedEditIsOn = true;
        selectButton(document.getElementById("advancedEditAnchor"));
    }
};