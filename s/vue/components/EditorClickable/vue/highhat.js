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
    }
  },

  inject: ['midiPlayer'],

  data() {
    return {
      noteABC: editor.track ? editor.track.getInstrumentNote(Instruments.HIGH_HAT, this.noteIndex) : constant_ABC_OFF,
      isPopupOpen: false,
      menuX: 0,
      menuY: 0,
    }
  },

  // watch: { 
  //   track: {
  //     handler(newVal, oldVal) { 
  //       this.noteABC = editor.track ? editor.track.getInstrumentNote(Instruments.HIGH_HAT, this.noteIndex) : constant_ABC_OFF;              
  //     },
  //     deep: true
  //   },    
  // },

  mounted() {
    this.removeHandler = eventBus.$on('track-updated', () => {
        this.noteABC = constant_ABC_OFF;
        if (editor.track && (this.noteIndex || this.noteIndex == 0)) {
          if (editor.track.getInstrumentNote(Instruments.HIGH_HAT, this.noteIndex)) {
            this.noteABC = editor.track.getInstrumentNote(Instruments.HIGH_HAT, this.noteIndex)
          }
        }
    });	
  },

  // beforeUnmount() {
  //     if (this.removeHandler) this.removeHandler() 
  // },
  
  computed: {
    noteConfig() {
      return {
        [constant_ABC_OFF]: { class: 'hh_cross', icon: 'fa-times', color: '#CCC' },
        [constant_ABC_HH_Normal]: { class: 'hh_cross', icon: 'fa-times', color: '#000000', midiNote: constant_OUR_MIDI_HIHAT_NORMAL },
        [constant_ABC_HH_Ride]: { class: 'hh_ride', icon: 'fa-dot-circle-o', color: '#000000', midiNote: constant_OUR_MIDI_HIHAT_RIDE },
        [constant_ABC_HH_Ride_Bell]: { class: 'hh_ride_bell', icon: 'fa-bell-o', color: '#000000', midiNote: constant_OUR_MIDI_HIHAT_RIDE_BELL },
        [constant_ABC_HH_Cow_Bell]: { class: 'hh_cow_bell', icon: 'fa-plus-square-o', color: '#000000', midiNote: constant_OUR_MIDI_HIHAT_COW_BELL },
        [constant_ABC_HH_Crash]: { class: 'hh_crash', icon: 'fa-asterisk', color: '#000000', midiNote: constant_OUR_MIDI_HIHAT_CRASH },
        [constant_ABC_HH_Stacker]: { class: 'hh_stacker', icon: 'fa-bars', color: '#000000', midiNote: constant_OUR_MIDI_HIHAT_STACKER },
        [constant_ABC_HH_Open]: { 
          primary: { class: 'hh_cross', icon: 'fa-times', color: '#000000' },
          secondary: { class: 'hh_open', icon: 'fa-circle-o', color: '#000000' },
          midiNote: constant_OUR_MIDI_HIHAT_OPEN
        },
        [constant_ABC_HH_Accent]: { 
          primary: { class: 'hh_cross', icon: 'fa-times', color: '#000000' },
          secondary: { class: 'hh_close', icon: 'fa-plus', color: '#000000' },
          midiNote: constant_OUR_MIDI_HIHAT_ACCENT
        },
        [constant_ABC_HH_Metronome_Normal]: { class: 'hh_metronome_normal', icon: 'fa-neuter', color: '#000000', midiNote: constant_OUR_MIDI_HIHAT_METRONOME_NORMAL },
        [constant_ABC_HH_Metronome_Accent]: { class: 'hh_metronome_accent', icon: 'fa-map-pin', color: '#000000', midiNote: constant_OUR_MIDI_HIHAT_METRONOME_ACCENT }
      }
    },
    currentNoteConfig() {
      let currentNoteConfig = this.noteConfig[this.noteABC];
      return currentNoteConfig;
    }
  },

  methods: {
    handleLeftClick(event) {
        let newMode = this.noteABC ? constant_ABC_OFF : constant_ABC_HH_Normal
        if (this.midiPlayer && newMode === constant_ABC_HH_Normal) this.midiPlayer.playSingleNote(constant_OUR_MIDI_HIHAT_NORMAL);                
        editor.track.setInstrumentNote(Instruments.HIGH_HAT, this.noteIndex, newMode);  
    },
    handleRightClick(event) {
        eventBus.$emit('close-all-menus');
        this.menuX = event.clientX;
        this.menuY = event.clientY;
        this.isPopupOpen = true;
    },
    handleMouseEnter(event) {
        let action = null;
        if (event.ctrlKey) action = "on";
        if (event.altKey) action = "off";  
        if (action)
          editor.track.setInstrumentNote(Instruments.HIGH_HAT, this.noteIndex, action == "off" ? constant_ABC_OFF : constant_ABC_HH_Normal);          
    },
    handleAction(action) {
      if (this.midiPlayer) {
        let note = this.noteConfig[action]?.midiNote;        
        if (note) this.midiPlayer.playSingleNote(note);                
      }      
      editor.track.setInstrumentNote(Instruments.HIGH_HAT, this.noteIndex, action);  
      this.isPopupOpen = false;
    },
  },

  created() {
    // Listen for close-all event
    eventBus.$on('close-all-menus', () => {
        this.isPopupOpen = false;
    });
  },

  beforeDestroy() {
      // Clean up event listener
      eventBus.$off('close-all-menus');
  },

  components: {
    Menu
  },

  template: `
    <div :id="'hi-hat' + noteIndex" class="hi-hat" @click.stop.prevent="handleLeftClick" @contextmenu.prevent="handleRightClick" @mouseenter="handleMouseEnter">
      <template v-if="currentNoteConfig">
        <template v-if="currentNoteConfig.primary">
          <div :class="[currentNoteConfig.primary.class, 'note_part']" :style="{ color: currentNoteConfig.primary.color }" :id="currentNoteConfig.primary.class + noteIndex">
            <i :class="'fa ' + currentNoteConfig.primary.icon"></i>
          </div>
          <div :class="[currentNoteConfig.secondary.class, 'note_part']" :style="{ color: currentNoteConfig.secondary.color }" :id="currentNoteConfig.secondary.class + noteIndex">
            <i :class="'fa ' + currentNoteConfig.secondary.icon"></i>
          </div>
        </template>
        <template v-else>
          <div :class="[currentNoteConfig.class, 'note_part']" :style="{ color: currentNoteConfig.color }" :id="currentNoteConfig.class + noteIndex">
            <i :class="'fa ' + currentNoteConfig.icon"></i>
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