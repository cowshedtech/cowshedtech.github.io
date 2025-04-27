import BottomNavigationButton from '../../BaseButtonNavigationButton/vue/base_button_bottom_navigation.js'

export default {
  data() {
    return {
        isViewMode : options ? options.isViewMode() : true            
    }
  },

  components: {
    BottomNavigationButton
  },

  methods: {
    toggleToms() {
        options.setTomsVisible(!options.areTomsVisible());
    },    
  },

  mounted() {
      eventBus.$on('options-updated', () => {
        this.isViewMode = options.isViewMode();     
      });	
  },

  beforeUnmount() {
    eventBus.$off('options-updated');
  },

  template: `
    <BottomNavigationButton v-if="isViewMode === false" button-id="showHideTomsButton" button-text="TOMS" @click="toggleToms">
      <i id="icon-tom1" class="fa fa-circle"></i><i id="icon-tom2" class="fa fa-circle-o"></i><i id="icon-tom3" class="fa fa-circle-o"></i>
    </BottomNavigationButton>`
}