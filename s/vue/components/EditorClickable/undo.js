var undoStack = [];
var redoStack = [];
var undoStackMaxSize = 40;


//
//
//
function undoCommand() {
    if (undoStack.length > 1) {
        var undoURL = undoStack.pop();
        addItemToUndoOrRedoStack(undoURL, redoStack); // add to redo stack
        // the one we want to load is behind the head, since all changes go on the undo stack immediately
        // no need to pop, since it would just get added right back on anyways
        undoURL = undoStack[undoStack.length - 1];
        editor.updateFromURL(undoURL);
    }
};


//
//
//
function redoCommand() {
    if (redoStack.length > 0) {
        var redoURL = redoStack.pop();
        addItemToUndoOrRedoStack(redoURL, undoStack); // add to undo stack
        editor.updateFromURL(redoURL);
    }
};


//
// debug print the stack
//
function debugPrintUndoRedoStack() {
    var i;
    var newHTML = "<h3>Undo Stack</h3><ol>";
    for (i in undoStack) {
        newHTML += "<li>" + undoStack[i];
    }
    newHTML += "</ol><br>";
    document.getElementById("undoStack").innerHTML = newHTML;

    newHTML = "<h3>Redo Stack</h3><ol>";
    for (i in redoStack) {
        newHTML += "<li>" + redoStack[i];
    }
    newHTML += "</ol><br>";
    document.getElementById("redoStack").innerHTML = newHTML;
}


//
// push the new URL on the undo or redo stack
// keep the stacks at a managable size
function addItemToUndoOrRedoStack(newURL, ourStack, noClear) {

    if (!ourStack)
        return false;

    if (newURL == undoStack[undoStack.length - 1]) {
        //debugPrintUndoRedoStack();
        return false; // no change, so don't push
    }

    if (newURL == redoStack[redoStack.length - 1]) {
        return false;
    }

    ourStack.push(newURL);
    while (ourStack.length > undoStackMaxSize)
        ourStack.shift();

    //debugPrintUndoRedoStack();

    return true;
};


//
//
//
function addFullURLToUndoStack(fullURL) {
    var urlFragment;

    var searchData = fullURL.indexOf("?");

    urlFragment = fullURL.slice(searchData);

    // clear redo array whenever we add a new valid element to the stack
    // when we undo, we end up with a null push that returns false here
    if (addItemToUndoOrRedoStack(urlFragment, undoStack)) {
        redoStack = [];
    }
};