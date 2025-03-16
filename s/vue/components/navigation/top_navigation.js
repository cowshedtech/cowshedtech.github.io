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
                <span class="metronomeButton" id="metronomeOff" onclick="metronome.setFrequency(0);">OFF</span>
                <span class="metronomeButton" id="metronome4ths" onclick="metronome.setFrequency(4);">4th</span>
                <span class="metronomeButton" id="metronome8ths" onclick="metronome.setFrequency(8);">8th</span>
                <span class="metronomeButton" id="metronome16ths" onclick="metronome.setFrequency(16);">16th</span>
                <span class="metronomeButton Options grooveDB_hidden" id="metronomeOptionsAnchor" onclick="metronome.optionsAnchorClick(event);">Options</span>
                <a id="linkGrooveScribe" href="https://www.mikeslessons.com/groove/"><span id="metronomeLabel">&nbsp;&nbsp;&nbsp;&nbsp;(GrooveScribe Link)</span></a>
            </span>
        </span>
        <span id="upperRight">
            
            <span class="rightButtons" id="optionsAnchor" onclick="options.optionsAnchorClick(event);"><i class="fa fa-bars"></i> Options</span>
            <span class="rightButtons grooveDB_hidden" id="permutationAnchor" onclick="permutationAnchorClick(event);"><i class="fa fa-bars"></i> Permutations</span>
            <span class="rightButtons" id="groovesAnchor" onclick="myGrooveWriter.groovesAnchorClick(event);"><i class="fa fa-bars"></i> Grooves</span>
            <span class="rightButtons" id="helpAnchor" onclick="helpAnchorClick(event);"><i class="fa fa-bars"></i> Help</span>
        </span>
    </div>    
  `
  }