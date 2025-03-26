import BottomNavigationButton from './bottom_navigation_button.js'
import PrintButton from '../print/vue/print.js'

export default {
  components: {
    BottomNavigationButton, PrintButton
  },
  data() {
    return { }
  },
  template: `
  <div id="bottomButtonRow" class="fullWidthEle">

    <BottomNavigationButton button-id="clearAllNotesButton" button-text="CLEAR ALL" click-handler="event.preventDefault(); clearAllNotes();">
      <i class="fa fa-trash fa-2x"></i>
    </BottomNavigationButton>
    
    <BottomNavigationButton button-id="showHideTomsButton" button-text="TOMS" click-handler="event.preventDefault(); showHideToms(false, false);">
      <i id="icon-tom1" class="fa fa-circle"></i><i id="icon-tom2" class="fa fa-circle-o"></i><i id="icon-tom3" class="fa fa-circle-o"></i>
    </BottomNavigationButton>
    
    <BottomNavigationButton button-class=" grooveDB_hidden pageBottomButton" button-id="stickingsButton" button-text="STICKINGS" click-handler="stickingsAnchorClick();"></BottomNavigationButton>
    
    <BottomNavigationButton button-class=" grooveDB_hidden pageBottomButton" button-id="downloadButton" button-text="DOWNLOAD" click-handler="downloadAnchorClick();">
      <span class="bottomButtonIcon"><i class="fa fa-download fa-2x"></i></span>
    </BottomNavigationButton>
      
    <PrintButton></PrintButton>
    
    <BottomNavigationButton button-class=" grooveDB_hidden shareSaveButton" button-id="shareButton" button-text="SHARE" click-handler="event.preventDefault(); show_FullURLPopup();">
      <i class="fa fa-share fa-2x"></i>
    </BottomNavigationButton>
    
  </div>
`
} 


{/* <BottomNavigationButton button-class=" grooveDB_hidden pageBottomButton" button-id="printButton" button-text="PRINT" click-handler="printMusic();">
  <i class="fa fa-print fa-2x"></i>
</BottomNavigationButton> */}