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
            clearAllNotes();
        }
    },

    mounted() {
        this.removeOptionsHandler = options?.addChangeHandler(() => {
            this.isViewMode = options.isViewMode();     
        })
    },

    beforeUnmount() {
        if (this.removeOptionsHandler) this.removeOptionsHandler() 
    },

    template: `
        <BottomNavigationButton v-if="isViewMode === false" button-id="clearAllNotesButton" button-text="CLEAR ALL" @click="handleClick">
            <i class="fa fa-trash fa-2x"></i>
        </BottomNavigationButton>
        `
}