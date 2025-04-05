export default {
  props: {
    noteIndex: {
      type: Number,
      required: true
    },
    tomIndex: {
        type: Number,
        required: true
    }
  },

  methods: {
    handleLeftClick(event) {
        noteLeftClick(event, 'tom' + this.tomIndex, this.noteIndex)
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
        <div 
          class="tom_circle note_part" 
          :id="'tom_circle' + tomIndex + '-' + noteIndex">
        </div>
    </div>
  `,
}
