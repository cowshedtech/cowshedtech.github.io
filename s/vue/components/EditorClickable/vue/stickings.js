import NoteSpacer from './all_note_spacer.js'
import Sticking from './sticking.js'
import StickingLabelMenu from './sticking_label_menu.js'

export default {

  data() {
    return {
      startNoteIndex: this.track ? (this.measureIndex - 1) * this.track.notesPerMeasure : 0,
      isPopupOpen: false,
      menuX: 0,
      menuY: 0,
    }
  },

  props: {
    track: {
      type: Object,
      required: true
    },
    measureIndex: {
      type: Number,
      required: true
    }
  },

  watch: { 
    track: {
      handler(newVal, oldVal) { 
        this.startNoteIndex = (this.measureIndex - 1) * this.track.notesPerMeasure;        
      },
      deep: true
    },    
  },

  components: {
    NoteSpacer, Sticking, StickingLabelMenu
  },

  methods: {
    toggleMenu() {
      this.isPopupOpen = !this.isPopupOpen;
    },

    closeMenu() {
      this.isPopupOpen = false;
    },

    handleClick(event) {
      this.toggleMenu();
      this.menuX = event.clientX;
      this.menuY = event.clientY;
    }
  },

  template: `
    <div class="stickings-row-container">
        <div class="line-labels">
            <div class="stickings-label" @click="handleClick" @contextmenu.prevent="handleClick">STICKINGS</div>
            <StickingLabelMenu
              :measureIndex="measureIndex"
              :is-open="isPopupOpen" 
              :x="menuX" 
              :y="menuY"
              @close="closeMenu">
            </StickingLabelMenu>
        </div>      
        <div class="music-line-container">
            <div class="notes-container">
                <div class="stickings-container">
                    <div class="opening_note_space"></div>
                        <template v-for="i in track.notesPerMeasure" :key="i">
                            <Sticking :sticking="track.sticking_array" :noteIndex="startNoteIndex + (i - 1)"  />
                            <NoteSpacer :track="track" :noteIndex="i" />
                        </template>
                    </div>
                </div>   
            </div>
            <slot></slot>
        </div>
    </div>
    `
}