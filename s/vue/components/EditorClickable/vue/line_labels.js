import HighHatLabelMenu from "./label_menu_highhat.js"

export default {
  data() {
    return {
      labels: [
        { class: 'hh-label', id: 'hh-label', text: 'Hi-hat' },
        { class: 'tom-label', id: 'tom1-label', text: 'Tom' },
        { class: 'snare-label', id: 'snare-label', text: 'Snare' },
        { class: 'tom-label', id: 'tom4-label', text: 'Tom' },
        { class: 'kick-label', id: 'kick-label', text: 'Kick' }
      ],
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

  // methods: {
  //   handleClick(event) {
  //     const idParts = event.srcElement.id.split('-')
  //     const idBeforeHyphen = idParts[0]
  //     noteLabelClick(event, idBeforeHyphen, this.measureIndex)
  //   }
  // },

  components: {
    HighHatLabelMenu
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
    <div class="line-labels">
      <div v-for="label in labels"
           :key="label.id"
           :class="label.class"
           :id="label.id"
           @click="handleClick"
           @contextmenu.prevent="handleClick">
        {{ label.text }}
      </div>
      <HighHatLabelMenu
        :measureIndex="measureIndex"
        :is-open="isPopupOpen" 
        :x="menuX" 
        :y="menuY"
        @close="closeMenu">
      </HighHatLabelMenu>
    </div>    
  `
}