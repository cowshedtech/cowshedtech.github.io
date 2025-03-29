export default {
    methods: {
        handleClick(event) {
            permutationAnchorClick(event)
            // this.toggleMenu();
            // this.menuX = event.clientX;
            // this.menuY = event.clientY;
        }
    },

    template: `
        <span key="permutationAnchor"
            id="permutationAnchor"
            class="rightButtons grooveDB_hidden"
            @click="handleClick">
            <i class="fa fa-bars"></i>Permutations
        </span>
        `
}