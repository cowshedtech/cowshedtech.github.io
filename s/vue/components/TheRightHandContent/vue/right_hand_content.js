import BottomNavigation from '../../TheNavigationBottom/vue/the_navigation_bottom.js'
import HiddenDiscription from '../../hidden_description.js'
import GrooveDBMetaData from '../../groovedb_metadata.js'
import GrooveDBDisplay from '../../DisplayABC/vue/grovedb_display.js'
import TotalPlayTime from '../../player/vue/totals_display.js'
import MeasureContainer from '../../EditorClickable/vue/measure_container.js'
import MusicTextFields from '../../EditorMusicTextFields/vue/music_text_fields.js'
import Warnings from '../../warnings.js'
import SheetMusic from '../../sheet_music/vue/display.js'
import PermutationOptions from '../../permutations/vue/options.js'

export default {
  data() {
    return {}
  },
  components: {
    BottomNavigation,HiddenDiscription,GrooveDBMetaData,GrooveDBDisplay, TotalPlayTime, MeasureContainer, MusicTextFields, Warnings, SheetMusic, PermutationOptions
  },
  template: `  
    <div id="RightHandContent">
      <PermutationOptions></PermutationOptions>
      <SheetMusic></SheetMusic>

      <div class="nonPrintable">

        <Warnings></Warnings>

        <MusicTextFields></MusicTextFields>
        <MeasureContainer></MeasureContainer>	
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
