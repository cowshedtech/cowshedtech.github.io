import ContextMenu from '../../BaseContextMenu/vue/base_context_menu.js'
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
        ContextMenu, Menu
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
            // Emit event to close all other menus
            if (!this.isPopupOpen) {
                eventBus.$emit('close-all-menus');
                this.isPopupOpen = true;
            } else {
                this.isPopupOpen = false;
            } 
        },

        handleClick(event) {
            if (!this.isEnabled) return
            this.toggleMenu();
            this.menuX = event.clientX - 90;
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
        <span key="permutationAnchor"
            id="permutationAnchor"
            class="rightButtons grooveDB_hidden"
            :class="{ enabled: isEnabled }"
            @click.stop.prevent="handleClick">
            <i class="fa fa-bars"></i> Permutations
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