import NoteSpacer from './all_note_spacer.js'
import Sticking from './sticking.js'
import StickingLabelMenu from './sticking_label_menu.js'

export default {

  data() {
    return {
      isPopupOpen: false,
      menuX: 0,
      menuY: 0,
    }
  },

  props: {
    measureIndex: {
      type: Number,
      required: true
    }
  },

  components: {
    NoteSpacer, Sticking, StickingLabelMenu
  },

  setup(props) {
    const { notesPerMeasure, numBeats, noteValue } = editor.track;
    const groupSize = noteGroupingSize(notesPerMeasure, numBeats, noteValue)
    const startNoteIndex = (props.measureIndex - 1) * notesPerMeasure;
    return { startNoteIndex, notesPerMeasure, groupSize }
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
                        <template v-for="i in notesPerMeasure" :key="i">
                            <Sticking :noteIndex="startNoteIndex + (i - 1)"  />
                            <NoteSpacer :noteIndex="i" />
                        </template>
                    </div>
                </div>   
            </div>
            <slot></slot>
        </div>
    </div>
    `
}