/**
 * @typedef {Object} MetronomeOption
 * @property {('Solo'|'SpeedUp'|'CountIn'|'OffTheOne')} id - The option identifier
 * @property {string} title - The tooltip text
 * @property {string} label - The display text
 */

export default {
  data() {
    /** @type {{ options: MetronomeOption[] }} */
    return {
      options: [
        { 
          id: 'Solo',
          title: 'Just hear the metronome.',
          label: 'Solo'
        },
        {
          id: 'SpeedUp',
          title: 'Increase the tempo automatically',
          label: 'Auto speed up'
        },
        {
          id: 'CountIn',
          title: 'One measure of metronome count in at the start',
          label: 'Count it in'
        },
        {
          id: 'OffTheOne',
          title: 'Click on the e, &, or a',
          label: 'Offset click'
        }
      ]
    }
  },
  methods: {
    /**
     * Handle click on a metronome option
     * @param {MetronomeOption['id']} optionId - The ID of the clicked option
     */
    handleOptionClick(optionId) {
      metronome?.optionsMenuPopupClick(optionId)
    }
  },
  computed: {
    /**
     * Get the ID for a menu item
     * @param {MetronomeOption} option - The menu option
     * @returns {string} The menu item ID
     */
    getMenuItemId() {
      return (option) => `metronomeOptionsContextMenu${option.id}`
    }
  },
  template: `
    <nav class="noteContextMenu" aria-label="Metronome options">
      <ul id="metronomeOptionsContextMenu" class="list" role="menu">
        <li v-for="option in options"
            :key="option.id"
            class="metronomeOptionsContextMenuItem"
            :id="getMenuItemId(option)"
            :title="option.title"
            @click="handleOptionClick(option.id)"
            role="menuitem"
            tabindex="0"
            @keyup.enter="handleOptionClick(option.id)"
            @keyup.space="handleOptionClick(option.id)"
        >{{ option.label }}</li>
      </ul>
    </nav>
  `
}