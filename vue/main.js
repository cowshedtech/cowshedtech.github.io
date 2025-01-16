import RightHandContent from './components/right_hand_content.js'
import ContextMenus from './components/context_menus.js'
import MetronomeMenu from './components/metronome_menu.js'

export default {
  data() {
    return {}
  },
  components: {
    RightHandContent, ContextMenus, MetronomeMenu
  },
  template: `
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
