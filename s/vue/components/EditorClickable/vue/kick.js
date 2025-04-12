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
      noteABC: this.track ? this.track.getKickState(this.noteIndex, "ABC") : constant_ABC_OFF,
      constants: {
        KICK_OFF: constant_ABC_OFF,
        KICK_NORMAL: constant_ABC_KI_Normal,
        KICK_SPLASH: constant_ABC_KI_Splash,
        KICK_SPLASH_AND_KICK: constant_ABC_KI_SandK        
      }
    }
  },

  watch: { 
    track: {
      handler(newVal, oldVal) { 
        this.noteABC = this.track ? this.track.getKickState(this.noteIndex, "ABC") : constant_ABC_OFF;              
      },
      deep: true
    },    
  },
  
  methods: {
    handleLeftClick(event) {
        let newMode = this.noteABC ? constant_ABC_OFF : constant_ABC_KI_Normal
        this.track.setKickState(this.noteIndex, newMode, true);                
    },
    handleRightClick(event) {
        noteRightClick(event, 'kick', this.noteIndex)
    },
    handleMouseEnter(event) {
        noteOnMouseEnter(event, 'kick', this.noteIndex)
    },
  },

  template: `
    <div :id="'kick' + noteIndex" class="kick" @click="handleLeftClick" @contextmenu.prevent="handleRightClick" @mouseenter="handleMouseEnter">
        <div v-if="noteABC === constants.KICK_SPLASH || noteABC === constants.KICK_SPLASH_AND_KICK" class="kick_splash note_part" style="color: #000000" :id="'kick_splash' + noteIndex"><i class="fa fa-times"></i></div>
        <div v-if="noteABC === constants.KICK_NORMAL || noteABC === constants.KICK_SPLASH_AND_KICK" class="kick_circle note_part" style="backgroundColor: #000000; borderColor: #999" :id="'kick_circle' + noteIndex"></div>
        <div v-if="noteABC === constants.KICK_OFF" class="kick_circle note_part" style="borderColor: #999" :id="'kick_circle' + noteIndex"></div>
    </div>
  `,
}