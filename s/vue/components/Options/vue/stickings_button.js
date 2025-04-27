import BottomNavigationButton from '../../BaseButtonNavigationButton/vue/base_button_bottom_navigation.js'

export default {
    components: {
        BottomNavigationButton
    },

    methods: {
        handleClick(event) {
            options.setStickingVisible(!options.isStickingVisible())             
        }
    },

    template: `
    <BottomNavigationButton 
        button-class=" grooveDB_hidden pageBottomButton" 
        button-id="stickingsButton" 
        button-text="STICKINGS" 
        @click.stop.prevent="handleClick">
    </BottomNavigationButton>
    `
}