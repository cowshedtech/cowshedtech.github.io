import HighHatLabelMenu from "./label_menu_highhat.js"
import KickLabelMenu from "./label_menu_kick.js"
import SnareLabelMenu from "./label_menu_snare.js"
import TomLabelMenu from "./label_menu_tom.js"


export default {
  data() {
    return {
      tomsVisible: false,
      labels: [
        { instrument: 'hh', class: 'hh-label', id: 'hh-label', text: 'Hi-hat', visible: true },
        { instrument: 'tom1', class: 'tom-label', id: 'tom1-label', text: 'Tom', visible: false },
        { instrument: 'snare', class: 'snare-label', id: 'snare-label', text: 'Snare', visible: true },
        { instrument: 'tom4', class: 'tom-label', id: 'tom4-label', text: 'Tom', visible: false },
        { instrument: 'kick', class: 'kick-label', id: 'kick-label', text: 'Kick', visible: true },
      ],
      constants: {
        TOM1_ON: constant_ABC_T1_Normal,
        TOM4_ON: constant_ABC_T4_Normal,        
      },
      isHighHatPopupOpen: false,
      isKickPopupOpen: false,
      isSnarePopupOpen: false,
      isTom1PopupOpen: false,
      isTom4PopupOpen: false,
      menuX: 0,
      menuY: 0,      
    }
  },

  props: {
    options: {
      type: Object,
      required: false
    }, 
    measureIndex: {
      type: Number,
      required: true
    }
  },

  components: {
    HighHatLabelMenu, KickLabelMenu, SnareLabelMenu, TomLabelMenu
  },

  mounted() {
    this.tomsVisible = options.areTomsVisible();
    this.removeHandler = options.addChangeHandler(() => {
      this.tomsVisible = options.areTomsVisible();
      this.labels.find(l => l.instrument === 'tom1').visible = this.tomsVisible;
      this.labels.find(l => l.instrument === 'tom4').visible = this.tomsVisible;
    });
  },

  beforeUnmount() {
    if (this.removeHandler) this.removeHandler()
  },

  methods: {
    toggleMenu(instrument) {
      if (instrument === "hh") {
        if (!this.isHighHatPopupOpen) {
          eventBus.$emit('close-all-menus');
          this.isHighHatPopupOpen = true;
        } else {
            this.isHighHatPopupOpen = false;
        } 
      }
      if (instrument === "kick") {
        if (!this.isKickPopupOpen) {
          eventBus.$emit('close-all-menus');
          this.isKickPopupOpen = true;
        } else {
            this.isKickPopupOpen = false;
        } 
      }
      if (instrument === "snare") {
        if (!this.isSnarePopupOpen) {
          eventBus.$emit('close-all-menus');
          this.isSnarePopupOpen = true;
        } else {
            this.isSnarePopupOpen = false;
        } 
      }
      if (instrument === "tom1") {
        if (!this.isTom1PopupOpen) {
          eventBus.$emit('close-all-menus');
          this.isTom1PopupOpen = true;
        } else {
            this.isTom1PopupOpen = false;
        } 
      }
      if (instrument === "tom4") {
        if (!this.isTom4PopupOpen) {
          eventBus.$emit('close-all-menus');
          this.isTom4PopupOpen = true;
        } else {
            this.isTom4PopupOpen = false;
        } 
      }
    },

    closeMenu() {
      this.isHighHatPopupOpen = false;
      this.isKickPopupOpen = false;
      this.isSnarePopupOpen = false;
      this.isTom1PopupOpen = false;
      this.isTom4PopupOpen = false;      
    },

    handleClick(event, instrument) {
      this.menuX = event.clientX - 90;
      this.menuY = event.clientY;
      this.toggleMenu(instrument);      
    }
  },

  created() {
    // Listen for close-all event
    eventBus.$on('close-all-menus', () => {
        this.closeMenu();
    });
  },

  beforeDestroy() {
      // Clean up event listener
      eventBus.$off('close-all-menus');
  },

  template: `
    <div class="line-labels">
      <div v-for="label in labels" 
           :key="label.id"
           :class="label.class"
           :style="{ visibility: label.visible ? 'visible' : 'hidden' }"           
           :id="label.id"
           @click.stop.prevent="handleClick($event, label.instrument)"
           @contextmenu.prevent="handleClick">
        {{ label.text }}
      </div>
      <HighHatLabelMenu
        :measureIndex="measureIndex"
        :is-open="isHighHatPopupOpen" 
        :x="menuX" 
        :y="menuY"
        @close="closeMenu">
      </HighHatLabelMenu>
      <KickLabelMenu
        :measureIndex="measureIndex"
        :is-open="isKickPopupOpen" 
        :x="menuX" 
        :y="menuY"
        @close="closeMenu">
      </KickLabelMenu>
      <SnareLabelMenu
        :measureIndex="measureIndex"
        :is-open="isSnarePopupOpen" 
        :x="menuX" 
        :y="menuY"
        @close="closeMenu">
      </SnareLabelMenu>
      <TomLabelMenu
        :tomIndex="1"
        :midiNormal="constants.TOM1_ON"
        :measureIndex="measureIndex"
        :is-open="isTom1PopupOpen" 
        :x="menuX" 
        :y="menuY"
        @close="closeMenu">
      </TomLabelMenu>
      <TomLabelMenu
        :tomIndex="4"
        :midiNormal="constants.TOM4_ON"
        :measureIndex="measureIndex"
        :is-open="isTom4PopupOpen" 
        :x="menuX" 
        :y="menuY"
        @close="closeMenu">
      </TomLabelMenu>
    </div>    
  `
}