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
        Menu
    },

    methods: {
        toggleMenu() {
            // Emit event to close all other menus
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
        }
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
        <span key="groovesAnchor"
            id="groovesAnchor"
            class="rightButtons"
            @click.stop.prevent="handleClick">
            <i class="fa fa-bars"></i> Grooves
        </span><Menu :is-open="isPopupOpen" :x="menuX" :y="menuY"></Menu>
        `
}