// Javascript for the Groove Scribe HTML application

/**
 * Checks if a specific instrument is muted for a given measure
 * @param {string} instrument - The instrument name (e.g., 'HH', 'Snare')
 * @param {number} measure - The measure number
 * @returns {boolean} True if the instrument is muted, false otherwise
 */
function isInstrumentMuted(instrument, measure) {
    const buttonId = `unmute${instrument}Button${measure}`;
    const button = document.getElementById(buttonId);
    
    return button?.style.display === "inline-block" ?? false;
}