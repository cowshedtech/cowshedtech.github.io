import BottomNavigationButton from '../../BaseButtonNavigationButton/vue/base_button_bottom_navigation.js'
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
    BottomNavigationButton, Menu
  },

  methods: {
    handleDownloadClick(event) {
      this.menuX = event.clientX - 90;
      this.menuY = event.clientY;
      this.isPopupOpen = !this.isPopupOpen
    }    
  },

  template: `
    <BottomNavigationButton
      button-class="grooveDB_hidden pageBottomButton"
      button-id="downloadButton"
      button-text="DOWNLOAD"
      @click="handleDownloadClick"
    >
      <span class="bottomButtonIcon">
        <i class="fa fa-download fa-2x"></i>
      </span>
      <Menu
        :is-open="isPopupOpen" 
        :x="menuX" 
        :y="menuY">
      </Menu>
    </BottomNavigationButton>
  `
}