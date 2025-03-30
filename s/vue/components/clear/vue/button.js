import BottomNavigationButton from '../../BaseButtonNavigationButton/vue/base_button_bottom_navigation.js'

export default {
    components: {
        BottomNavigationButton
    },

    methods: {
        handleClick(event) {
            console.log(`here`)
            clearAllNotes();
        }
    },

    template: `
        <BottomNavigationButton button-id="clearAllNotesButton" button-text="CLEAR ALL" @click="handleClick">
            <i class="fa fa-trash fa-2x"></i>
        </BottomNavigationButton>
        `
}