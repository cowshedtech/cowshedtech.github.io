import Menu from "./highhat_menu.js"

export default {
  props: {
    track: {
      type: Object,
      required: true
    },
    noteIndex: {
      type: Number,
      required: true
    },
  },

  data() {
    return {
      noteABC: this.track ? this.track.getHighHatState(this.noteIndex, "ABC") : constant_ABC_OFF,
      constants: {
        HIGHHAT_OFF: constant_ABC_OFF,
        HIGHHAT_RIDE: constant_ABC_HH_Ride,
        HIGHHAT_RIDE_BELL: constant_ABC_HH_Ride_Bell,
        HIGHHAT_COW_BELL: constant_ABC_HH_Cow_Bell,
        HIGHHAT_CRASH: constant_ABC_HH_Crash,
        HIGHHAT_STACKER: constant_ABC_HH_Stacker,
        HIGHHAT_OPEN: constant_ABC_HH_Open,
        HIGHHAT_CLOSE: constant_ABC_HH_Close,
        HIGHHAT_ACCENT: constant_ABC_HH_Accent,
        HIGHHAT_NORMAL: constant_ABC_HH_Normal,
        HIGHHAT_METRONOME_NORMAL: constant_ABC_HH_Metronome_Normal,
        HIGHHAT_METRONOME_ACCENT: constant_ABC_HH_Metronome_Accent
      },
      isPopupOpen: false,
      menuX: 0,
      menuY: 0,
    }
  },

  computed: {
    iconConfig() {
      return {
        [constant_ABC_OFF]: { class: 'hh_cross', icon: 'fa-times', color: '#CCC' },
        [this.constants.HIGHHAT_NORMAL]: { class: 'hh_cross', icon: 'fa-times', color: '#000000' },
        [constant_ABC_HH_Ride]: { class: 'hh_ride', icon: 'fa-dot-circle-o', color: '#000000' },
        [this.constants.HIGHHAT_RIDE_BELL]: { class: 'hh_ride_bell', icon: 'fa-bell-o', color: '#000000' },
        [this.constants.HIGHHAT_COW_BELL]: { class: 'hh_cow_bell', icon: 'fa-plus-square-o', color: '#000000' },
        [this.constants.HIGHHAT_CRASH]: { class: 'hh_crash', icon: 'fa-asterisk', color: '#000000' },
        [this.constants.HIGHHAT_STACKER]: { class: 'hh_stacker', icon: 'fa-bars', color: '#000000' },
        [this.constants.HIGHHAT_OPEN]: { 
          primary: { class: 'hh_cross', icon: 'fa-times', color: '#000000' },
          secondary: { class: 'hh_open', icon: 'fa-circle-o', color: '#000000' }
        },
        [this.constants.HIGHHAT_CLOSE]: { 
          primary: { class: 'hh_cross', icon: 'fa-times', color: '#000000' },
          secondary: { class: 'hh_close', icon: 'fa-plus', color: '#000000' }
        },
        [this.constants.HIGHHAT_ACCENT]: { 
          primary: { class: 'hh_cross', icon: 'fa-times', color: '#000000' },
          secondary: { class: 'hh_accent', icon: 'fa-angle-right', color: '#000000' }
        },
        [this.constants.HIGHHAT_METRONOME_NORMAL]: { class: 'hh_metronome_normal', icon: 'fa-neuter', color: '#000000' },
        [this.constants.HIGHHAT_METRONOME_ACCENT]: { class: 'hh_metronome_accent', icon: 'fa-map-pin', color: '#000000' }
      }
    },
    currentIcon() {
      let currentIcon = this.iconConfig[this.noteABC];
      return currentIcon;
    }
  },

  watch: { 
    track: {
      handler(newVal, oldVal) { 
        this.noteABC = this.track ? this.track.getHighHatState(this.noteIndex, "ABC") : constant_ABC_OFF;              
      },
      deep: true
    },    
  },
  
  methods: {
    handleLeftClick(event) {
        let newMode = this.noteABC ? constant_ABC_OFF : constant_ABC_HH_Normal
        this.track.setHighHatState(this.noteIndex, newMode, true);  
    },
    handleRightClick(event) {
        this.menuX = event.clientX;
        this.menuY = event.clientY;
        this.toggleMenu();   
    },
    handleMouseEnter(event) {
        noteOnMouseEnter(event, 'hh', this.noteIndex)
    },
    toggleMenu(instrument) {
      this.isPopupOpen = !this.isPopupOpen;
    },
    handleAction(action) {
      this.track.setHighHatState(this.noteIndex, action, true);  
      this.isPopupOpen = false;
    },
  },

  components: {
    Menu
  },

  template: `
    <div :id="'hi-hat' + noteIndex" class="hi-hat" @click="handleLeftClick" @contextmenu.prevent="handleRightClick" @mouseenter="handleMouseEnter">
      <template v-if="currentIcon">
        <template v-if="currentIcon.primary">
          <div :class="[currentIcon.primary.class, 'note_part']" :style="{ color: currentIcon.primary.color }" :id="currentIcon.primary.class + noteIndex">
            <i :class="'fa ' + currentIcon.primary.icon"></i>
          </div>
          <div :class="[currentIcon.secondary.class, 'note_part']" :style="{ color: currentIcon.secondary.color }" :id="currentIcon.secondary.class + noteIndex">
            <i :class="'fa ' + currentIcon.secondary.icon"></i>
          </div>
        </template>
        <template v-else>
          <div :class="[currentIcon.class, 'note_part']" :style="{ color: currentIcon.color }" :id="currentIcon.class + noteIndex">
            <i :class="'fa ' + currentIcon.icon"></i>
          </div>
        </template>
      </template>
      <Menu
        :is-open="isPopupOpen" 
        :x="menuX" 
        :y="menuY"
        @action="handleAction">
      </Menu>
    </div>    
  `
}