import HighHatLabelMenu from "./label_menu_highhat.js"
import SnareLabelMenu from "./label_menu_snare.js"

export default {
  data() {
    return {
      labels: [
        { instrument: 'hh', class: 'hh-label', id: 'hh-label', text: 'Hi-hat' },
        { instrument: 'tom', class: 'tom-label', id: 'tom1-label', text: 'Tom' },
        { instrument: 'snare', class: 'snare-label', id: 'snare-label', text: 'Snare' },
        { instrument: 'tom', class: 'tom-label', id: 'tom4-label', text: 'Tom' },
        { instrument: 'kick', class: 'kick-label', id: 'kick-label', text: 'Kick' }
      ],
      isHighHatPopupOpen: false,
      isSnarePopupOpen: false,
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
    HighHatLabelMenu, SnareLabelMenu
  },

  methods: {
    toggleMenu(instrument) {
      if (instrument === "hh") {this.isHighHatPopupOpen = !this.isHighHatPopupOpen;
      if (instrument === "snare") this.isSnarePopupOpen = !this.isSnarePopupOpen;
    },

    closeMenu() {
      this.isHighHatPopupOpen = false;
      this.isSnarePopupOpen = false;
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
      <SnareLabelMenu
        :measureIndex="measureIndex"
        :is-open="isSnarePopupOpen" 
        :x="menuX" 
        :y="menuY"
        @close="closeMenu">
      </SnareLabelMenu>
    </div>    
  `
}