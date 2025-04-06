import BottomNavigationButton from '../../BaseButtonNavigationButton/vue/base_button_bottom_navigation.js'

import Menu from "./stickings_menu.js"

export default {
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
        toggleMenu() {
            this.isPopupOpen = !this.isPopupOpen;
        },

        closeMenu() {
            this.isPopupOpen = false;
        },

        handleClick(event) {
            this.toggleMenu();
            this.menuX = event.clientX;
            this.menuY = event.clientY;
        }
    },

    template: `
    <BottomNavigationButton 
        button-class=" grooveDB_hidden pageBottomButton" 
        button-id="stickingsButton" 
        button-text="STICKINGS" 
        @click="handleClick">
    </BottomNavigationButton>
    <Menu 
        :is-open="isPopupOpen" 
        :x="menuX" 
        :y="menuY"
        @close="closeMenu">
    </Menu>`
}