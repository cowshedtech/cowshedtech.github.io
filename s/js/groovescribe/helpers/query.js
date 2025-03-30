// Javascript for the Groove Scribe HTML application
// Groove Scribe is for drummers and helps create sheet music with an easy to use WYSIWYG groove editor.
//
// Functions for reading and manipulating a browser query
//


/**
 * Gets information about the current browser environment
 * @returns {{browser: string, version: string, platform: string, uastring: string}}
 */
const getBrowserInfo = () => {
    const UNKNOWN = 'Unknown';
    const PLATFORMS = {
        IOS: /iPhone|iPad|iPod/,
        MAC: /Mac/,
        ANDROID: /Android/
    };

    const BROWSERS = {
        Edge: /Edge\/(\d+)/,
        Chrome: /Chrome\/(\d+)/,
        Firefox: /Firefox\/(\d+)/,
        Safari: /Safari\/(\d+).*Version\/(\d+)/,
        MSIE: /(?:MSIE |rv:)(\d+)/
    };

    let browser = UNKNOWN;
    let version = UNKNOWN;
    const useragent = navigator.userAgent;

    try {
        // Try modern User-Agent Client Hints API
        if (navigator.userAgentData?.brands) {
            const brand = navigator.userAgentData.brands
                .find(b => !b.brand.includes('Not') && !b.brand.includes('Brand'));
            
            if (brand) {
                ({ brand: browser, version } = brand);
                return { browser, version, platform: getPlatform(), uastring: useragent };
            }
        }

        // Fallback to traditional UA parsing
        for (const [name, regex] of Object.entries(BROWSERS)) {
            const match = useragent.match(regex);
            if (match) {
                browser = name;
                version = name === 'Safari' ? match[2] : match[1];
                break;
            }
        }

        return {
            browser,
            version,
            platform: getPlatform(),
            uastring: useragent
        };
    } catch (error) {
        console.warn('Error detecting browser info:', error);
        return {
            browser: UNKNOWN,
            version: UNKNOWN,
            platform: 'windows',
            uastring: useragent
        };
    }

    /**
     * Determines the current platform
     * @returns {string} Platform identifier
     */
    function getPlatform() {
        if (!navigator.platform) return 'windows';

        if (PLATFORMS.IOS.test(navigator.platform)) return 'iOS';
        if (PLATFORMS.MAC.test(navigator.platform)) return 'mac';
        if (PLATFORMS.ANDROID.test(useragent)) return 'android';
        
        return 'windows';
    }
};


/**
 * Extracts a query parameter value from a URL string
 * @param {string} key - The parameter key to search for
 * @param {string} defaultValue - Value to return if parameter not found
 * @param {string} queryString - The URL query string to parse
 * @returns {string} The parameter value or default value
 * @example
 * getQueryVariableFromString('page', '1', '?page=2&sort=desc');
 */
const getQueryVariableFromString = (key, defaultValue, queryString) => {
    try {
        const params = new URLSearchParams(queryString.slice(1));
        const value = params.get(key);
        return value ?? defaultValue;
    } catch (error) {
        console.warn('Failed to parse query string:', error);
        return defaultValue;
    }
};


/**
 * Gets a query parameter value from the current URL
 * @param {string} key - The parameter key to search for
 * @param {string} defaultValue - Value to return if parameter not found
 * @returns {string} The parameter value or default value
 * @example
 * const page = getQueryVariableFromURL('page', '1');
 */
const getQueryVariableFromURL = (key, defaultValue) => 
    getQueryVariableFromString(key, defaultValue, window.location.search);





/**
 * Detects if the current device supports touch input
 * @returns {boolean} True if touch is supported
 */
const isTouchDevice = () => {
    try {
        return 'ontouchstart' in window || 
            navigator.maxTouchPoints > 0 || 
            window.matchMedia('(pointer: coarse)').matches;
    } catch (error) {
        console.warn('Error detecting touch capability:', error);
        return false;
    }
};