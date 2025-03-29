import BottomNavigationButton from './bottom_navigation_button.js'
import PrintButton from '../print/vue/print.js'
import DownloadButton from '../download/vue/button.js'
import ShareButton from '../share/vue/button.js'
import StickingsButton from '../options/vue/stickings_button.js'
import TomsButton from '../options/vue/toms_button.js'
import ClearButton from '../clear/vue/button.js'

export default {
  components: {
    BottomNavigationButton, StickingsButton, DownloadButton, PrintButton, ShareButton, TomsButton, ClearButton
  },
  template: ` 
  <div id="bottomButtonRow" class="fullWidthEle">

    <ClearButton></ClearButton>
    <TomsButton></TomsButton>
    <StickingsButton></StickingsButton>
    <DownloadButton></DownloadButton>
    <PrintButton></PrintButton>
    <ShareButton></ShareButton>
    
  </div>
`
}