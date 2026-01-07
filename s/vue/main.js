import RightHandContent from './components/TheContentRightHand/vue/right_hand_content.js'
import TimeSignature from './components/SignatureTime/vue/picker.js'
import LeftNavigation from './components/TheNavigationLeft/vue/navigation.js'
import TopNavigation from './components/TheNavigationTop/vue/top_navigation.js'
import MidiPlayer from './components/Player/vue/controls.js'
import UrlSync from './components/UrlSync/vue/url_sync.js'

const KEYS = {
  Z: 'Z',
  Y: 'Y'
};

export default {
  props: {
    midiPlayer: {
      type: Object,
      required: true
    },
    eventBus: {
      type: Object,
      required: true
    },
    track: {
      type: Object,
      required: false
    }
  },

  mounted() {
    document.addEventListener('keydown', this.handleKeyDown);   
    document.addEventListener('click', this.handleClickOutside);
  },

  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);          
    document.removeEventListener('click', this.handleClickOutside);
  },

  methods: {
    handleKeyDown(event) {
      if (event.target.type == "range" || (event.target.tagName.toUpperCase() != "INPUT" && event.target.tagName.toUpperCase() != "TEXTAREA")) {       
        switch (event.code) {
          case KEYS.Z:
            if (e.ctrlKey) {
							root.undoCommand();
							return false;
						}
            break;
          case KEYS.Y:
            if (e.ctrlKey) {
							root.redoCommand();
							return false;
						}
						break;
        }
      }
      return true;
    },

    handleClickOutside(event){
      this.eventBus.$emit('close-all-menus');
		}
  },
  
  components: {
    LeftNavigation, RightHandContent, TimeSignature, TopNavigation, MidiPlayer, UrlSync
  },
  
  template: `
    <div class="nonPrintable">
			<LeftNavigation></LeftNavigation>
      <TopNavigation
        :midiPlayer="midiPlayer"
        :eventBus="eventBus">
      </TopNavigation>		      
      <MidiPlayer></MidiPlayer>
    </div>			
    <RightHandContent :track="track"></RightHandContent>
    <UrlSync></UrlSync>		    
	`
}