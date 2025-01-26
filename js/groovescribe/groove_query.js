// Javascript for the Groove Scribe HTML application
// Groove Scribe is for drummers and helps create sheet music with an easy to use WYSIWYG groove editor.
//
// Functions for reading and manipulating the browser query
//

//
//
//
function getQueryVariableFromString(variable, def_value, my_string) {
    var query = my_string.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0].toLowerCase() == variable.toLowerCase()) {
            return pair[1];
        }
    }
    return (def_value);
};


//
//
//
function getQueryVariableFromURL(variable, def_value) {
    return (getQueryVariableFromString(variable, def_value, window.location.search));
};


//
//
//
function getBrowserInfo() {
    const useragent = navigator.userAgent;
    let browser = "Unknown";
    let version = "Unknown";
    
    // Modern browser detection using User-Agent Client Hints when available
    if (navigator.userAgentData) {
        const brands = navigator.userAgentData.brands;
        const brand = brands.find(b => !b.brand.includes("Not") && !b.brand.includes("Brand"));
        if (brand) {
            browser = brand.brand;
            version = brand.version;
        }
    } else {
        // Fallback to user agent parsing
        const browserMatches = {
            'Edge': /Edge\/(\d+)/,
            'Chrome': /Chrome\/(\d+)/,
            'Firefox': /Firefox\/(\d+)/,
            'Safari': /Safari\/(\d+).*Version\/(\d+)/,
            'MSIE': /(?:MSIE |rv:)(\d+)/
        };

        for (const [name, regex] of Object.entries(browserMatches)) {
            const match = useragent.match(regex);
            if (match) {
                browser = name;
                // For Safari, use Version/X.X instead of Safari/X.X
                version = name === 'Safari' ? match[2] : match[1];
                break;
            }
        }
    }

    // Platform detection using modern navigator.platform (when available)
    let platform = "windows";
    if (navigator.platform) {
        if (/iPhone|iPad|iPod/.test(navigator.platform)) {
            platform = "iOS";
        } else if (/Mac/.test(navigator.platform)) {
            platform = "mac";
        } else if (/Android/.test(useragent)) {
            platform = "android";
        }
    }

    return {
        browser,
        version,
        platform,
        uastring: useragent
    };
}