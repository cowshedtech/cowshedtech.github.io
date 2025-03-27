import BottomNavigationButton from './bottom_navigation_button.js'
import PrintButton from '../print/vue/print.js'
import DownloadButton from '../download/vue/button.js'
import ShareButton from '../share/vue/button.js'

export default {
  components: {
    BottomNavigationButton, DownloadButton, PrintButton, ShareButton
  },
  methods: {
    open() { 
      console.log(`parent`)
    },
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
    
    <DownloadButton></DownloadButton>
      
    <PrintButton></PrintButton>
    
    <ShareButton @open-share-popup="open"></ShareButton>
    
  </div>
`
} 


{/* <BottomNavigationButton button-class=" grooveDB_hidden shareSaveButton" button-id="shareButton" button-text="SHARE" click-handler="event.preventDefault(); show_FullURLPopup();">
      <i class="fa fa-share fa-2x"></i>
    </BottomNavigationButton> */}