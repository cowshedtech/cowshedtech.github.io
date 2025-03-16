
class Options {

    advancedEditIsOn;
    highlightOn;
    tomsVisible;
    showStickings;
    showLegend;
    debugMode;
    grooveDBAuthoring;

    /**
     * 
     */    
    constructor() {}   

    /**
     * the user has clicked on the options menu
     */    
    optionsAnchorClick = function (event) {

        var contextMenu = document.getElementById("optionsContextMenu");
        if (contextMenu) {
            var anchorPoint = document.getElementById("optionsAnchor");

            if (anchorPoint) {
                var anchorPos = getTagPosition(anchorPoint);
                contextMenu.style.top = anchorPos.y + anchorPoint.offsetHeight + "px";
                contextMenu.style.left = anchorPos.x + anchorPoint.offsetWidth - 150 + "px";
            }
            this.optionsMenuSetSelectedState()
            showContextMenu(contextMenu);
        }
    };

    /**
     * the user has clicked on the options menu
     */    
    optionsMenuSetSelectedState() {
        if (this.highlightOn) {
            addOrRemoveKeywordFromClassById("optionsContextMenuHighlight", "menuChecked", true);			
        } else {
            addOrRemoveKeywordFromClassById("optionsContextMenuHighlight", "menuChecked", false);
        }
    };

    /**
     * the user has clicked on the options menu
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


    // 
    /**
     * user has clicked on the advanced edit button
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