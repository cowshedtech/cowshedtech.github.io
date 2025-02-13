import RightHandContent from './components/right_hand_content.js'
import LeftNavigation from './components/navigation/left_navigation.js'
import TopNavigation from './components/navigation/top_navigation.js'
import ContextMenus from './components/context_menus/context_menus.js'
import MetronomeMenu from './components/metronome_menu.js'
import MidiPlayer from './components/midi_player.js'

export default {
  data() {
    return {}
  },
  components: {
    RightHandContent, ContextMenus, MetronomeMenu, LeftNavigation, TopNavigation, MidiPlayer
  },
  template: `
    <div class="nonPrintable">
			<LeftNavigation></LeftNavigation>		
      <TopNavigation></TopNavigation>		      
      <MidiPlayer></MidiPlayer>
    </div>			
    <RightHandContent></RightHandContent>		
    <MetronomeMenu></MetronomeMenu>
	  <ContextMenus></ContextMenus>       
	`
  }
