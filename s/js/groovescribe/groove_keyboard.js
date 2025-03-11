/**
 * Sets up keyboard shortcuts for MIDI player controls
 */
const setupHotKeys = () => {
    const KEYS = {
        SPACEBAR: 'Space',
        PLAY: 'MediaPlayPause',
        STOP: 'MediaStop'
    };

    const IGNORED_ELEMENTS = new Set(['INPUT', 'TEXTAREA']);    

    /**
     * Checks if the event target is valid for keyboard shortcuts
     * @param {KeyboardEvent} event - The keyboard event
     * @returns {boolean} True if the target is valid
     */
    const isValidTarget = (event) => {
        const targetTag = event.target.tagName.toUpperCase();
        return event.target.type !== 'range' && !IGNORED_ELEMENTS.has(targetTag);
    };

    /**
     * Handles keydown events
     * @param {KeyboardEvent} event - The keyboard event
     * @returns {boolean} False if event was handled, true otherwise
     */
    const handleKeyDown = (event) => {
        
        // Handle media keys
        switch (event.code) {
            case KEYS.PLAY:
                midiPlayer.startOrPause();
                return false;
            case KEYS.STOP:
                midiPlayer.stop();
                return false;
            case KEYS.SPACEBAR:
                if (isValidTarget(event)) {
                    midiPlayer.startOrStop();
                    return false;
                }
                break;
        }

        return true;
    };    

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);    

    // Return cleanup function
    return () => {
        document.removeEventListener('keydown', handleKeyDown);        
    };
};