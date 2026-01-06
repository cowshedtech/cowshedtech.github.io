export default {
    data() {
        return {
            isViewMode : this.options ? this.options.isViewMode() : true, 
            isDBAuthoring : this.options ? this.options.grooveDBAuthoring : true
        }
    },

    inject: ['options'],

    mounted() {
        this.removeHandler = eventBus.$on('options-updated', () => {
            this.isDBAuthoring = this.options.grooveDBAuthoring;
            this.isViewMode = this.options.isViewMode();                 
        });	
    },

    beforeUnmount() {
        if (this.removeHandler) this.removeHandler() 
    },

    methods: {
        handleViewEditClick(event) {
            let newMode = !this.options.isViewMode();
            this.options.setViewMode(newMode);
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