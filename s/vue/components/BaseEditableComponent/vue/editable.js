export default {
    inject: ['options'],

    computed: {
        isViewMode() {
            return !!this.options.viewMode;
        }
    },

    template: `
        <span v-if="isViewMode === false">
            <slot></slot>
        </span>
        `
}