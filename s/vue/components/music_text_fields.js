export default {
  data() {
    return { }
  },
  props: { },
  template: `
    <div id="sheetMusicTextFields" class="fullWidthEle grooveDB_hidden edit-block">
      <span class="sheetMusicTextField"><b>Title:</b> <input class="sheetMusicInputField" id="tuneTitle" onchange="myGrooveWriter.refresh_ABC();" type="text"></span>
      <span class="sheetMusicTextField"><b>Author:</b> <input class="sheetMusicInputField" id="tuneAuthor" onchange="myGrooveWriter.refresh_ABC();"  type="text"></span>
      <span class="sheetMusicTextField"><b>Comment:</b> <input class="sheetMusicInputField" id="tuneComments" onchange="myGrooveWriter.refresh_ABC();"  type="text"></span>
      <span id='KeyButton'><input type="checkbox" class="hiddenCheckbox" id="showLegend" onclick="myGrooveWriter.refresh_ABC();"><label id="LegendLabel" for="showLegend"><i class="fa fa-key"></i></label></span>
    </div>`
}