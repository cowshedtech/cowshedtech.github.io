import BottomNavigationButton from '../../BaseButtonNavigationButton/vue/base_button_bottom_navigation.js'
import Menu from './popup.js'

export default {
  name: 'ShareButton',

  components: {
    BottomNavigationButton, Menu
  },

  data() {
    return {
      isPopupOpen: false,
      popupLeft: 300,
      popupTop: 250
    }
  },

  methods: {
    toggleMenu() {
      this.isPopupOpen = !this.isPopupOpen;
    },

    closeMenu() {
      this.isPopupOpen = false;
    },

    /**
     * Handles the share button click
     * @param {MouseEvent} event - The click event
     */
    handleClick(event) {
      // position near the click (viewport coords, matches fixed-position popup)
      if (event && typeof event.clientX === 'number' && typeof event.clientY === 'number') {
        this.popupLeft = event.clientX;
        this.popupTop = event.clientY;
      }
      this.toggleMenu();
    }
  },

  template: `
    <BottomNavigationButton
      button-class="grooveDB_hidden shareSaveButton"
      button-id="shareButton"
      button-text="SHARE"
      @click.stop.prevent="handleClick"
    >
      <i class="fa fa-share fa-2x"></i>      
    </BottomNavigationButton>
    <Menu :is-open="isPopupOpen" :left="popupLeft" :top="popupTop" @close-clicked="closeMenu"></Menu>
  `
}

