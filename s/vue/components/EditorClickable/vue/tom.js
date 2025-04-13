import Menu from "./tom_menu.js"

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
    },
    abcOn: {
        type: String,
        required: true
    }
  },

  data() {
    return {
      noteABC: this.track ? this.track.getTomState(this.tomIndex, this.noteIndex, "ABC") : constant_ABC_OFF,
      constants: {
        TOM_OFF: constant_ABC_OFF        
      },
      isPopupOpen: false,
      menuX: 0,
      menuY: 0,
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
      let newMode = this.noteABC ? constant_ABC_OFF : this.abcOn
      this.track.setTomState(this.tomIndex, this.noteIndex, newMode, true);      
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
        this.track.setTomState(this.tomIndex, this.noteIndex, action == "off" ? constant_ABC_OFF : this.abcOn, true);    
    },
    handleAction(action) {
      this.track.setTomState(this.tomIndex, this.noteIndex, action, true);  
      this.isPopupOpen = false;
    }
  },

  components: {
    Menu
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

        <div v-if="noteABC === this.abcOn"
          class="tom_circle note_part" 
          style="backgroundColor: #000000; borderColor: #999"
          :id="'tom_circle' + tomIndex + '-' + noteIndex">
        </div>

        <Menu
          :is-open="isPopupOpen" 
          :x="menuX" 
          :y="menuY"
          @action="handleAction">
        </Menu>
    </div>
  `,
}