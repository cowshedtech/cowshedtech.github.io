import Menu from './menu.js'

export default {
    props: {
        track: {
          type: Object,
          required: true
        }
      },
      
      data() {
        return {
            isEnabled: editor.track.numBeats == 4 && editor.track.noteValue == 4,
            isPopupOpen: false,
            menuX: 0,
            menuY: 0,
        }
    },
    
    components: {
        Menu
    },

    watch: { 
        track: {
            handler(newVal, oldVal) { 
                this.isEnabled = editor.track.numBeats == 4 && editor.track.noteValue == 4
            },
            deep: true
        }    
    },

    methods: {
        toggleMenu() {
            this.isPopupOpen = !this.isPopupOpen;
        },

        handleClick(event) {
            if (!this.isEnabled) return
            this.toggleMenu();
            this.menuX = event.clientX;
            this.menuY = event.clientY;
        }
    },

    template: `
        <span key="permutationAnchor"
            id="permutationAnchor"
            class="rightButtons grooveDB_hidden"
            :class="{ enabled: isEnabled }"
            @click="handleClick">
            <i class="fa fa-bars"></i>Permutations
        </span><Menu :is-open="isPopupOpen" :x="menuX" :y="menuY"></Menu>
        `
}