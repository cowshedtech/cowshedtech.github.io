import BottomNavigationButton from '../../BaseButtonNavigationButton/vue/base_button_bottom_navigation.js'

export default {
    data() {
        return {
            isViewMode : options ? options.isViewMode() : true            
        }
    },
    
    components: {
        BottomNavigationButton
    },

    methods: {
        handleClick(event) {
            editor.track.clearAllNotes();
        }
    },

    mounted() {
        eventBus.$on('options-updated', () => {
            this.isViewMode = options.isViewMode();     
        });
    },

    beforeUnmount() {
        eventBus.$off('options-updated');
    },

    template: `
        <BottomNavigationButton v-if="isViewMode === false" button-id="clearAllNotesButton" button-text="CLEAR ALL" @click.stop.prevent="handleClick">
            <i class="fa fa-trash fa-2x"></i>
        </BottomNavigationButton>
        `
}