import OptionsOffsetClickMenu from './menu_options_offset_click.js'
import OptionsSpeedMenu from './menu_speed.js'

/**
 * @typedef {Object} MetronomeOption
 * @property {('Solo'|'SpeedUp'|'CountIn'|'OffTheOne')} id - The option identifier
 * @property {string} title - The tooltip text
 * @property {string} label - The display text
 */

export default {
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
          handler: (checked) => this.handleSpeedClick(),
          checked: midiPlayer ? midiPlayer.isAutoSpeedUpActive() : false
        },
        {
          id: 'CountIn',
          title: 'One measure of metronome count in at the start',
          label: 'Count it in',
          handler: (checked) => metronome.setCountInActive(checked),
          checked: metronome ? metronome.getCountInActive() : false
        },
        {
          id: 'OffTheOne',
          title: 'Click on the e, &, or a',
          label: 'Offset click',
          //checked: metronome ? metronome.isOffsetClick() : false
          handler: (checked) => this.handleOffsetClick(),
          checked: false
        }
      ],
      isOffsetClickPopupOpen: false,
      isSpeedPopupOpen: false,
      menuX: 0,
      menuY: 0,      
    }    
  },

  methods: {
    /**
     * Handle click on a metronome option
     * @param {MetronomeOption['id']} optionId - The ID of the clicked option
     */
    handleOptionClick(optionId) {
      let option = this.options.find(option => option.id === optionId)
      option.handler(!option.checked)
      this.$emit('close')
    },

    handleOffsetClick(optionId) {
      this.menuX = event.clientX - 90;
      this.menuY = event.clientY;
      this.isOffsetClickPopupOpen = !this.isOffsetClickPopupOpen;
      this.$emit('close')
    },

    handleSpeedClick(optionId) {
      this.menuX = event.clientX - 90;
      this.menuY = event.clientY;
      this.isSpeedPopupOpen = !this.isSpeedPopupOpen;
      midiPlayer.setAutoSpeedUpActive(!midiPlayer.isAutoSpeedUpActive()),          
      this.$emit('close')
    },

    closeMenu() {
      this.isOffsetClickPopupOpen = false;
      this.isSpeedPopupOpen = false;
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
    eventBus.$on('metronome-updated', () => {
			this.options[0].checked = metronome ? metronome.getSolo() : false
      this.options[1].checked = metronome ? midiPlayer.isAutoSpeedUpActive() : false
      this.options[2].checked = metronome ? metronome.getCountInActive() : false
		})
  },

  beforeUnmount() {
    eventBus.$off('metronome-updated');
  },

  components: {
    OptionsOffsetClickMenu, OptionsSpeedMenu
  },

  template: `
    <span class="noteContextMenuNew" id="metronomeOptionsContextMenuContainer" aria-label="Metronome options" v-if="isOpen" style="position: absolute; z-index: 9999; display: block"  :style="{ top: y + 'px', left: x + 'px' }">
      <ul id="metronomeOptionsContextMenu" class="list" role="menu">
        <li v-for="option in options"
            :key="option.id"
            :class="getMenuItemClasses(option)"
            :id="getMenuItemId(option)"
            :title="option.title"
            @click.stop.prevent="handleOptionClick(option.id)"
            role="menuitem"
            tabindex="0"
            @keyup.enter="handleOptionClick(option.id)"
            @keyup.space="handleOptionClick(option.id)"
            :aria-checked="option.checked"
        >{{ option.label }}</li>
      </ul>
    </span>
    <OptionsOffsetClickMenu
        :is-open="isOffsetClickPopupOpen" 
        :x="menuX" 
        :y="menuY"
        @close="closeMenu">
    </OptionsOffsetClickMenu>
    <OptionsSpeedMenu
        :is-open="isSpeedPopupOpen" 
        :x="menuX" 
        :y="menuY"
        @close="closeMenu">
    </OptionsSpeedMenu>            
  `
}