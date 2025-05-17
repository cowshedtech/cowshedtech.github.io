export default {
    data() {
        return {
            isViewMode : options ? options.isViewMode() : true            
        }
    },
    
    mounted() {
        this.removeHandler = eventBus.$on('options-updated', () => {
            this.isViewMode = options.isViewMode();     
        });
    },

    beforeUnmount() {
        if (this.removeHandler) this.removeHandler() 
    },

    template: `
        <span v-if="isViewMode === false">
            <slot></slot>
        </span>
        `
}