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