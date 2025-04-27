import BottomNavigationButton from '../../BaseButtonNavigationButton/vue/base_button_bottom_navigation.js'
import Menu from './popup.js'

export default {
  name: 'ShareButton',

  components: {
    BottomNavigationButton, Menu
  },

  data() {
    return {
      isPopupOpen: false
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
    <Menu :is-open="isPopupOpen" @close-clicked="closeMenu"></Menu>
  `
}

