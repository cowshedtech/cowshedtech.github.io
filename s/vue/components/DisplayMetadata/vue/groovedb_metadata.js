export default {
  data() {
    return { }
  },
  props: { },
  template: `
    <!-- GrooveDB output area -->
    <div id="GrooveDB_MetaData" class="grooveDB_show" style="display:none;">
        <div id="grooveDBInstructions">
        This is the text that should be added to the GrooveDB for this groove.  <br>
        <b>Copy and paste it into the GrooveDB edit window </b>
        </div>
        <div>
        <textarea id="GrooveDB_source" class="fullWidthEle"></textarea>
        </div>
    </div>
`
}