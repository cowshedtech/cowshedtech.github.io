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

  data() {
    return {
      noteABC: this.track && this.noteIndex || this.noteIndex == 0 ? this.track.getInstrumentNote(Instruments.STICKING, this.noteIndex) : constant_ABC_OFF,
      constants: {
        STICK_R: constant_ABC_STICK_R,
        STICK_L: constant_ABC_STICK_L,
        STICK_BOTH: constant_ABC_STICK_BOTH,
        STICK_COUNT: constant_ABC_STICK_COUNT,
        STICK_OFF: constant_ABC_OFF
      }
    }
  },

  mounted() {
    this.removeHandler = eventBus.$on('track-updated', () => {
        this.noteABC = constant_ABC_OFF;
        if (editor.track && (this.noteIndex || this.noteIndex == 0)) {
          if (editor.track.getInstrumentNote(Instruments.STICKING, this.noteIndex)) {
            this.noteABC = editor.track.getInstrumentNote(Instruments.STICKING, this.noteIndex)
          }
        }
    });	
  },

  // beforeUnmount() {
  //     if (this.removeHandler) this.removeHandler() 
  // },

  methods: {
    handleLeftClick(event) {
        var new_state = false;
        var sticking_state = this.noteABC;
      
        if (!sticking_state || sticking_state == constant_ABC_OFF) {
            new_state = constant_ABC_STICK_R;
        } else if (sticking_state == constant_ABC_STICK_R) {
            new_state = constant_ABC_STICK_L;
        } else if (sticking_state == constant_ABC_STICK_L) {
            new_state = constant_ABC_STICK_BOTH;
        } else if (sticking_state == constant_ABC_STICK_BOTH) {
            new_state = constant_ABC_STICK_COUNT;
        } else {
            new_state = constant_ABC_OFF;
        }
        this.noteABC = new_state;
        editor.track.setInstrumentNote(Instruments.STICKING, this.noteIndex, new_state);        
    },
    handleRightClick(event) {
        // noteRightClick(event, 'sticking', this.noteIndex)
    },
    handleMouseEnter(event) {
        // noteOnMouseEnter(event, 'sticking', this.noteIndex)
    },
  },

  template: `
    <div :id="'sticking' + noteIndex" class="sticking">
        <div v-if="noteABC === constants.STICK_OFF" class="sticking_right note_part" :id="'sticking_right' + noteIndex" @click.stop.prevent="handleLeftClick" @contextmenu.prevent="handleRightClick" @mouseenter="handleMouseEnter">R</div>
        <div v-if="noteABC === constants.STICK_R" class="sticking_right note_part" style="color:rgb(36, 132, 192)" :id="'sticking_right' + noteIndex" @click.stop.prevent="handleLeftClick" @contextmenu.prevent="handleRightClick" @mouseenter="handleMouseEnter">R</div>
        <div v-if="noteABC === constants.STICK_L" class="sticking_left note_part" style="color:rgb(36, 132, 192)"  :id="'sticking_left' + noteIndex" @click.stop.prevent="handleLeftClick" @contextmenu.prevent="handleRightClick" @mouseenter="handleMouseEnter">L</div>
        <div v-if="noteABC === constants.STICK_BOTH" class="sticking_both note_part" style="color:rgb(36, 132, 192)"  :id="'sticking_both' + noteIndex" @click.stop.prevent="handleLeftClick" @contextmenu.prevent="handleRightClick" @mouseenter="handleMouseEnter">R/L</div>
        <div v-if="noteABC === constants.STICK_COUNT" class="sticking_count note_part" style="color:rgb(36, 132, 192)"  :id="'sticking_count' + noteIndex" @click.stop.prevent="handleLeftClick" @contextmenu.prevent="handleRightClick" @mouseenter="handleMouseEnter">C</div>
    </div>
  `,
}