import RightHandContent from './components/right_hand_content.js'
import MetronomeMenu from './components/metronome_menu.js'
import Sticking from './components/context_menus/sticking.js'
import HighHat from './components/context_menus/high_hat.js'
import Tom1 from './components/context_menus/tom1.js'
import Tom4 from './components/context_menus/tom4.js'
import Snare from './components/context_menus/snare.js'
import Kick from './components/context_menus/kick.js'
import StickingsLabel from './components/context_menus/sticking_label.js'
import HighHatLabel from './components/context_menus/highhat_label.js'
import Tom1Label from './components/context_menus/tom1_label.js'
import Tom4Label from './components/context_menus/tom4_label.js'
import SnareLabel from './components/context_menus/snare_label.js'
import KickLabel from './components/context_menus/kick_label.js'
import PermutationLabel from './components/context_menus/permutation_label.js'
import Help from './components/context_menus/help.js'
import Stickings from './components/context_menus/Stickings.js'
import Download from './components/context_menus/Download.js'
import TimeSignature from './components/context_menus/time_signature.js'
import Share from './components/context_menus/share.js'
import MetronomeSpeed from './components/context_menus/metronome_speed.js'


export default {
  data() {
    return {}
  },
  components: {
    RightHandContent, MetronomeMenu, Sticking, HighHat, Tom1, Tom4, Snare, Kick, StickingsLabel, HighHatLabel, Tom1Label, Tom4Label, SnareLabel, KickLabel, PermutationLabel, Help, Stickings, Download, TimeSignature, Share, MetronomeSpeed
  },
  template: `
    <RightHandContent></RightHandContent>		
    <MetronomeMenu></MetronomeMenu>
	<Sticking></Sticking>
	<HighHat></HighHat>
	<Tom1></Tom1>
	<Tom4></Tom4>
	<Snare></Snare>
	<Kick></Kick>
	<StickingsLabel></StickingsLabel>
	<HighHatLabel></HighHatLabel>
	<Tom1Label></Tom1Label>
	<Tom4Label></Tom4Label>
	<SnareLabel></SnareLabel>
	<KickLabel></KickLabel>
	<PermutationLabel></PermutationLabel>
	<Help></Help>
	<Stickings></Stickings>
	<Download></Download>
	<TimeSignature></TimeSignature>
	<Share></Share>
	<MetronomeSpeed></MetronomeSpeed>
    <div id="grooveListWrapper">
		<script>
			document.write(grooves.getGroovesAsHTML());
		</script>
	</div>
	`
  }
