export default {
    data() {
      return { }
    },
    props: { },
    template: `
    <div id="LeftHandNav">
        <span id="divisionButtonContainer">
            <span id="logoInSubdivision" class="left-button-content"><img src="images/GScribe_Logo_lone_g.svg"></span>
            <span class="left-button edit-block" id="timeLabel" onclick="myGrooveWriter.timeSigPopupOpen();"><span class="left-button-content"><span><span id="timeSigLabel" class="buttonFraction"><sup>4</sup>/<sub>4</sub></span><span id="timeSubLabel">TIME</span></span></span></span>
            <span class="left-button subdivision edit-block" id="subdivision_8ths"  onclick="myGrooveWriter.changeDivision(8);"><span class="left-button-content"><span><span class="buttonFraction"><sup>1</sup>/<sub>8</sub></span>NOTES</span></span></span>
            <span class="left-button subdivision edit-block" id="subdivision_16ths" onclick="myGrooveWriter.changeDivision(16);"><span class="left-button-content"><span><span class="buttonFraction"><sup>1</sup>/<sub>16</sub></span>NOTES</span></span></span>
            <span class="left-button subdivision edit-block" id="subdivision_32ths" onclick="myGrooveWriter.changeDivision(32);"><span class="left-button-content"><span><span class="buttonFraction"><sup>1</sup>/<sub>32</sub></span>NOTES</span></span></span>
            <span class="left-button subdivision edit-block" id="subdivision_12ths" onclick="myGrooveWriter.changeDivision(12);"><span class="left-button-content"><span><span class="buttonFraction"><sup>1</sup>/<sub>8</sub></span>TRIPLETS</span></span></span>
            <span class="left-button subdivision edit-block" id="subdivision_24ths" onclick="myGrooveWriter.changeDivision(24);"><span class="left-button-content"><span><span class="buttonFraction"><sup>1</sup>/<sub>16</sub></span>TRIPLETS</span></span></span>
            <span class="left-button subdivision edit-block" id="subdivision_48ths" onclick="myGrooveWriter.changeDivision(48);"><span class="left-button-content"><span>MIXED<br>Division</span></span></span>

            <script>
                if (!myGrooveWriter.myGrooveUtils.grooveDBAuthoring) {
                    document.write('<span class="left-button" onclick="myGrooveWriter.swapViewEditMode();"><span class="left-button-content"><span id="view-edit-switch" >Switch to EDIT mode</span></span></span>');
                }
            </script>

            <script>
                if (myGrooveWriter.myGrooveUtils.is_touch_device()) {
                    document.write('<span class="left-button edit-block" id="advancedEditAnchor" onclick="event.preventDefault(); myGrooveWriter.toggleAdvancedEdit()"><span class="left-button-content">Advanced Edit</span></span>');
                }
            </script>

            <span class="left-button edit-block" id="undoButton" onclick="myGrooveWriter.undoCommand();"><span class="left-button-content"><i class="fa fa-undo"></i>&nbsp;&nbsp;Undo</span></span>
        </span>

    </div>
  `
  }