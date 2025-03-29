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
            this.isPopupOpen = !this.isPopupOpen;
        },

        handleClick(event) {
            this.toggleMenu();
            this.menuX = event.clientX;
            this.menuY = event.clientY;
        }
    },

    template: `
        <span key="optionsAnchor"
            id="optionsAnchor"
            class="rightButtons"
            @click="handleClick">
            <i class="fa fa-bars"></i>Options
        </span><Menu :is-open="isPopupOpen" :x="menuX" :y="menuY"></Menu>
        `
}