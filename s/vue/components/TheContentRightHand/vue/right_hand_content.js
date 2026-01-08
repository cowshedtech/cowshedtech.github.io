import Editable from '../../BaseEditableComponent/vue/editable.js'
import BottomNavigation from '../../TheNavigationBottom/vue/the_navigation_bottom.js'
import HiddenDiscription from '../../DisplayHiddenDescription/vue/hidden_description.js'
import GrooveDBMetaData from '../../DisplayMetadata/vue/groovedb_metadata.js'
import GrooveDBDisplay from '../../DisplayABC/vue/grovedb_display.js'
import TotalPlayTime from '../../Player/vue/totals_display.js'
import DeployInfo from '../../Deploy/vue/deploy_info.js'
import Editor from '../../EditorClickable/vue/editor.js'
import Warnings from '../../DisplayWarnings/vue/warnings.js'
import SheetMusic from '../../DisplaySheetMusic/vue/display.js'
import PermutationOptions from '../../Permutations/vue/options.js'

export default {
  props: {
    track: {
      type: Object,
      required: false
    }
  },
  data() {
    return {}
  },
  
  components: {
    Editable, BottomNavigation,HiddenDiscription,GrooveDBMetaData,GrooveDBDisplay, TotalPlayTime, DeployInfo, Editor, Warnings, SheetMusic, PermutationOptions
  },
  
  template: `  
    <div id="RightHandContent">
      <PermutationOptions></PermutationOptions>
      <SheetMusic></SheetMusic>

      <div class="nonPrintable">

        <Warnings></Warnings>

        <Editable>
          <Editor></Editor>	
        </Editable>  
        <BottomNavigation></BottomNavigation>
      
        <div id="midiTextOutput"></div>

        <HiddenDiscription></HiddenDiscription>
        <GrooveDBMetaData></GrooveDBMetaData>
        <GrooveDBDisplay></GrooveDBDisplay>
        <TotalPlayTime></TotalPlayTime>	
        <DeployInfo></DeployInfo>
        
      </div>

    </div>        		
    `
  }
