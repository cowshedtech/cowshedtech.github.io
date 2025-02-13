// Javascript for the Groove Scribe HTML application
// Groove Scribe is for drummers and helps create sheet music with an easy to use WYSIWYG groove editor.
//
// Functions for manipulating the browser dom
//

//
//
//
function addOrRemoveKeywordFromClass(tag_class, keyword, addElseRemove) {
    if (!tag_class) {
        console.log("Warning in addOrRemoveKeywordFromClassName: null tag_class passed in");
        return false;
    }

    if (!tag_class.className) {
        console.log("Warning in addOrRemoveKeywordFromClassName: null className for tag id: " + tag_class.id);
        console.trace();
        return false;
    }

    if (addElseRemove) {
        const classes = tag_class.className.split(' ');
        if (!classes.includes(keyword)) {
            classes.push(keyword);
            tag_class.className = classes.join(' ');
        }
    } else {
        tag_class.className = tag_class.className.split(' ')
            .filter(cls => cls !== keyword)
            .join(' ');
    }

    return true;
}


//
//
//
function addOrRemoveKeywordFromClassById(tagId, keyword, addElseRemove) {
    const element = document.getElementById(tagId);

    if (!element) {
        console.warn(`Element with ID "${tagId}" not found`);
        return false;
    }

    return addOrRemoveKeywordFromClass(element, keyword, addElseRemove);
}


//
//
// highlight the new div by adding selected css class   
function selectButton(element) {
    addOrRemoveKeywordFromClass(element, "buttonSelected", true);
}


//
//
// remove selected class if it exists
function unselectButton(element) {
    addOrRemoveKeywordFromClass(element, "buttonSelected", false);
}


//
//
//
function getTagPosition(tag) {
    // Return early if no tag is provided
    if (!tag) {
        return { x: 0, y: 0 };
    }

    // Use getBoundingClientRect() for more accurate positioning
    const rect = tag.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    return {
        x: rect.left + scrollLeft,
        y: rect.top + scrollTop
    };
}


//
//
//
function showHideCSS_ClassDisplay(className, force, showElseHide, showState) {
    const elements = document.querySelectorAll(className);

    if (!elements.length) return false;

    const newState = force ? showElseHide : elements[0].style.display !== showState;

    elements.forEach(element => {
        element.style.display = newState ? showState : 'none';
    });

    return newState;
}


//
//
//
function showHideCSS_ClassVisibility(className, force, showElseHide) {
    const elements = document.querySelectorAll(className);

    elements.forEach(element => {
        if (force) {
            element.style.visibility = showElseHide ? "visible" : "hidden";
        } else {
            element.style.visibility = element.style.visibility === "visible" ? "hidden" : "visible";
        }
    });
}

//
//
//
function isElementOnScreen(element) {
    var rect = element.getBoundingClientRect();

    return (
        rect.top >= 80 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
};