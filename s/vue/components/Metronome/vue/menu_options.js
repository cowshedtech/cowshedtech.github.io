import ContextMenu from '../../BaseContextMenu/vue/base_context_menu.js'
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
    eventBus: {
        type: Object,
        required: true
    }
	},

  inject: ['midiPlayer', 'metronome', 'metronomeState'],
  
  data() {
    /** @type {{ options: MetronomeOption[] }} */
    return {
      options: [
        { 
          id: 'Solo',
          title: 'Just hear the metronome.',
          label: 'Solo',
          handler: (checked) => this.metronome.setSolo(checked),
          checked: this.metronome ? this.metronome.getSolo() : false
        },
        {
          id: 'SpeedUp',
          title: 'Increase the tempo automatically',
          label: 'Auto speed up',
          handler: (checked) => this.handleSpeedClick(),
          checked: this.midiPlayer ? this.midiPlayer.isAutoSpeedUpActive() : false
        },
        {
          id: 'CountIn',
          title: 'One measure of metronome count in at the start',
          label: 'Count it in',
          handler: (checked) => this.metronome.setCountInActive(checked),
          checked: this.metronome ? this.metronome.getCountInActive() : false
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
      this.menuX = event.clientX;
      this.menuY = event.clientY;
      this.isOffsetClickPopupOpen = !this.isOffsetClickPopupOpen;
      this.$emit('close')
    },

    handleSpeedClick(optionId) {
      this.menuX = event.clientX;
      this.menuY = event.clientY;
      this.isSpeedPopupOpen = !this.isSpeedPopupOpen;
      this.midiPlayer.setAutoSpeedUpActive(!this.midiPlayer.isAutoSpeedUpActive()),          
      (this.options[1].checked = this.midiPlayer.isAutoSpeedUpActive()),
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

  mounted() {},
  beforeUnmount() {},
  
  watch: {
    'metronomeState.version': function() {
      this.options[0].checked = this.metronome ? this.metronome.getSolo() : false
      this.options[2].checked = this.metronome ? this.metronome.getCountInActive() : false
    }
  },

  components: {
    ContextMenu, OptionsOffsetClickMenu, OptionsSpeedMenu
  },

  template: `
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
    <ContextMenu 
        :is-open="isOffsetClickPopupOpen" 
        :x="menuX" 
        :y="menuY" 
        @close="closeMenu">
        <OptionsOffsetClickMenu></OptionsOffsetClickMenu>        
    </ContextMenu> 
    <ContextMenu 
        :is-open="isSpeedPopupOpen" 
        :x="menuX" 
        :y="menuY" 
        @close="closeMenu">
         <OptionsSpeedMenu
            :midiPlayer="midiPlayer"
            :eventBus="eventBus">
        </OptionsSpeedMenu>          
    </ContextMenu>              
  `
}