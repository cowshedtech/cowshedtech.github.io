import MetronomeNavigation from '../metronome/vue/menu_main.js'
import RightNavigation from './right_navigation.js'

export default {
    data() {
      return { }
    },
    props: { },
    components: {
        MetronomeNavigation,
        RightNavigation
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
        <RightNavigation></RightNavigation>
    </div>    
  `
  }