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
          label: 'Solo',
          handler: (checked) => metronome.setSolo(checked),
          checked: metronome ? metronome.getSolo() : false
        },
        {
          id: 'SpeedUp',
          title: 'Increase the tempo automatically',
          label: 'Auto speed up',
          checked: metronome ? metronome.autoSpeedUpActive : false
        },
        {
          id: 'CountIn',
          title: 'One measure of metronome count in at the start',
          label: 'Count it in',
          checked: metronome ? metronome.countInActive : false
        },
        {
          id: 'OffTheOne',
          title: 'Click on the e, &, or a',
          label: 'Offset click',
          //checked: metronome ? metronome.isOffsetClick() : false
          checked: false
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
      this.options.find(option => option.id === optionId).handler(!this.options[0].checked)
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
    },
    /**
     * Get classes for a menu item
     * @param {MetronomeOption} option - The menu option
     * @returns {Object} Classes object for the menu item
     */
    getMenuItemClasses() {
      return (option) => ({
        'metronomeOptionsContextMenuItem': true,
        'menuChecked': option.checked
      })
    }
  },
  mounted() {
    // Subscribe to metronome changes
    this.removeHandler = metronome?.addChangeHandler(() => {
      this.options[0].checked = metronome ? metronome.getSolo() : false
      this.options[1].checked = metronome ? metronome.autoSpeedUpActive : false
      this.options[2].checked = metronome ? metronome.countInActive : false
      // this.options[3].checked = metronome ? metronome.isOffsetClick() : false
    })
  },
  beforeUnmount() {
    // Cleanup event handler
    if (this.removeHandler) this.removeHandler()
  },
  template: `
    <nav class="noteContextMenu" aria-label="Metronome options">
      <ul id="metronomeOptionsContextMenu" class="list" role="menu">
        <li v-for="option in options"
            :key="option.id"
            :class="getMenuItemClasses(option)"
            :id="getMenuItemId(option)"
            :title="option.title"
            @click="handleOptionClick(option.id)"
            role="menuitem"
            tabindex="0"
            @keyup.enter="handleOptionClick(option.id)"
            @keyup.space="handleOptionClick(option.id)"
            :aria-checked="option.checked"
        >{{ option.label }}</li>
      </ul>
    </nav>
  `
}