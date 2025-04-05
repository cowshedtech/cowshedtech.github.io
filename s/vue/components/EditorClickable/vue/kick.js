export default {
  props: {
    noteIndex: {
      type: Number,
      required: true
    },
  },

  methods: {
    handleLeftClick(event) {
        noteLeftClick(event, 'kick', this.noteIndex)
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
        <div class="kick_splash note_part" :id="'kick_splash' + noteIndex"><i class="fa fa-times"></i></div>
        <div class="kick_circle note_part" :id="'kick_circle' + noteIndex"></div>
    </div>
  `,
}