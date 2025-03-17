function fillInShortenedURLInFullURLPopup(fullURL, cssIdOfTextFieldToFill) {
    document.getElementById("embedCodeCheckbox").checked = false;  // uncheck embedCodeCheckbox, because it is not compatible

    var params = {
        "dynamicLinkInfo": {
            "domainUriPrefix": "https://gscribe.com/share",
            "link": fullURL
        }
    };

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyBx4So11fGFPgTI62nP-JmxrxHmuRpJ120');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        if (xhr.status === 200) {
            // success
            var response = JSON.parse(xhr.responseText);
            var textField = document.getElementById(cssIdOfTextFieldToFill);
            textField.value = response.shortLink;
            // select the URL for copy/paste
            textField.focus();
            textField.select();
            document.getElementById("shortenerCheckbox").checked = true;  // this is now true if isn't already
        } else {
            document.getElementById("shortenerCheckbox").checked = false;  // request failed
        }
    };
    xhr.send(JSON.stringify(params));

}

// embed looks something like this:
// <iframe width="100%" height="240" src="https://hosting.com/path/GrooveDisplay.html?Div=16&Title=Example..." frameborder="0" ></iframe>
function fillInEmbedURLInFullURLPopup(fullURL, cssIdOfTextFieldToFill) {
    document.getElementById("shortenerCheckbox").checked = false;  // uncheck shortenerCheckbox, because it is not compatible
    document.getElementById("embedCodeCheckbox").checked = true;  // this will be true if isn't already

    var embedText = '<iframe width="100%" height="240" src="' + fullURL + '" frameborder="0" ></iframe>	';

    var textField = document.getElementById(cssIdOfTextFieldToFill);
    textField.value = embedText;

    // select the URL for copy/paste
    textField.focus();
    textField.select();
}

function shortenerCheckboxChanged() {
    if (document.getElementById("shortenerCheckbox").checked) {
        fillInShortenedURLInFullURLPopup(editor.get_FullURLForPage(), 'fullURLPopupTextField');
    } else {
        editor.fillInFullURLInFullURLPopup();
    }
};

function embedCodeCheckboxChanged() {
    if (document.getElementById("embedCodeCheckbox").checked) {
        fillInEmbedURLInFullURLPopup(editor.get_FullURLForPage("display"), 'fullURLPopupTextField');
    } else {
        fillInShortenedURLInFullURLPopup(editor.get_FullURLForPage(), 'fullURLPopupTextField');
    }
};


function fillInFullURLInFullURLPopup() {
    document.getElementById("embedCodeCheckbox").checked = false;  // uncheck embedCodeCheckbox
    document.getElementById("shortenerCheckbox").checked = false;  // uncheck shortenerCheckbox

    var popup = document.getElementById("fullURLPopup");
    if (popup) {
        var fullURL = editor.get_FullURLForPage();
        var textField = document.getElementById("fullURLPopupTextField");
        textField.value = fullURL;

        popup.style.display = "block";

        // select the URL for copy/paste
        textField.focus();
        textField.select();
    }
};



function show_FullURLPopup() {
    var popup = document.getElementById("fullURLPopup");

    var ShareBut = new ShareButton({
        ui: {
            flyout: 'bottom center', // change the flyout direction of the shares. chose from `top left`, `top center`, `top right`, `bottom left`, `bottom right`, `bottom center`, `middle left`, or `middle right` [Default: `top center`]
            button_font: false, // include the Lato font set from the Google Fonts API. [Default: `true`]
            buttonText: 'SHARE', // change the text of the button, [Default: `Share`]
            icon_font: false,   // include the minified Entypo font set. [Default: `true`]
        },
        networks: {
            facebook: {
                before: function () {
                    this.url = document.getElementById("fullURLPopupTextField").value;
                    this.description = "Check out this groove.";
                },
                //app_id : "839699029418014"    // staging id
                // app_id : "1499163983742002"   // MLDC id, lou created
                appId: "445510575651140",   // MLDC id, brad created
                loadSdk: true
            },
            googlePlus: {
                enabled: false
            },
            twitter: {
                before: function () {
                    this.url = encodeURIComponent(document.getElementById("fullURLPopupTextField").value);
                    this.description = "Check out this groove:  " + document.getElementById("fullURLPopupTextField").value;
                }
            },
            reddit: {
                before: function () {
                    this.url = document.getElementById("fullURLPopupTextField").value;
                    this.title = "Check out this groove: " + document.getElementById("fullURLPopupTextField").value;
                }
            },
            email: {
                before: function () {
                    this.url = document.getElementById("fullURLPopupTextField").value;
                    this.description = "Check out this groove. %0A%0A " + encodeURIComponent(document.getElementById("fullURLPopupTextField").value);
                }
            },
            pinterest: {
                enabled: false
            },
            linkedin: {
                enabled: false
            },
            whatsapp: {
                enabled: false
            }
        }
    });

    // open the popup with full url and try to load short in the background
    fillInFullURLInFullURLPopup();
    // default is to use shortened url
    fillInShortenedURLInFullURLPopup(editor.get_FullURLForPage(), 'fullURLPopupTextField');
};

function copyShareURLToClipboard() {
    var copyText = document.getElementById("fullURLPopupTextField");

    copyText.select();
    // hack fix for mobile
    copyText.setSelectionRange(0, 99999);

    document.execCommand("copy");
}

function close_FullURLPopup() {
    var popup = document.getElementById("fullURLPopup");

    if (popup)
        popup.style.display = "none";
};