import NoteSpacer from './all_note_spacer.js'
import Sticking from './sticking.js'
import StickingLabelMenu from './sticking_label_menu.js'

export default {

  data() {
    return {
      stickingVisible: this.options ? this.options.stickingsVisible : false,
      startNoteIndex: this.track ? (this.measureIndex - 1) * this.track.notesPerMeasure : 0,
      isPopupOpen: false,
      menuX: 0,
      menuY: 0,
    }
  },

  inject: ['options'],

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

  watch: {
    'options.stickingsVisible': function(newVal) {
      if (typeof newVal === 'boolean') {
        this.stickingVisible = newVal;
      }
    }
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
            <div class="stickings-label" :style="{ display: stickingVisible ? 'block' : 'none' }" @click.stop.prevent="handleClick" @contextmenu.prevent="handleClick">STICKINGS</div>
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
                <div class="stickings-container" :style="{ display: stickingVisible ? 'block' : 'none' }">
                    <div class="opening_note_space"></div>
                    <template v-for="i in track.notesPerMeasure" :key="i">
                        <Sticking :track="track" :noteIndex="startNoteIndex + (i - 1)"  />
                        <NoteSpacer :track="track" :noteIndex="i" />
                    </template>
                </div>   
            </div>
            <slot></slot>
        </div>
    </div>
    `
}