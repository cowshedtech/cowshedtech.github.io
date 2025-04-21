// Javascript for the Groove Scribe HTML application
// Groove Scribe is for drummers and helps create sheet music with an easy to use WYSIWYG groove editor.
//
// Functions for manipulating the browser dom
//


/**
 * Checks if an element is fully visible within the viewport, accounting for an 80px top offset.
 * Uses the element's bounding rectangle to determine if it fits within the window dimensions.
 * 
 * @param {HTMLElement} element - The DOM element to check
 * @returns {boolean} True if the element is fully visible in the viewport (accounting for top offset),
 *                   false otherwise
 */
function isElementOnScreen(element) {
    var rect = element.getBoundingClientRect();

    return (
        rect.top >= 80 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
};


function updateRangeSlider(sliderID, value) {

    var slider = document.getElementById(sliderID);
    var programaticCSSRules = document.getElementById(sliderID + "CSSRules");
    if (!programaticCSSRules) {
        // create a new one.
        programaticCSSRules = document.createElement('style');
        programaticCSSRules.id = sliderID + "CSSRules";
        document.body.appendChild(programaticCSSRules);
    }

    var style_before = document.defaultView.getComputedStyle(slider, ":before");
    var style_after = document.defaultView.getComputedStyle(slider, ":after");
    var before_color = style_before.getPropertyValue('color');
    var after_color = style_after.getPropertyValue('color');

    // change the before and after colors of the slider using a gradiant
    var percent = Math.ceil(((value - slider.min) / (slider.max - slider.min)) * 100);

    var new_style_str = '#' + sliderID + '::-moz-range-track' + '{ background: -moz-linear-gradient(left, ' + before_color + ' ' + percent + '%, ' + after_color + ' ' + percent + '%)}\n';
    new_style_str += '#' + sliderID + '::-webkit-slider-runnable-track' + '{ background: -webkit-linear-gradient(left, ' + before_color + ' ' + '0%, ' + before_color + ' ' + percent + '%, ' + after_color + ' ' + percent + '%)}\n';
    programaticCSSRules.textContent = new_style_str;

}