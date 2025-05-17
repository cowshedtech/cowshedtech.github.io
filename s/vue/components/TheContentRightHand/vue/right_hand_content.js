import Editable from '../../BaseEditableComponent/vue/editable.js'
import BottomNavigation from '../../TheNavigationBottom/vue/the_navigation_bottom.js'
import HiddenDiscription from '../../DisplayHiddenDescription/vue/hidden_description.js'
import GrooveDBMetaData from '../../DisplayMetadata/vue/groovedb_metadata.js'
import GrooveDBDisplay from '../../DisplayABC/vue/grovedb_display.js'
import TotalPlayTime from '../../Player/vue/totals_display.js'
import MeasureContainer from '../../EditorClickable/vue/editor.js'
import MusicTextFields from '../../EditorMusicTextFields/vue/music_text_fields.js'
import Warnings from '../../DisplayWarnings/vue/warnings.js'
import SheetMusic from '../../DisplaySheetMusic/vue/display.js'
import PermutationOptions from '../../Permutations/vue/options.js'

export default {
  data() {
    return {}
  },
  
  components: {
    Editable, BottomNavigation,HiddenDiscription,GrooveDBMetaData,GrooveDBDisplay, TotalPlayTime, MeasureContainer, MusicTextFields, Warnings, SheetMusic, PermutationOptions
  },
  
  template: `  
    <div id="RightHandContent">
      <PermutationOptions></PermutationOptions>
      <SheetMusic></SheetMusic>

      <div class="nonPrintable">

        <Warnings></Warnings>

        <Editable>
          <MusicTextFields></MusicTextFields>
        </Editable>  
        <Editable>
          <MeasureContainer></MeasureContainer>	
        </Editable>  
        <BottomNavigation></BottomNavigation>
      
        <div id="midiTextOutput"></div>

        <HiddenDiscription></HiddenDiscription>
        <GrooveDBMetaData></GrooveDBMetaData>
        <GrooveDBDisplay></GrooveDBDisplay>
        <TotalPlayTime></TotalPlayTime>	
        
      </div>

    </div>        		
    `
  }
