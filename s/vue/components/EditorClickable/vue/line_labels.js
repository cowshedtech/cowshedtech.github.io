import HighHatLabelMenu from "./label_menu_highhat.js"
import KickLabelMenu from "./label_menu_kick.js"
import SnareLabelMenu from "./label_menu_snare.js"
import TomLabelMenu from "./label_menu_tom.js"

export default {
  data() {
    return {
      labels: [
        { instrument: 'hh', class: 'hh-label', id: 'hh-label', text: 'Hi-hat' },
        { instrument: 'tom1', class: 'tom-label', id: 'tom1-label', text: 'Tom' },
        { instrument: 'snare', class: 'snare-label', id: 'snare-label', text: 'Snare' },
        { instrument: 'tom4', class: 'tom-label', id: 'tom4-label', text: 'Tom' },
        { instrument: 'kick', class: 'kick-label', id: 'kick-label', text: 'Kick' }
      ],
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
    measureIndex: {
      type: Number,
      required: true
    }
  },

  components: {
    HighHatLabelMenu, KickLabelMenu, SnareLabelMenu, TomLabelMenu
  },

  methods: {
    toggleMenu(instrument) {
      if (instrument === "hh") this.isHighHatPopupOpen = !this.isHighHatPopupOpen;
      if (instrument === "kick") this.isKickPopupOpen = !this.isKickPopupOpen;
      if (instrument === "snare") this.isSnarePopupOpen = !this.isSnarePopupOpen;
      if (instrument === "tom1") this.isTom1PopupOpen = !this.isTom1PopupOpen;
      if (instrument === "tom4") this.isTom4PopupOpen = !this.isTom4PopupOpen;
    },

    closeMenu() {
      this.isHighHatPopupOpen = false;
      this.isKickPopupOpen = false;
      this.isSnarePopupOpen = false;
      this.isTom1PopupOpen = false;
      this.isTom4PopupOpen = false;      
    },

    handleClick(event, instrument) {
      this.menuX = event.clientX;
      this.menuY = event.clientY;
      this.toggleMenu(instrument);      
    }
  },

  template: `
    <div class="line-labels">
      <div v-for="label in labels"
           :key="label.id"
           :class="label.class"
           :id="label.id"
           @click="handleClick($event, label.instrument)"
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
        :measureIndex="measureIndex"
        :is-open="isTom1PopupOpen" 
        :x="menuX" 
        :y="menuY"
        @close="closeMenu">
      </TomLabelMenu>
      <TomLabelMenu
        :tomIndex="2"
        :measureIndex="measureIndex"
        :is-open="isTom4PopupOpen" 
        :x="menuX" 
        :y="menuY"
        @close="closeMenu">
      </TomLabelMenu>
    </div>    
  `
}