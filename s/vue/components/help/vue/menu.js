export default {
  emits: ['menu-action'],

  data() {
    return {
      menuItems: [
        { action: 'undo', label: 'Undo (Ctrl-Z)' },
        { action: 'redo', label: 'Redo (Ctrl-Y)' },
        { action: 'help', label: 'Help' },
        { action: 'about', label: 'About' }
      ]
    }
  },

  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    x: {
      type: String
    },
    y: {
      type: String
    }
  },

  methods: {
    handleMenuClick(action) {
      helpMenuPopupClick(action);
    }
  },

  template: `
	<span class="noteContextMenuNew"v-if="isOpen" :style="{ top: y + 'px', left: x + 'px' }">
		<ul id="helpContextMenu" class="list">
			<li
				v-for="item in menuItems"
				:key="item.action"
				@click="handleMenuClick(item.action)"
			>
				{{ item.label }}
			</li>
		</ul>
	</span>
`
}