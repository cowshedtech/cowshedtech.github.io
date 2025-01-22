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
  methods: {
    handleMenuClick(action) {
    	myGrooveWriter.helpMenuPopupClick(action);
    }
  },
  template: `
	<div class="noteContextMenu">
		<ul id="helpContextMenu" class="list">
			<li
				v-for="item in menuItems"
				:key="item.action"
				@click="handleMenuClick(item.action)"
			>
				{{ item.label }}
			</li>
		</ul>
	</div>
`
}