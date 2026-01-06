import BottomNavigationButton from '../../BaseButtonNavigationButton/vue/base_button_bottom_navigation.js'

export default {
  components: {
    BottomNavigationButton
  },

  inject: ['options'],

  methods: {
    toggleToms() {
      this.options.setTomsVisible(!this.options.areTomsVisible())
    }
  },

  template: `
    <BottomNavigationButton button-id="showHideTomsButton" button-text="TOMS" @click="toggleToms">
      <i id="icon-tom1" class="fa fa-circle"></i><i id="icon-tom2" class="fa fa-circle-o"></i><i id="icon-tom3" class="fa fa-circle-o"></i>
    </BottomNavigationButton>`
}