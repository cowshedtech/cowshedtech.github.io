import SnareFlam from './snare_flam.js'
import SnareDrag from './snare_drag.js'
import Menu from "./snare_menu.js"


export default {
  props: {
    track: {
      type: Object,
      required: true
    },
    noteIndex: {
      type: Number,
      required: true
    }
  },

  inject: ['midiPlayer'],

  data() {
    return {
      noteABC: editor.track ? editor.track.getInstrumentNote(Instruments.SNARE, this.noteIndex) : constant_ABC_OFF,
      isPopupOpen: false,
      menuX: 0,
      menuY: 0,
    }
  },

  watch: { 
    track: {
      handler(newVal, oldVal) { 
        this.noteABC = editor.track ? editor.track.getInstrumentNote(Instruments.SNARE, this.noteIndex) : constant_ABC_OFF
      },
      deep: true
    },    
  },

  computed: {
    noteConfig() {
      return {
        [constant_ABC_OFF]: { 
          primary: { class: 'snare_circle', style: 'color: #FFFFFF; borderColor: #999999' }
        },
        [constant_ABC_SN_Normal]: { 
          primary: { class: 'snare_circle', style: 'background-color: #000000; color: #000000; borderColor: #999999' },
          midiNote: constant_OUR_MIDI_SNARE_NORMAL
        },
        [constant_ABC_SN_Flam]: { 
          primary: { class: 'snare_flam', style: 'color: #000000' },
          midiNote: constant_OUR_MIDI_SNARE_FLAM
        },
        [constant_ABC_SN_Drag]: { 
          primary: { class: 'snare_drag', style: 'color: #000000' },
          midiNote: constant_OUR_MIDI_SNARE_DRAG
        },
        [constant_ABC_SN_Ghost]: { 
          primary: { 
            class: 'snare_ghost', 
            style: 'color: #000000',
            content: '(<i class="fa fa-circle dot_in_snare_ghost_note"></i>)'
          },
          midiNote: constant_OUR_MIDI_SNARE_GHOST
        },
        [constant_ABC_SN_Accent]: { 
          primary: { class: 'snare_circle', style: 'background-color: #000000; borderColor: #999999' },
          secondary: { class: 'snare_accent', style: 'color: #FFFFFF', content: '<i class="fa fa-chevron-right"></i>' },
          midiNote: constant_OUR_MIDI_SNARE_ACCENT
        },
        [constant_ABC_SN_XStick]: { 
          primary: { class: 'snare_xstick', style: 'color: #000000', content: '<i class="fa fa-times"></i>' },
          midiNote: constant_OUR_MIDI_SNARE_XSTICK
        },
        [constant_ABC_SN_Buzz]: { 
          primary: { class: 'snare_buzz', style: 'color: #000000', content: '<i class="fa fa-bars"></i>' },
          midiNote: constant_OUR_MIDI_SNARE_BUZZ
        }
      }
    },
    currentNoteConfig() {
      return this.noteConfig[this.noteABC]
    }
  },
  
  methods: {
    handleLeftClick(event) {
        let newMode = this.noteABC ? constant_ABC_OFF : constant_ABC_SN_Accent
        if (this.midiPlayer && newMode === constant_ABC_SN_Accent) this.midiPlayer.playSingleNote(constant_OUR_MIDI_SNARE_ACCENT);                
        editor.track.setInstrumentNote(Instruments.SNARE, this.noteIndex, newMode);        
    },
    handleRightClick(event) {
      eventBus.$emit('close-all-menus');
      this.menuX = event.clientX;
      this.menuY = event.clientY;
      this.isPopupOpen = true;
    },
    handleMouseEnter(event) {
      let action = null;
      if (event.ctrlKey) action = "on";
      if (event.altKey) action = "off";  
      if (action)
        editor.track.setInstrumentNote(Instruments.SNARE, this.noteIndex, action == "off" ? constant_ABC_OFF : constant_ABC_SN_Accent);    
    },
    handleAction(action) {
      editor.track.setInstrumentNote(Instruments.SNARE, this.noteIndex, action);  
      if (this.midiPlayer) {
        let note = this.noteConfig[action]?.midiNote;        
        if (note) this.midiPlayer.playSingleNote(note);                
      }            
      this.isPopupOpen = false;
    }
  },

  created() {
    // Listen for close-all event
    eventBus.$on('close-all-menus', () => {
        this.isPopupOpen = false;
    });
  },

  beforeDestroy() {
      // Clean up event listener
      eventBus.$off('close-all-menus');
  },

  components: {
    Menu, SnareFlam
  },

  template: `
    <div :id="'snare' + noteIndex" class="snare" @click.stop.prevent="handleLeftClick" @contextmenu.prevent="handleRightClick" @mouseenter="handleMouseEnter">
      <template v-if="currentNoteConfig">
        <template v-if="currentNoteConfig.primary">
          <div :class="[currentNoteConfig.primary.class, 'note_part']" :style="currentNoteConfig.primary.style" :id="currentNoteConfig.primary.class + noteIndex" v-html="currentNoteConfig.primary.content"></div>
        </template>
        <template v-if="currentNoteConfig.secondary">
          <div :class="[currentNoteConfig.secondary.class, 'note_part']" :style="currentNoteConfig.secondary.style" :id="currentNoteConfig.secondary.class + noteIndex" v-html="currentNoteConfig.secondary.content"></div>
        </template>
      </template>
      <Menu
        :is-open="isPopupOpen" 
        :x="menuX" 
        :y="menuY"
        @action="handleAction">
      </Menu>
    </div>
  `
}