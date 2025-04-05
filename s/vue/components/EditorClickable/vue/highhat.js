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
    generateFlamSVG() {
      return `
        <i class="fa ">
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" width="30" height="30">
            <style type="text/css">
              .flam_fill {fill: currentColor}
              .flam_stroke {stroke: currentColor; fill: none; stroke-width: .7}
            </style>
            <defs>
              <path id="flam_ghd" class="flam_fill" d="m1.7-1c-1-1.7-4.5 0.2-3.4 2 1 1.7 4.5-0.2 3.4-2"></path>
              <ellipse id="flam_hd" rx="4.1" ry="2.9" transform="rotate(-20)" class="flam_fill"></ellipse>
            </defs>
            <g id="note" transform="translate(-44 -35)">
              <path class="flam_stroke" d="m52.1 53.34v-14M52.1 39.34c0.6 3.4 5.6 3.8 3 10 1.2-4.4-1.4-7-3-7"></path>
              <use x="50.50" y="53.34" xlink:href="#flam_ghd"></use>
              <path class="flam_stroke" d="m49.5 49.34l9-5"></path>
              <path class="flam_stroke" d="m50.5 58.34c2.9 3 11.6 3 14.5 0M69.5 53.34v-21"></path>
              <use x="66.00" y="53.34" xlink:href="#flam_hd"></use>
            </g>
          </svg>
        </i>
      `
    }
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
        <div class="hh_flam note_part" :id="'hh_flam' + noteIndex" v-html="generateFlamSVG()"></div>
    </div>
  `,
}