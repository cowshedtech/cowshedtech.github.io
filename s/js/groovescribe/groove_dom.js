// Javascript for the Groove Scribe HTML application
// Groove Scribe is for drummers and helps create sheet music with an easy to use WYSIWYG groove editor.
//
// Functions for manipulating the browser dom
//


/**
 * Adds or removes a keyword from an element's class list
 * @param {HTMLElement} element - The DOM element to modify
 * @param {string} keyword - The class name to add or remove
 * @param {boolean} shouldAdd - True to add the class, false to remove it
 * @returns {boolean} True if operation succeeded, false if invalid input
 */
function addOrRemoveKeywordFromClass(element, keyword, shouldAdd) {
    // Validate inputs
    if (!element?.className) {
        console.warn(
            'Invalid element in addOrRemoveKeywordFromClass:',
            !element ? 'null element' : `missing className for ID: ${element.id}`
        );
        return false;
    }

    try {
        // Use native classList methods for better performance
        if (shouldAdd) {
            element.classList.add(keyword);
        } else {
            element.classList.remove(keyword);
        }
        return true;
    } catch (error) {
        console.warn('Error modifying class:', error);
        return false;
    }
}


/**
 * Adds or removes a class from an element identified by its ID
 * @param {string} elementId - The ID of the element to modify
 * @param {string} className - The class name to add or remove
 * @param {boolean} shouldAdd - True to add the class, false to remove it
 * @returns {boolean} True if operation succeeded, false if element not found or operation failed
 * @example
 * // Add 'active' class to element with ID 'myButton'
 * addOrRemoveKeywordFromClassById('myButton', 'active', true);
 */
function addOrRemoveKeywordFromClassById(elementId, className, shouldAdd) {
    const element = document.getElementById(elementId);
    
    if (!element) {
        console.warn(`Unable to modify class: element with ID "${elementId}" not found`);
        return false;
    }

    return addOrRemoveKeywordFromClass(element, className, shouldAdd);
}


/**
 * Adds the 'buttonSelected' class to highlight an element
 * @param {HTMLElement} element - The element to highlight
 * @returns {boolean} True if highlighting succeeded, false otherwise
 * @example
 * selectButton(document.getElementById('myButton'));
 */
const selectButton = (element) => {
    if (!element) {
        console.warn('Cannot highlight null element');
        return false;
    }

    // Use classList directly for better performance
    try {
        element.classList.add('buttonSelected');
        return true;
    } catch (error) {
        console.warn('Failed to highlight element:', error);
        return false;
    }
};


/**
 * Removes the 'buttonSelected' class to unhighlight an element
 * @param {HTMLElement} element - The element to unhighlight
 * @returns {boolean} True if unhighlighting succeeded, false otherwise
 * @example
 * unselectButton(document.getElementById('myButton'));
 */
const unselectButton = (element) => {
    if (!element) {
        console.warn('Cannot unhighlight null element');
        return false;
    }

    // Use classList directly for better performance
    try {
        element.classList.remove('buttonSelected');
        return true;
    } catch (error) {
        console.warn('Failed to unhighlight element:', error);
        return false;
    }
};


/**
 * Gets the absolute position of an element on the page
 * @param {HTMLElement} element - The element to get position for
 * @returns {{x: number, y: number}} Object containing absolute x,y coordinates
 * @example
 * const pos = getTagPosition(document.getElementById('myElement'));
 * console.log(pos.x, pos.y);
 */
const getTagPosition = (element) => {
    // Return origin point if no element provided
    if (!element) {
        console.warn('Cannot get position of null element');
        return { x: 0, y: 0 };
    }

    try {
        const rect = element.getBoundingClientRect();
        const { scrollX = 0, scrollY = 0 } = window;
        
        return {
            x: Math.round(rect.left + scrollX),
            y: Math.round(rect.top + scrollY)
        };
    } catch (error) {
        console.warn('Failed to get element position:', error);
        return { x: 0, y: 0 };
    }
};


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


// Helper method for browser detection
function isIE10() {
    const browserInfo = getBrowserInfo();
    return browserInfo.browser === "MSIE" && browserInfo.version < 12;
}