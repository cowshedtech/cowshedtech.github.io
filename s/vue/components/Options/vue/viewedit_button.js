export default {
    data() {
        return {
            isViewMode : options ? options.isViewMode() : true, 
            isDBAuthoring : options ? options.grooveDBAuthoring : true
        }
    },

    mounted() {
        this.removeHandler = eventBus.$on('options-updated', () => {
            this.isDBAuthoring = options.grooveDBAuthoring;
            this.isViewMode = options.isViewMode();                 
        });	
    },

    beforeUnmount() {
        if (this.removeHandler) this.removeHandler() 
    },

    methods: {
        handleViewEditClick(event) {
            let newMode = !options.isViewMode();
            options.setViewMode(newMode);
        },        
    },

    template: `
    <span v-if="isDBAuthoring == false" class="left-button" @click.stop.prevent="handleViewEditClick" >
        <span class="left-button-content">
            <span id="view-edit-switch">Switch to {{ isViewMode === false ? 'VIEW' : 'EDIT' }} mode</span>
        </span>
    </span>    
  `
}