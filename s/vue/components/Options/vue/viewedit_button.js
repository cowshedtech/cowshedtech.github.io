export default {
    inject: ['options'],

    computed: {
        isViewMode() {
            return !!this.options.viewMode;
        },
        isDBAuthoring() {
            return !!this.options.grooveDBAuthoring;
        }
    },

    methods: {
        handleViewEditClick(event) {
            this.options.viewMode = !this.options.viewMode;            
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