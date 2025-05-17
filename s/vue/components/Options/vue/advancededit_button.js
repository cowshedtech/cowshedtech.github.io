export default {
    data() {
        return {
            isAdvancedEdit : options ? options.isAdvancedEdit() : false,            
        }
    },

    mounted() {
        this.removeHandler = eventBus.$on('options-updated', () => {
            this.isAdvancedEdit = options.isAdvancedEdit()
        });	
    },

    beforeUnmount() {
        if (this.removeHandler) this.removeHandler() 
    },

    methods: {
        handleAdvancedClick() {
            let newMode = !options.isAdvancedEdit();
            options.setAdvancedEdit(newMode);            
        },
    },

    template: `
        <span 
            v-if="isTouchDevice && isViewMode === false" 
            class="left-button" 
            :class="{ buttonSelected: isAdvancedEdit }"
            id="advancedEditAnchor" 
            @click.stop.prevent="handleAdvancedClick">
            <span class="left-button-content">Advanced Edit</span>
        </span>
  `
}