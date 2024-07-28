import BottomNavigation from './bottom_navigation.js'
import HiddenDiscription from './hidden_description.js'
import GrooveDBMetaData from './groovedb_metadata.js'
import GrooveDBDisplay from './grovedb_display.js'
import TotalPlayTime from './total_play_time.js'
import MeasureContainer from './measure_container.js'
import MusicTextFields from './music_text_fields.js'
import Warnings from './warnings.js'
import SheetMusic from './sheet_music.js'
import PermutationOptions from './permutation_options.js'

export default {
  data() {
    return {}
  },
  components: {
    BottomNavigation,HiddenDiscription,GrooveDBMetaData,GrooveDBDisplay, TotalPlayTime, MeasureContainer, MusicTextFields, Warnings, SheetMusic, PermutationOptions
  },
  template: `  
    <div id="RightHandContent">
      <span>hello</span>
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
