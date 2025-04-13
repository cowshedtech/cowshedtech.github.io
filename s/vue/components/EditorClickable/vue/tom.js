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
    tomIndex: {
        type: Number,
        required: true
    }
  },

  data() {
    return {
      noteABC: this.track ? this.track.getTomState(this.tomIndex, this.noteIndex, "ABC") : constant_ABC_OFF,
      constants: {
        TOM_OFF: constant_ABC_OFF,
        TOM1_NORMAL: constant_ABC_T1_Normal,
        TOM4_NORMAL: constant_ABC_T4_Normal        
      }
    }
  },

  watch: { 
    track: {
      handler(newVal, oldVal) { 
        this.noteABC = this.track ? this.track.getTomState(this.tomIndex, this.noteIndex, "ABC") : constant_ABC_OFF;              
      },
      deep: true
    },    
  },

  methods: {
    handleLeftClick(event) {
        if (this.tomIndex === 1) {
          let newMode = this.noteABC ? constant_ABC_OFF : constant_ABC_T1_Normal
          this.track.setTomState(this.tomIndex, this.noteIndex, newMode, true);
        }
        if (this.tomIndex === 4) {
          let newMode = this.noteABC ? constant_ABC_OFF : constant_ABC_T4_Normal
          this.track.setTomState(this.tomIndex, this.noteIndex, newMode, true);                
        }
    },
    handleRightClick(event) {
        noteRightClick(event, 'tom' + this.tomIndex, this.noteIndex)
    },
    handleMouseEnter(event) {
        noteOnMouseEnter(event, 'tom' + this.tomIndex, this.noteIndex)
    },
  },

  template: `
    <div 
      :id="'toms' + tomIndex + '-' + noteIndex" 
      class="tom" 
      @click="handleLeftClick" 
      @contextmenu.prevent="handleRightClick" 
      @mouseenter="handleMouseEnter">
        <div v-if="noteABC === constants.TOM_OFF"
          class="tom_circle note_part" 
          style="backgroundColor: #FFF; borderColor: #999"
          :id="'tom_circle' + tomIndex + '-' + noteIndex">
        </div>

        <div v-if="noteABC === constants.TOM1_NORMAL"
          class="tom_circle note_part" 
          style="backgroundColor: #000000; borderColor: #999"
          :id="'tom_circle' + tomIndex + '-' + noteIndex">
        </div>

        <div v-if="noteABC === constants.TOM4_NORMAL"
          class="tom_circle note_part" 
          style="backgroundColor: #000000; borderColor: #999"
          :id="'tom_circle' + tomIndex + '-' + noteIndex">
        </div>
    </div>
  `,
}