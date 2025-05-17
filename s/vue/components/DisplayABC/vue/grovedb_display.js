export default {
  data() {
    return {
        isDebugMode : options ? options.debugMode : false,
        browserInfo : getBrowserInfo()
    }
  },

  mounted() {
    this.removeHandler = eventBus.$on('options-updated', () => {
      this.isDebugMode = options.debugMode;             
    });
  },

  beforeUnmount() {
    if (this.removeHandler) this.removeHandler() 
  },  

  template: `
  <div id="debugDisplayArea">
    <span id="undoStack"></span>
    <span id="redoStack"></span>
    <span id="URLSearchData"></span>
    <!-- ABC notation -->
    <a href="" id="showHideABC" onclick="event.preventDefault(); myGrooveWriter.ShowHideABCResults();">Show/Hide ABC Notation</a>

    <div id="ABC_Results">
        ABC Notation is used for rendering the music.  You can see what is being generated below.
        You can even edit it.  <br>
        NOTE: whenever the page is modified, the ABC Notation below will be overwritten automatically. <br>
        For more information about ABC Notation go here: <a href="http://abcnotation.com/">http://abcnotation.com/</a>
        <p></p>
        <textarea id="ABCsource" rows="10" cols="72" ></textarea>
        <br>
        <button type="button" onclick="update();">Re-render the music</button>
        <button type="button" onclick="myGrooveWriter.saveABCtoFile();">Save ABC to file</button>
    </div>
    <span v-if="isDebugMode === true" id="debugOutput">
      <div>This browser has been detected as: {{ browserInfo.browser }} ver: {{ browserInfo.version }} <br> {{ browserInfo.uastring }} <br> Running on: {{ browserInfo.platform }}</div>
    </span>
    </div>
`
}