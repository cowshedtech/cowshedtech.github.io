
// embed looks something like this:
// <iframe width="100%" height="240" src="https://hosting.com/path/GrooveDisplay.html?Div=16&Title=Example..." frameborder="0" ></iframe>
// function fillInEmbedURLInFullURLPopup(fullURL, cssIdOfTextFieldToFill) {
//     // document.getElementById("shortenerCheckbox").checked = false;  // uncheck shortenerCheckbox, because it is not compatible
//     // document.getElementById("embedCodeCheckbox").checked = true;  // this will be true if isn't already

//     var embedText = '<iframe width="100%" height="240" src="' + fullURL + '" frameborder="0" ></iframe>	';

//     var textField = document.getElementById(cssIdOfTextFieldToFill);
//     textField.value = embedText;

//     // select the URL for copy/paste
//     textField.focus();
//     textField.select();
// }


// function embedCodeCheckboxChanged() {
//     if (document.getElementById("embedCodeCheckbox").checked) {
//         fillInEmbedURLInFullURLPopup(editor.get_FullURLForPage("display"), 'fullURLPopupTextField');
//     } else {
//         fillInShortenedURLInFullURLPopup(editor.get_FullURLForPage(), 'fullURLPopupTextField');
//     }
// };
