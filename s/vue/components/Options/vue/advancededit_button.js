export default {
    data() {
        return {
            isAdvancedEdit : this.options ? this.options.isAdvancedEdit() : false,            
        }
    },

    inject: ['options'],

    mounted() {
        this.removeHandler = eventBus.$on('options-updated', () => {
            this.isAdvancedEdit = this.options.isAdvancedEdit()
        });	
    },

    beforeUnmount() {
        if (this.removeHandler) this.removeHandler() 
    },

    methods: {
        handleAdvancedClick() {
            let newMode = !this.options.isAdvancedEdit();
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