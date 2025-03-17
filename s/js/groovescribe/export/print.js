function printMusic() {

    var oldMethod = true;

    if ((editor.browserInfo.browser == "Chrome" && editor.browserInfo.platform == "windows")) {
        oldMethod = false;
    }

    if (oldMethod) {
        // css media queries wiil hide all but the music
        // force a print

        window.print();

    } else {
        // open a new window just for printing   (new method)
        var win = window.open("", constant_APP_TITLE + " Print");
        win.document.body.innerHTML = "<title>" + editor.constant_APP_TITLE + "</title>\n<center>\n";
        win.document.body.innerHTML += document.getElementById("svgTarget").innerHTML;
        win.document.body.innerHTML += "\n</center>";
        win.print();
    }

};
