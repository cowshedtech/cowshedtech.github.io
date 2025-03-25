import RightHandContent from './components/right_hand_content.js'
import TimeSignature from './components/time_signature/vue/picker.js'
import TopNavigation from './components/navigation/top_navigation.js'
import ContextMenus from './components/context_menus/context_menus.js'
import MetronomeOptionsMenu from './components/metronome/vue/menu_options.js'
import MetronomeOptionsOffsetClickMenu from './components/metronome/vue/menu_options_offset_click.js'
import MetronomeOptionsSpeedMenu from './components/metronome/vue/menu_options_speed.js'
import MidiPlayer from './components/player/vue/controls.js'

export default {
  data() {
    return {}
  },
  components: {
    RightHandContent, ContextMenus, MetronomeOptionsMenu, MetronomeOptionsOffsetClickMenu, MetronomeOptionsSpeedMenu, TimeSignature, TopNavigation, MidiPlayer
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
	  <ContextMenus></ContextMenus>       
	`
  }
