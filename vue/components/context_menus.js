import Sticking from './context_menus/sticking.js'
import HighHat from './context_menus/high_hat.js'
import Tom1 from './context_menus/tom1.js'
import Tom4 from './context_menus/tom4.js'
import Snare from './context_menus/snare.js'
import Kick from './context_menus/kick.js'
import StickingsLabel from './context_menus/sticking_label.js'
import HighHatLabel from './context_menus/highhat_label.js'
import Tom1Label from './context_menus/tom1_label.js'
import Tom4Label from './context_menus/tom4_label.js'
import SnareLabel from './context_menus/snare_label.js'
import KickLabel from './context_menus/kick_label.js'
import PermutationLabel from './context_menus/permutation_label.js'
import Help from './context_menus/help.js'
import Stickings from './context_menus/Stickings.js'
import Download from './context_menus/download.js'
import TimeSignature from './context_menus/time_signature.js'
import Share from './context_menus/share.js'
import MetronomeSpeed from './context_menus/metronome_speed.js'

export default {
  data() {
    return {}
  },
  components: {
    Sticking, HighHat, Tom1, Tom4, Snare, Kick, StickingsLabel, HighHatLabel, Tom1Label, Tom4Label, SnareLabel, KickLabel, PermutationLabel, Help, Stickings, Download, TimeSignature, Share, MetronomeSpeed
  },
  template: `  
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
    `
  }
