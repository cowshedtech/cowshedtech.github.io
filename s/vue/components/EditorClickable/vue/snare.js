import SnareFlam from './snare_flam.js'
import SnareDrag from './snare_drag.js'

export default {
  props: {
    noteIndex: {
      type: Number,
      required: true
    },
  },

  methods: {
    handleLeftClick(event) {
        noteLeftClick(event, 'snare', this.noteIndex)
    },
    handleRightClick(event) {
        noteRightClick(event, 'snare', this.noteIndex)
    },
    handleMouseEnter(event) {
        noteOnMouseEnter(event, 'snare', this.noteIndex)
    },
  },

  components: {
    SnareDrag, SnareFlam
  },

  template: `
    <div :id="'snare' + noteIndex" class="snare" @click="handleLeftClick" @contextmenu.prevent="handleRightClick" @mouseenter="handleMouseEnter">
        <div class="snare_ghost note_part" :id="'snare_ghost' + noteIndex">(<i class="fa fa-circle dot_in_snare_ghost_note"></i>)</div>
        <div class="snare_circle note_part" :id="'snare_circle' + noteIndex"></div>
        <div class="snare_xstick note_part" :id="'snare_xstick' + noteIndex"><i class="fa fa-times"></i></div>
        <div class="snare_buzz note_part" :id="'snare_buzz' + noteIndex"><i class="fa fa-bars"></i></div>
        <div class="snare_flam note_part" :id="'snare_flam' + noteIndex"><SnareFlam></SnareFlam></div>
        <div class="snare_drag note_part" :id="'snare_drag' + noteIndex"></div>
        <div class="snare_accent note_part" :id="'snare_accent' + noteIndex">
            <i class="fa fa-chevron-right"></i>
        </div>
    </div>
  `,
}

