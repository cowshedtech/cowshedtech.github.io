import RightHandContent from './components/right_hand_content.js'
import LeftNavigation from './components/left_navigation.js'
import TopNavigation from './components/top_navigation.js'
import ContextMenus from './components/context_menus.js'
import MetronomeMenu from './components/metronome_menu.js'

export default {
  data() {
    return {}
  },
  components: {
    RightHandContent, ContextMenus, MetronomeMenu, LeftNavigation, TopNavigation
  },
  template: `
    <div class="nonPrintable">
			<LeftNavigation></LeftNavigation>		
      <TopNavigation></TopNavigation>		
      <div id="midiPlayer" class="fullWidthEle"><!-- space for the midiplayer to be attached by the javascript --></div>
    </div>			
    <RightHandContent></RightHandContent>		
    <MetronomeMenu></MetronomeMenu>
	  <ContextMenus></ContextMenus>	
    <div id="grooveListWrapper">
		  <script>
			  document.write(grooves.getGroovesAsHTML());
		  </script>
	  </div>
	`
  }
