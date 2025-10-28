import Menu from "./kick_menu.js"


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
    midiPlayer: {
      type: Object,
      required: false
    }
  },

  data() {
    return {
      noteABC: editor.track ? editor.track.getInstrumentNote(Instruments.KICK, this.noteIndex) : constant_ABC_OFF,
      constants: {
        KICK_OFF: constant_ABC_OFF,
        KICK_NORMAL: constant_ABC_KI_Normal,
        KICK_SPLASH: constant_ABC_KI_Splash,
        KICK_SPLASH_AND_KICK: constant_ABC_KI_SandK        
      },
      isPopupOpen: false,
      menuX: 0,
      menuY: 0,
    }
  },

  watch: { 
    track: {
      handler(newVal, oldVal) { 
        this.noteABC = editor.track ? editor.track.getInstrumentNote(Instruments.KICK, this.noteIndex) : constant_ABC_OFF;              
      },
      deep: true
    },    
  },
  
  methods: {
    handleLeftClick(event) {
        let newMode = this.noteABC ? constant_ABC_OFF : constant_ABC_KI_Normal
        if (this.midiPlayer && newMode === constant_ABC_KI_Normal) this.midiPlayer.playSingleNote(constant_OUR_MIDI_KICK_NORMAL);                
        editor.track.setInstrumentNote(Instruments.KICK, this.noteIndex, newMode);           
    },
    handleRightClick(event) {
      eventBus.$emit('close-all-menus');
      this.menuX = event.clientX - 90;
      this.menuY = event.clientY;
      this.isPopupOpen = true;
    },
    handleMouseEnter(event) {
      let action = null;
      if (event.ctrlKey) action = "on";
      if (event.altKey) action = "off";  
      if (action) 
        editor.track.setInstrumentNote(Instruments.KICK, this.noteIndex,  action == "off" ? constant_ABC_OFF : constant_ABC_KI_Normal);           
    },
    handleAction(action) {
      editor.track.setInstrumentNote(Instruments.KICK, this.noteIndex, action);           
      if (this.midiPlayer) {
        if (action === constant_ABC_KI_Normal) midiPlayer.playSingleNote(constant_OUR_MIDI_KICK_NORMAL);
        if (action === constant_ABC_KI_Splash) midiPlayer.playSingleNote(constant_OUR_MIDI_HIHAT_FOOT);
        if (action === constant_ABC_KI_SandK) {
          midiPlayer.playSingleNote(constant_OUR_MIDI_HIHAT_FOOT);
          midiPlayer.playSingleNote(constant_OUR_MIDI_KICK_NORMAL);
        }              
      }  
      this.isPopupOpen = false;
    }
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
    <div :id="'kick' + noteIndex" class="kick" @click.stop.prevent="handleLeftClick" @contextmenu.prevent="handleRightClick" @mouseenter="handleMouseEnter">
        <div v-if="noteABC === constants.KICK_SPLASH || noteABC === constants.KICK_SPLASH_AND_KICK" class="kick_splash note_part" style="color: #000000" :id="'kick_splash' + noteIndex"><i class="fa fa-times"></i></div>
        <div v-if="noteABC === constants.KICK_NORMAL || noteABC === constants.KICK_SPLASH_AND_KICK" class="kick_circle note_part" style="backgroundColor: #000000; borderColor: #999" :id="'kick_circle' + noteIndex"></div>
        <div v-if="noteABC === constants.KICK_OFF" class="kick_circle note_part" style="borderColor: #999" :id="'kick_circle' + noteIndex"></div>
        <Menu
          :is-open="isPopupOpen" 
          :x="menuX" 
          :y="menuY"
          @action="handleAction">
        </Menu>
    </div>
  `,
}