import BottomNavigationButton from '../../BaseButtonNavigationButton/vue/base_button_bottom_navigation.js'

export default {
    components: {
        BottomNavigationButton
    },

    inject: ['options'],

    methods: {
        handleClick(event) {
            this.options.setStickingVisible(!this.options.isStickingVisible())             
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