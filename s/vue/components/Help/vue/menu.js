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
      type: Number
    },
    y: {
      type: Number
    }
  },

  methods: {
    /**
     * Handles clicks on help menu items. Opens help/about pages in new windows or triggers undo/redo actions.
     * 
     * @param {string} help_type - The type of help action to perform:
     *   - 'help' - Opens the help documentation
     *   - 'about' - Opens the about page
     *   - 'undo' - Triggers the undo command
     *   - 'redo' - Triggers the redo command
     * @requires Functions:
     * - undoCommand - Function to handle undo operations
     * - redoCommand - Function to handle redo operations
     */
    handleMenuClick(help_type) {
        const HELP_ACTIONS = {
          help: () => this.openHelpWindow('./content/gscribe_help.html'),
          about: () => this.openHelpWindow('./content/gscribe_about.html'),
          undo: undoCommand,
          redo: redoCommand
      };

      const action = HELP_ACTIONS[help_type];
      if (!action) {
          console.warn(`Invalid help type: ${help_type}`);
          return;
      }

      action();
    },


    /**
    * Helper function to open a help window in a new tab and focus it
    * @param {string} url - The URL to open
    */
    openHelpWindow(url) {
      const win = window.open(url, '_blank');
      if (win) win.focus();
    }

  },

  template: `
	<span class="noteContextMenuNew"v-if="isOpen" style="position: absolute; z-index: 9999; display: block"  :style="{ top: y + 'px', left: x + 'px' }">
		<ul id="helpContextMenu" class="list">
			<li
				v-for="item in menuItems"
				:key="item.action"
				@click.stop.prevent="handleMenuClick(item.action)"
			>
				{{ item.label }}
			</li>
		</ul>
	</span>
`
}