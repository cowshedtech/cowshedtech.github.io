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
      noteABC: this.track ? this.track.getHighHatState(this.noteIndex, "ABC") : constant_ABC_OFF,
      constants: {
        HIGHHAT_OFF: constant_ABC_OFF,
        HIGHHAT_RIDE: constant_ABC_HH_Ride,
        HIGHHAT_RIDE_BELL: constant_ABC_HH_Ride_Bell,
        HIGHHAT_COW_BELL: constant_ABC_HH_Cow_Bell,
        HIGHHAT_CRASH: constant_ABC_HH_Crash,
        HIGHHAT_STACKER: constant_ABC_HH_Stacker,
        HIGHHAT_OPEN: constant_ABC_HH_Open,
        HIGHHAT_CLOSE: constant_ABC_HH_Close,
        HIGHHAT_ACCENT: constant_ABC_HH_Accent,
        HIGHHAT_NORMAL: constant_ABC_HH_Normal,
        HIGHHAT_METRONOME_NORMAL: constant_ABC_HH_Metronome_Normal,
        HIGHHAT_METRONOME_ACCENT: constant_ABC_HH_Metronome_Accent
      }
    }
  },

  watch: { 
    track: {
      handler(newVal, oldVal) { 
        this.noteABC = this.track ? this.track.getHighHatState(this.noteIndex, "ABC") : constant_ABC_OFF;              
      },
      deep: true
    },    
  },
  
  methods: {
    handleLeftClick(event) {
        let newMode = this.noteABC ? constant_ABC_OFF : constant_ABC_HH_Normal
        this.track.setHighHatState(this.noteIndex, newMode, true);  
    },
    handleRightClick(event) {
        noteRightClick(event, 'hh', this.noteIndex)
    },
    handleMouseEnter(event) {
        noteOnMouseEnter(event, 'hh', this.noteIndex)
    }
  },

  template: `
    <div :id="'hi-hat' + noteIndex" class="hi-hat" @click="handleLeftClick" @contextmenu.prevent="handleRightClick" @mouseenter="handleMouseEnter">
        <div v-if="noteABC === constants.HIGHHAT_OFF" class="hh_cross note_part" style="color: #CCC" :id="'hh_cross' + noteIndex"><i class="fa fa-times"></i></div>
        <div v-if="noteABC === constants.HIGHHAT_NORMAL" class="hh_cross note_part" style="color: #000000" :id="'hh_cross' + noteIndex"><i class="fa fa-times"></i></div>
        <div v-if="noteABC === constants.HIGHHAT_RIDE" class="hh_ride note_part" style="color: #000000" :id="'hh_ride' + noteIndex"><i class="fa fa-dot-circle-o"></i></div>
        <div v-if="noteABC === constants.HIGHHAT_RIDE_BELL" class="hh_ride_bell note_part" style="color: #000000" :id="'hh_ride_bell' + noteIndex"><i class="fa fa-bell-o"></i></div>
        <div v-if="noteABC === HIGHHAT_COW_BELL" class="hh_cow_bell note_part" style="color: #000000" :id="'hh_cow_bell' + noteIndex"><i class="fa fa-plus-square-o"></i></div>
        <div v-if="noteABC === HIGHHAT_CRASH" class="hh_crash note_part" style="color: #000000" :id="'hh_crash' + noteIndex"><i class="fa fa-asterisk"></i></div>
        <div v-if="noteABC === HIGHHAT_STACKER" class="hh_stacker note_part" style="color: #000000" :id="'hh_stacker' + noteIndex"><i class="fa fa-bars"></i></div>
        <div v-if="noteABC === HIGHHAT_METRONOME_NORMAL" class="hh_metronome_normal note_part" style="color: #000000" :id="'hh_metronome_normal' + noteIndex"><i class="fa fa-neuter"></i></div>
        <div v-if="noteABC === HIGHHAT_METRONOME_ACCENT" class="hh_metronome_accent note_part" style="color: #000000" :id="'hh_metronome_accent' + noteIndex"><i class="fa fa-map-pin"></i></div>
        <div v-if="noteABC === HIGHHAT_OPEN" class="hh_cross note_part" style="color: #000000" :id="'hh_cross' + noteIndex"><i class="fa fa-times"></i></div>
        <div v-if="noteABC === HIGHHAT_OPEN" class="hh_open note_part" style="color: #000000" :id="'hh_open' + noteIndex"><i class="fa fa-circle-o"></i></div>
        <div v-if="noteABC === HIGHHAT_CLOSE" class="hh_cross note_part" style="color: #000000" :id="'hh_cross' + noteIndex"><i class="fa fa-times"></i></div>
        <div v-if="noteABC === HIGHHAT_CLOSE" class="hh_close note_part" style="color: #000000" :id="'hh_close' + noteIndex"><i class="fa fa-plus"></i></div>
        <div v-if="noteABC === HIGHHAT_ACCENT" class="hh_cross note_part" style="color: #000000" :id="'hh_cross' + noteIndex"><i class="fa fa-times"></i></div>
        <div v-if="noteABC === HIGHHAT_ACCENT" class="hh_accent note_part" style="color: #000000" :id="'hh_accent' + noteIndex"><i class="fa fa-angle-right"></i></div>           
    </div>
  `,
}



