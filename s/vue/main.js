import RightHandContent from './components/TheContentRightHand/vue/right_hand_content.js'
import TimeSignature from './components/SignatureTime/vue/picker.js'
import TopNavigation from './components/TheNavigationTop/vue/top_navigation.js'
import MetronomeOptionsMenu from './components/metronome/vue/menu_options.js'
import MetronomeOptionsOffsetClickMenu from './components/metronome/vue/menu_options_offset_click.js'
import MetronomeOptionsSpeedMenu from './components/metronome/vue/menu_options_speed.js'
import MidiPlayer from './components/player/vue/controls.js'


export default {
  data() {
    return {}
  },
  components: {
    RightHandContent, MetronomeOptionsMenu, MetronomeOptionsOffsetClickMenu, MetronomeOptionsSpeedMenu, TimeSignature, TopNavigation, MidiPlayer
  },
  template: `
    <div class="nonPrintable">
			<TimeSignature></TimeSignature>		
      <TopNavigation></TopNavigation>		      
      <MidiPlayer></MidiPlayer>
    </div>			
    <RightHandContent></RightHandContent>		
    <MetronomeOptionsMenu></MetronomeOptionsMenu>
    <MetronomeOptionsOffsetClickMenu></MetronomeOptionsOffsetClickMenu>
    <MetronomeOptionsSpeedMenu></MetronomeOptionsSpeedMenu>
	`
  }
