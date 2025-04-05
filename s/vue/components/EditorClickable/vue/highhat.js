export default {
  props: {
    noteIndex: {
      type: Number,
      required: true
    },
  },

  methods: {
    handleLeftClick(event) {
        noteLeftClick(event, 'hh', this.noteIndex)
    },
    handleRightClick(event) {
        noteRightClick(event, 'hh', this.noteIndex)
    },
    handleMouseEnter(event) {
        noteOnMouseEnter(event, 'hh', this.noteIndex)
    },
  },

  template: `
    <div :id="'hi-hat' + noteIndex" class="hi-hat" @click="handleLeftClick" @contextmenu.prevent="handleRightClick" @mouseenter="handleMouseEnter">
        <div class="hh_crash note_part" :id="'hh_crash' + noteIndex"><i class="fa fa-asterisk"></i></div>
        <div class="hh_ride note_part" :id="'hh_ride' + noteIndex"><i class="fa fa-dot-circle-o"></i></div>
        <div class="hh_ride_bell note_part" :id="'hh_ride_bell' + noteIndex"><i class="fa fa-bell-o"></i></div>
        <div class="hh_cow_bell note_part" :id="'hh_cow_bell' + noteIndex"><i class="fa fa-plus-square-o"></i></div>
        <div class="hh_stacker note_part" :id="'hh_stacker' + noteIndex"><i class="fa fa-bars"></i></div>
        <div class="hh_metronome_normal note_part" :id="'hh_metronome_normal' + noteIndex"><i class="fa fa-neuter"></i></div>
        <div class="hh_metronome_accent note_part" :id="'hh_metronome_accent' + noteIndex"><i class="fa fa-map-pin"></i></div>
        <div class="hh_cross note_part" :id="'hh_cross' + noteIndex"><i class="fa fa-times"></i></div>
        <div class="hh_open note_part" :id="'hh_open' + noteIndex"><i class="fa fa-circle-o"></i></div>
        <div class="hh_close note_part" :id="'hh_close' + noteIndex"><i class="fa fa-plus"></i></div>
        <div class="hh_accent note_part" :id="'hh_accent' + noteIndex"><i class="fa fa-angle-right"></i></div>
    </div>
  `,
}