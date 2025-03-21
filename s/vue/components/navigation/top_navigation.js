import MetronomeNavigation from './metronome_navigation_new.js'

export default {
    data() {
      return { }
    },
    props: { },
    components: {
        MetronomeNavigation
    },
    template: `
    <div id="TopNav" class="fullWidthEle">
        <span id="logoTextUpperLeft"><img src="images/GScribe_Logo_word_stack.svg"></span>
        <span id="upperLeft">
            <span id="metronomeContainer">
                <MetronomeNavigation></MetronomeNavigation>
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