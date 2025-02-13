export default {
    data() {
      return { }
    },
    props: { },
    template: `
    <div id="TopNav" class="fullWidthEle">
        <span id="logoTextUpperLeft"><img src="images/GScribe_Logo_word_stack.svg"></span>
        <span id="upperLeft">
            <span id="metronomeContainer">
                <span id="metronomeLabel"> METRONOME:</span>
                <span class="metronomeButton" id="metronomeOff" onclick="myGrooveWriter.setMetronomeFrequency(0);">OFF</span>
                <span class="metronomeButton" id="metronome4ths" onclick="myGrooveWriter.setMetronomeFrequency(4);">4th</span>
                <span class="metronomeButton" id="metronome8ths" onclick="myGrooveWriter.setMetronomeFrequency(8);">8th</span>
                <span class="metronomeButton" id="metronome16ths" onclick="myGrooveWriter.setMetronomeFrequency(16);">16th</span>
                <span class="metronomeButton Options grooveDB_hidden" id="metronomeOptionsAnchor" onclick="myGrooveWriter.metronomeOptionsAnchorClick(event);">Options</span>
                <a id="linkGrooveScribe" href="https://www.mikeslessons.com/groove/"><span id="metronomeLabel">&nbsp;&nbsp;&nbsp;&nbsp;(GrooveScribe Link)</span></a>
            </span>
        </span>
        <span id="upperRight">
            <span class="rightButtons grooveDB_hidden" id="permutationAnchor" onclick="myGrooveWriter.permutationAnchorClick(event);"><i class="fa fa-bars"></i> Permutations</span>
            <span class="rightButtons" id="groovesAnchor" onclick="myGrooveWriter.groovesAnchorClick(event);"><i class="fa fa-bars"></i> Grooves</span>
            <span class="rightButtons" id="helpAnchor" onclick="myGrooveWriter.helpAnchorClick(event);"><i class="fa fa-bars"></i> Help</span>
        </span>
    </div>    
  `
  }