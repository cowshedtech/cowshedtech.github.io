import SnareFlam from './snare_flam.js'
import SnareDrag from './snare_drag.js'
import Menu from "./snare_menu.js"


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
      noteABC: this.track ? this.track.getSnareState(this.noteIndex, "ABC") : constant_ABC_OFF,
      constants: {
        SNARE_OFF: constant_ABC_OFF,
        SNARE_GHOST: constant_ABC_SN_Ghost,
        SNARE_ACCENT: constant_ABC_SN_Accent,
        SNARE_NORMAL: constant_ABC_SN_Normal,
        SNARE_XSTICK: constant_ABC_SN_XStick,
        SNARE_BUZZ: constant_ABC_SN_Buzz,
        SNARE_FLAM: constant_ABC_SN_Flam,
        SNARE_DRAG: constant_ABC_SN_Drag
      },
      isPopupOpen: false,
      menuX: 0,
      menuY: 0,
    }
  },

  watch: { 
    track: {
      handler(newVal, oldVal) { 
        this.noteABC = this.track ? this.track.getSnareState(this.noteIndex, "ABC") : constant_ABC_OFF
      },
      deep: true
    },    
  },
  
  methods: {
    handleLeftClick(event) {
        let newMode = this.noteABC ? constant_ABC_OFF : constant_ABC_SN_Accent
        this.track.setSnareState(this.noteIndex, newMode, true);        
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
        this.track.setSnareState(this.noteIndex, action == "off" ? constant_ABC_OFF : constant_ABC_SN_Accent, true);    
    },
    handleAction(action) {
      this.track.setSnareState(this.noteIndex, action, true);  
      this.isPopupOpen = false;
    }
  },

  components: {
    Menu, SnareFlam
  },

  template: `
    <div :id="'snare' + noteIndex" class="snare" @click="handleLeftClick" @contextmenu.prevent="handleRightClick" @mouseenter="handleMouseEnter">        
        <div v-if="noteABC === constants.SNARE_OFF" class="snare_circle note_part" style="color: #FFFFFF; borderColor: #999999" :id="'snare_circle' + noteIndex"></div>
        <div v-if="noteABC === constants.SNARE_NORMAL" class="snare_circle note_part" style="background-color: #000000; color: #000000; borderColor: #999999" :id="'snare_circle' + noteIndex"></div>
        <div v-if="noteABC === constants.SNARE_FLAM" class="snare_flam note_part" style="color: #000000" :id="'snare_flam' + noteIndex"></div>
        <div v-if="noteABC === constants.SNARE_DRAG" class="snare_drag note_part" style="color: #000000" :id="'snare_drag' + noteIndex"></div>
        <div v-if="noteABC === constants.SNARE_GHOST" class="snare_ghost note_part" style="color: #000000"  :id="'snare_ghost' + noteIndex">(<i class="fa fa-circle dot_in_snare_ghost_note"></i>)</div>
        <div v-if="noteABC === constants.SNARE_ACCENT" class="snare_circle note_part" style="background-color: #000000; borderColor: #999999" :id="'snare_circle' + noteIndex"></div>
        <div v-if="noteABC === constants.SNARE_ACCENT" class="snare_accent note_part" style="color: #FFFFFF" :id="'snare_accent' + noteIndex">
            <i class="fa fa-chevron-right"></i>
        </div>
        <div v-if="noteABC === constants.SNARE_XSTICK" class="snare_xstick note_part" style="color: #000000" :id="'snare_xstick' + noteIndex"><i class="fa fa-times"></i></div>
        <div v-if="noteABC === constants.SNARE_BUZZ" class="snare_buzz note_part" style="color: #000000" :id="'snare_buzz' + noteIndex"><i class="fa fa-bars"></i></div>
        <Menu
          :is-open="isPopupOpen" 
          :x="menuX" 
          :y="menuY"
          @action="handleAction">
        </Menu>
    </div>
  `,
}