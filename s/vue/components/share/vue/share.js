export default {
  data() {
    return { }
  },
  props: { },
  template: `
	<!-- this is used by the share/save button, and is hidden by default -->
	<div id="fullURLPopup">
		<span id="fullURLPopupCloseButton" onclick="myGrooveWriter.close_FullURLPopup();"><i class="fa fa-lg fa-times-circle"></i></span>
		<div id="fullURLPopupTitle">Share Your Groove</div>
		<div id="fullURLPopupSubTitle">Use this URL to share or save this groove</div>
		<div id="fullURLPopupSubSubTitle">(You can also bookmark this page)</div>
		<div id="fullURLPopupCheckboxes">
			<span><label  id="shortURLLabel" class="fullURLPopupCheckboxLabel"><input type="checkbox" id="shortenerCheckbox" onchange="myGrooveWriter.shortenerCheckboxChanged();">Short URL</label></span>
			<span><label id="embedCodeLabel" class="fullURLPopupCheckboxLabel"><input type="checkbox" id="embedCodeCheckbox" onchange="myGrooveWriter.embedCodeCheckboxChanged();">Embed Code</label></span>
		</div>
		<div id="fullURLPopupTextFieldContainer"><input type="text" id="fullURLPopupTextField"></div>
		<br>
		<div id="shareButtonContainer">
			<button id="fullURLPopupCopyButton" onclick="myGrooveWriter.copyShareURLToClipboard();">&nbsp;<i class="fa fa-copy"></i> &nbsp;COPY&nbsp;</button>
			&nbsp; &nbsp; &nbsp;
			<share-button id="shareButton"></share-button>
		</div>
	</div>
`
}