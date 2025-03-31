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
        <span key="permutationAnchor"
            id="permutationAnchor"
            class="rightButtons grooveDB_hidden"
            @click="handleClick">
            <i class="fa fa-bars"></i>Permutations
        </span><Menu :is-open="isPopupOpen" :x="menuX" :y="menuY"></Menu>
        `
}