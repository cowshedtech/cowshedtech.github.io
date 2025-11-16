/**
 * A context menu component that displays at specified coordinates.
 * Ensures the menu stays within viewport bounds and handles keyboard navigation.
 * @component
 */
export default {
  name: 'BaseContextMenu',

  props: {
    isOpen: {
      type: Boolean,
      default: false,
      required: true
    },
    x: {
      type: Number,
      required: true,
      validator: (value) => value >= 0
    },
    y: {
      type: Number,
      required: true,
      validator: (value) => value >= 0
    }
  },

  data() {
    return {
      menuRef: null,
      menuWidth: 0,
      menuHeight: 0,
      isPositioned: false
    }
  },

  computed: {
    menuStyle() {
      if (!this.isPositioned) return {}
      
      const { x, y } = this.getAdjustedPosition()
      return {
        position: 'fixed',
        zIndex: 9999,
        display: 'block',
        top: `${y}px`,
        left: `${x}px`,
        visibility: this.isPositioned ? 'visible' : 'hidden'
      }
    }
  },

  watch: {
    isOpen(newValue) {
      if (newValue) {
        this.$nextTick(() => {
          this.measureMenu()
          this.isPositioned = true
        })
      } else {
        this.isPositioned = false
      }
    }
  },

  mounted() {
    this.setupEventListeners()
  },

  beforeDestroy() {
    this.cleanupEventListeners()
  },

  methods: {
    setupEventListeners() {
      try {
        document.addEventListener('click', this.handleClickOutside)
        document.addEventListener('keydown', this.handleEscapeKey)
        window.addEventListener('resize', this.handleResize)
        eventBus.$on('close-all-menus', this.handleCloseAll)
      } catch (error) {
        console.error('Error setting up event listeners:', error)
        this.cleanupEventListeners()
      }
    },

    cleanupEventListeners() {
      try {
        document.removeEventListener('click', this.handleClickOutside)
        document.removeEventListener('keydown', this.handleEscapeKey)
        window.removeEventListener('resize', this.handleResize)
        eventBus.$off('close-all-menus')
      } catch (error) {
        console.error('Error cleaning up event listeners:', error)
      }
    },

    measureMenu() {
      if (this.menuRef) {
        const rect = this.menuRef.getBoundingClientRect()
        this.menuWidth = rect.width
        this.menuHeight = rect.height
      }
    },

    getAdjustedPosition() {
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      
      let adjustedX = this.x
      let adjustedY = this.y

      // Adjust horizontal position if menu would overflow right edge
      if (adjustedX + this.menuWidth > viewportWidth) {
        adjustedX = viewportWidth - this.menuWidth - 10 // 10px padding
      }

      // Adjust vertical position if menu would overflow bottom edge
      if (adjustedY + this.menuHeight > viewportHeight) {
        adjustedY = viewportHeight - this.menuHeight - 10 // 10px padding
      }

      // Ensure menu doesn't go off-screen to the left or top
      adjustedX = Math.max(10, adjustedX)
      adjustedY = Math.max(10, adjustedY)

      return { x: adjustedX, y: adjustedY }
    },

    handleClickOutside(event) {
      if (this.isOpen && this.menuRef && !this.menuRef.contains(event.target)) {
        this.$emit('close')
      }
    },

    handleEscapeKey(event) {
      if (this.isOpen && event.key === 'Escape') {
        this.$emit('close')
      }
    },

    handleResize() {
      if (this.isOpen) {
        this.measureMenu()
        this.isPositioned = true
      }
    },

    handleCloseAll() {
      if (this.isOpen) {
        this.$emit('close')
      }
    }
  },

  template: `
    <span 
      v-if="isOpen"
      ref="menuRef"
      class="noteContextMenuNew" 
      role="menu"
      aria-label="Context menu"
      tabindex="-1"
      :style="menuStyle"
    >
      <slot></slot>      
    </span>
  `
}