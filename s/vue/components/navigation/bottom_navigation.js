import BottomNavigationButton from './bottom_navigation_button.js'
import PrintButton from '../print/vue/print.js'
import DownloadButton from '../download/vue/button.js'
import ShareButton from '../share/vue/button.js'
import StickingsButton from '../options/vue/stickings_button.js'

export default {
  components: {
    BottomNavigationButton, StickingsButton, DownloadButton, PrintButton, ShareButton
  },
  template: ` 
  <div id="bottomButtonRow" class="fullWidthEle">

    <BottomNavigationButton button-id="clearAllNotesButton" button-text="CLEAR ALL" click-handler="event.preventDefault(); clearAllNotes();">
      <i class="fa fa-trash fa-2x"></i>
    </BottomNavigationButton>
    
    <BottomNavigationButton button-id="showHideTomsButton" button-text="TOMS" click-handler="event.preventDefault(); showHideToms(false, false);">
      <i id="icon-tom1" class="fa fa-circle"></i><i id="icon-tom2" class="fa fa-circle-o"></i><i id="icon-tom3" class="fa fa-circle-o"></i>
    </BottomNavigationButton>
    
    <StickingsButton></StickingsButton>
    
    <DownloadButton></DownloadButton>
      
    <PrintButton></PrintButton>
    
    <ShareButton></ShareButton>
    
  </div>
`
}