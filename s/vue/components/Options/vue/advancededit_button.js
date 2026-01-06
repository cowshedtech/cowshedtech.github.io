export default {
    inject: ['options'],

    computed: {
        isAdvancedEdit() {
            return !!this.options.advancedEditIsOn;
        }
    },

    methods: {
        handleAdvancedClick() {
            let newMode = !this.options.advancedEditIsOn;
            this.options.setAdvancedEdit(newMode);            
        },
    },

    template: `
        <span 
            v-if="isTouchDevice" 
            class="left-button" 
            :class="{ buttonSelected: isAdvancedEdit }"
            id="advancedEditAnchor" 
            @click.stop.prevent="handleAdvancedClick">
            <span class="left-button-content">Advanced Edit</span>
        </span>
  `
}