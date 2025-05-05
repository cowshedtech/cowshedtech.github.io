export default {
  name: 'BaseContextMenu',

  props: {
    isOpen: {
        type: Boolean,
        default: false
    },
    x: {
        type: Number
    },
    y: {
        type: Number
    }
  },

  created() {
    // Listen for close-all event
    eventBus.$on('close-all-menus', () => {
      if (this.isOpen) this.$emit('close');      
    });
  },

  beforeDestroy() {
    // Clean up event listener
    eventBus.$off('close-all-menus');
  },

  template: `
    <span 
        class="noteContextMenuNew" 
        v-if="isOpen" 
        style="position: absolute; z-index: 9999; display: block" 
        :style="{ top: y + 'px', left: x + 'px' }">
        <slot></slot>      
    </span>
  `
}