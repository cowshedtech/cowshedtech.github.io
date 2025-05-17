export default {
    data() {
        return {
            isViewMode : options ? options.isViewMode() : true,
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

    methods: {        
    },

    template: `
        <span 
            v-if="isViewMode === false" 
            class="left-button" 
            id="undoButton" 
            onclick="undoCommand();">
            <span class="left-button-content"><i class="fa fa-undo"></i>&nbsp;&nbsp;Undo</span>
        </span>
  `
}