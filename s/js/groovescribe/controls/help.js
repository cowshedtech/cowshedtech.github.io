// the user has clicked on the help menu
root.helpAnchorClick = function (event) {

    var contextMenu = document.getElementById("helpContextMenu");
    if (contextMenu) {
        var anchorPoint = document.getElementById("helpAnchor");

        if (anchorPoint) {
            var anchorPos = getTagPosition(anchorPoint);
            contextMenu.style.top = anchorPos.y + anchorPoint.offsetHeight + "px";
            contextMenu.style.left = anchorPos.x + anchorPoint.offsetWidth - 150 + "px";
        }
        showContextMenu(contextMenu);
    }
};


root.helpMenuPopupClick = function (help_type) {
    var win;

    switch (help_type) {
        case "help":
            win = window.open("./content/gscribe_help.html", '_blank');
            win.focus();
            break;

        case "about":
            win = window.open("./content/gscribe_about.html", '_blank');
            win.focus();
            break;

        case "undo":
            undoCommand();
            break;

        case "redo":
            redoCommand();
            break;

        default:
            console.log("bad case in helpMenuPopupClick()");
            break;
    }

};