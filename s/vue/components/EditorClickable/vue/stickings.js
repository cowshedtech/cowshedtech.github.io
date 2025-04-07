import NoteSpacer from './all_note_spacer.js'
import Sticking from './sticking.js'
import StickingLabelMenu from './sticking_label_menu.js'

export default {

  data() {
    return {
      trackData: editor.track ? editor.track : null,
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
      handler(newVal, oldVal) { // watch it
        this.trackData = editor.track;
        console.log('stickings change [' + this.trackData.title + ']' )
        console.log('stickings ' + this.trackData.notesPerMeasure)
        this.$forceUpdate(); 
      },
      deep: true
    },    
  },

  components: {
    NoteSpacer, Sticking, StickingLabelMenu
  },

  setup(props) {
    const { notesPerMeasure, numBeats, noteValue } = editor.track;
    const startNoteIndex = (props.measureIndex - 1) * notesPerMeasure;
    return { startNoteIndex }
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
                        <template v-for="i in trackData.notesPerMeasure" :key="i">
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