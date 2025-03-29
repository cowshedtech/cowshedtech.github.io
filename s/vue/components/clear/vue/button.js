import BottomNavigationButton from '../../navigation/bottom_navigation_button.js'

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