export default {
  props: {
    noteIndex: {
      type: Number,
      required: true
    }
  },

  methods: {
    handleLeftClick(event) {
        noteLeftClick(event, 'sticking' + this.tomIndex, this.noteIndex)
    },
    handleRightClick(event) {
        noteRightClick(event, 'sticking' + this.tomIndex, this.noteIndex)
    },
    handleMouseEnter(event) {
        noteOnMouseEnter(event, 'sticking' + this.tomIndex, this.noteIndex)
    },
  },

  template: `
    <div :id="'sticking' + noteIndex" class="sticking">
        <div class="sticking_right note_part" :id="'sticking_right' + noteIndex" @click="handleLeftClick" @contextmenu.prevent="handleRightClick" @mouseenter="handleMouseEnter">R</div>
        <div class="sticking_left note_part" :id="'sticking_left' + noteIndex" @click="handleLeftClick" @contextmenu.prevent="handleRightClick" @mouseenter="handleMouseEnter">L</div>
        <div class="sticking_both note_part" :id="'sticking_both' + noteIndex" @click="handleLeftClick" @contextmenu.prevent="handleRightClick" @mouseenter="handleMouseEnter">R/L</div>
        <div class="sticking_count note_part" :id="'sticking_count' + noteIndex" @click="handleLeftClick" @contextmenu.prevent="handleRightClick" @mouseenter="handleMouseEnter">C</div>
    </div>
  `,
}