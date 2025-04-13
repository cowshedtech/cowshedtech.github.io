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
  },

  data() {
    return {
      noteABC: this.track ? this.track.getKickState(this.noteIndex, "ABC") : constant_ABC_OFF,
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
      this.menuX = event.clientX;
      this.menuY = event.clientY;
      this.isPopupOpen = true;
    },
    handleMouseEnter(event) {
      let action = null;
      if (event.ctrlKey) action = "on";
      if (event.altKey) action = "off";  
      if (action)
        this.track.setKickState(this.noteIndex, action == "off" ? constant_ABC_OFF : constant_ABC_KI_Normal, true);     
    },
    handleAction(action) {
      this.track.setKickState(this.noteIndex, action, true);  
      this.isPopupOpen = false;
    }
  },

  components: {
    Menu
  },

  template: `
    <div :id="'kick' + noteIndex" class="kick" @click="handleLeftClick" @contextmenu.prevent="handleRightClick" @mouseenter="handleMouseEnter">
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