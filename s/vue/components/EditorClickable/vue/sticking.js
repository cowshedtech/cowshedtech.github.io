export default {
  props: {
    noteIndex: {
      type: Number,
      required: true
    }
  },

  inject: ['track'],

  data() {
    return {
      constants: {
        STICK_R: constant_ABC_STICK_R,
        STICK_L: constant_ABC_STICK_L,
        STICK_BOTH: constant_ABC_STICK_BOTH,
        STICK_COUNT: constant_ABC_STICK_COUNT,
        STICK_OFF: constant_ABC_OFF
      }
    }
  },

  computed: {
    noteABC() {
      this.track && this.track.version;
      return this.track ? this.track.getInstrumentNote(Instruments.STICKING, this.noteIndex) : constant_ABC_OFF;
    },
    noteCountState() {
      this.track && this.track.version;
      return (this.noteIndex || this.noteIndex == 0) ? this.figureOutStickingCountForNote() : ''
    }
  },

  methods: {
    figureOutStickingCountForNote(index2) {

      let notes_per_measure = this.track.notesPerMeasure;
      let sub_division = this.track.timeDivision;
      let time_sig_bottom = this.track.noteValue;
      let index = this.noteIndex;

      // figure out the count state by looking at the id and the subdivision
      var note_index = index % notes_per_measure;
      var new_state = 0;
      var implied_sub_division = sub_division * (4 / time_sig_bottom);

      if (implied_sub_division === 4) {
        new_state = note_index + 1;   // 1,2,3,4,5, etc.
      } else if (implied_sub_division === 8) {
        new_state = (note_index % 2 === 0) ? Math.floor(note_index / 2) + 1 : "&";
      } else if (implied_sub_division === 12) {
        new_state = (note_index % 3 === 0) ? Math.floor(note_index / 3) + 1 : (note_index % 3 === 1 ? "&" : "a");
      } else if (implied_sub_division === 24) {
        new_state = (note_index % 3 === 0) ? Math.floor(note_index / 6) + 1 : (note_index % 3 === 1 ? "&" : "a");
      } else if (implied_sub_division === 48) {
        new_state = (note_index % 3 === 0) ? Math.floor(note_index / 12) + 1 : (note_index % 3 === 1 ? "&" : "a");
      } else {
        var whole_note_interval = implied_sub_division / 4;
        if (note_index % 4 === 0) {
          new_state = Math.floor(note_index / whole_note_interval) + 1;  // 1,1,2,2,3,3,4,4,5,5, etc.
        } else {
          new_state = (note_index % 4 === 1) ? "e" : (note_index % 4 === 2 ? "&" : "a");
        }
      }

      return new_state;
    },
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
        this.track.setInstrumentNote(Instruments.STICKING, this.noteIndex, new_state);                
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
        <div v-if="noteABC === constants.STICK_COUNT" class="sticking_count note_part" style="color:rgb(36, 132, 192)"  :id="'sticking_count' + noteIndex" @click.stop.prevent="handleLeftClick" @contextmenu.prevent="handleRightClick" @mouseenter="handleMouseEnter">{{ noteCountState }}</div>
    </div>
  `,
}