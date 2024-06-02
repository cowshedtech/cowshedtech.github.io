export default {
  data() {
    return { }
  },
  props: { },
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
        <button type="button" onclick="myGrooveWriter.displayNewSVG();">Re-render the music</button>
        <button type="button" onclick="myGrooveWriter.saveABCtoFile();">Save ABC to file</button>
    </div>
    <span id="debugOutput"></span>
    </div>
`
}