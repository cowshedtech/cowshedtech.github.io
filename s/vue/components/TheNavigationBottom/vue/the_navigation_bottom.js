import PrintButton from '../../Print/vue/print.js'
import DownloadButton from '../../Download/vue/button.js'
import ShareButton from '../../Share/vue/button.js'
import StickingsButton from '../../Options/vue/stickings_button.js'
import TomsButton from '../../Options/vue/toms_button.js'
import ClearButton from '../../Clear/vue/button.js'

export default {
  components: {
    StickingsButton, DownloadButton, PrintButton, ShareButton, TomsButton, ClearButton
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