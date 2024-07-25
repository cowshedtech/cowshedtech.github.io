import BottomNavigation from './components/bottom_navigation.js'
import HiddenDiscription from './components/hidden_description.js'
import GrooveDBMetaData from './components/groovedb_metadata.js'
import GrooveDBDisplay from './components/grovedb_display.js'
import TotalPlayTime from './components/total_play_time.js'
import MeasureContainer from './components/measure_container.js'
import MusicTextFields from './components/music_text_fields.js'
import Warnings from './components/warnings.js'
import SheetMusic from './components/sheet_music.js'
import PermutationOptions from './components/permutation_options.js'

export default {
  data() {
    return {}
  },
  components: {
    BottomNavigation,HiddenDiscription,GrooveDBMetaData,GrooveDBDisplay, TotalPlayTime, MeasureContainer, MusicTextFields, Warnings, SheetMusic, PermutationOptions
  },
  template: `  

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
      
    </div>`
  }
