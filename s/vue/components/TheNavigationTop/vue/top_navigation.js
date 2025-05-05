import MetronomeNavigation from '../../Metronome/vue/menu_main.js'
import RightNavigation from '../../TheNavigationTop/vue/top_right_navigation.js'

export default {
    props: {
        midiPlayer: {
            type: Object,
            required: true
        },
        eventBus: {
            type: Object,
            required: true
        }
    },
    data() {
      return { }
    },
    components: {
        MetronomeNavigation,
        RightNavigation
    },
    template: `
    <div id="TopNav" class="fullWidthEle">
        <span id="logoTextUpperLeft"><img src="images/GScribe_Logo_word_stack.svg"></span>
        <span id="upperLeft">
            <span id="metronomeContainer">
                <MetronomeNavigation
                    :midiPlayer="midiPlayer"
                    :eventBus="eventBus">
                </MetronomeNavigation>                
            </span>
        </span>
        <RightNavigation></RightNavigation>
    </div>    
  `
}