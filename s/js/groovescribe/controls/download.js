// the user has clicked on the download menu (at bottom)
root.DownloadAnchorClick = function (event) {

    var contextMenu = document.getElementById("downloadContextMenu");
    if (contextMenu) {
        var anchorPoint = document.getElementById("downloadButton");

        if (anchorPoint) {
            if (!event)
                event = window.event;
            if (event.clientX || event.clientY) {
                contextMenu.style.top = event.clientY - 150 + "px";
                contextMenu.style.left = event.clientX - 150 + "px";
            }
        }
        showContextMenu(contextMenu);
    }
};