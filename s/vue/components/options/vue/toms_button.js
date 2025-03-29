import BottomNavigationButton from '../../navigation/bottom_navigation_button.js'

export default {
  components: {
    BottomNavigationButton
  },

  template: `
    <BottomNavigationButton button-id="showHideTomsButton" button-text="TOMS" click-handler="event.preventDefault(); showHideToms(false, false);">
      <i id="icon-tom1" class="fa fa-circle"></i><i id="icon-tom2" class="fa fa-circle-o"></i><i id="icon-tom3" class="fa fa-circle-o"></i>
    </BottomNavigationButton>`
}