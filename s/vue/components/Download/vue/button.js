import BottomNavigationButton from '../../BaseButtonNavigationButton/vue/base_button_bottom_navigation.js'
import ContextMenu from '../../BaseContextMenu/vue/base_context_menu.js'
import Menu from "./menu.js"

export default {
  name: 'DownloadButton',

  data() {
    return {
      isPopupOpen: false,
      menuX: 0,
      menuY: 0,
    }
  },

  components: {
    BottomNavigationButton, ContextMenu, Menu
  },

  methods: {
    handleDownloadClick(event) {
      this.menuX = event.clientX;
      this.menuY = event.clientY;
      this.isPopupOpen = !this.isPopupOpen
    }    
  },

  template: `
    <BottomNavigationButton
      button-class="grooveDB_hidden pageBottomButton"
      button-id="downloadButton"
      button-text="DOWNLOAD"
      @click.stop.prevent="handleDownloadClick"
    >
      <span class="bottomButtonIcon">
        <i class="fa fa-download fa-2x"></i>
      </span>
      <ContextMenu 
          :is-open="isPopupOpen" 
          :x="menuX" 
          :y="menuY" 
          @close="closeMenu">
          <Menu></Menu>
      </ContextMenu>       
    </BottomNavigationButton>
  `
}