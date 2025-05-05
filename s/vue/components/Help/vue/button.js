import ContextMenu from '../../BaseContextMenu/vue/base_context_menu.js'
import Menu from './menu.js'

export default {
    data() {
        return {
            isPopupOpen: false,
            menuX: 0,
            menuY: 0,
        }
    },

    components: {
        ContextMenu, Menu
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
            this.menuX = event.clientX - 90;
            this.menuY = event.clientY;
        },

        closeMenu() {
            this.isPopupOpen = false;
        },
    },

    template: `
        <span key="helpAnchor"
            id="helpAnchor"
            class="rightButtons"
            @click.stop.prevent="handleClick">
            <i class="fa fa-bars"></i> Help
        </span>
        <ContextMenu 
            :is-open="isPopupOpen" 
            :x="menuX" 
            :y="menuY" 
            @close="closeMenu">
            <Menu></Menu>
        </ContextMenu>
        `
}