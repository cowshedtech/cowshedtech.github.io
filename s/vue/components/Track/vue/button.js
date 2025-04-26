import Menu from './menu.js'
import eventBus from '../../../eventBus.js'

export default {
    data() {
        return {
            isPopupOpen: false,
            menuX: 0,
            menuY: 0,
        }
    },

    components: {
        Menu
    },

    methods: {
        toggleMenu() {
            if (!this.isPopupOpen) {
                eventBus.$emit('close-all-menus');
                this.isPopupOpen = true;
            } else {
                this.isPopupOpen = false;
            }
        },

        handleClick(event) {
            this.toggleMenu();
            this.menuX = event.clientX;
            this.menuY = event.clientY;
        },
        closeMenu() {
            this.isPopupOpen = false;
        },
    },

    created() {
        // Listen for close-all event
        eventBus.$on('close-all-menus', () => {
            if (this.isPopupOpen) {
                this.isPopupOpen = false;
            }
        });
    },

    beforeDestroy() {
        // Clean up event listener
        eventBus.$off('close-all-menus');
    },

    template: `
        <span key="trackAnchor"
            id="trackAnchor"
            class="rightButtons"
            @click="handleClick">
            <i class="fa fa-bars"></i> Track
        </span>
        <Menu 
            :is-open="isPopupOpen" 
            :x="menuX" 
            :y="menuY" 
            @close="closeMenu">
        </Menu>
        `
}