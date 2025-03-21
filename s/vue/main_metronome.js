import TopNavigation from './components/navigation/top_navigation.js'
import MetronomeMenu from './components/metronome_menu.js'

export default {
  data() {
    return {}
  },
  components: {
    MetronomeMenu, TopNavigation
  },
  template: `
      <TopNavigation></TopNavigation>		          
      <MetronomeMenu></MetronomeMenu>	  
	`
  }
