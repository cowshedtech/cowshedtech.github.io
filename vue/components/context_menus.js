// Labels
import StickingsLabel from './context_menus/sticking_label.js'
import HighHatLabel from './context_menus/highhat_label.js'
import Tom1Label from './context_menus/tom1_label.js'
import Tom4Label from './context_menus/tom4_label.js'
import SnareLabel from './context_menus/snare_label.js'
import KickLabel from './context_menus/kick_label.js'
import PermutationLabel from './context_menus/permutation_label.js'

// Instruments
import Sticking from './context_menus/sticking.js'
import HighHat from './context_menus/high_hat.js'
import Tom1 from './context_menus/tom1.js'
import Tom4 from './context_menus/tom4.js'
import Snare from './context_menus/snare.js'
import Kick from './context_menus/kick.js'

// Controls
import Help from './context_menus/help.js'
import Stickings from './context_menus/stickings.js'
import Download from './context_menus/download.js'
import TimeSignature from './context_menus/time_signature.js'
import Share from './context_menus/share.js'
import MetronomeSpeed from './context_menus/metronome_speed.js'
import Grooves from './context_menus/grooves.js'

export default {
  data() {
    return {
      components: [
        // Instruments
        { name: 'Sticking' },
        { name: 'HighHat' },
        { name: 'Tom1' },
        { name: 'Tom4' },
        { name: 'Snare' },
        { name: 'Kick' },
        // Labels
        { name: 'StickingsLabel' },
        { name: 'HighHatLabel' },
        { name: 'Tom1Label' },
        { name: 'Tom4Label' },
        { name: 'SnareLabel' },
        { name: 'KickLabel' },
        { name: 'PermutationLabel' },
        // Controls
        { name: 'Help' },
        { name: 'Stickings' },
        { name: 'Download' },
        { name: 'TimeSignature' },
        { name: 'Share' },
        { name: 'Grooves' },
        { name: 'MetronomeSpeed' }
      ]
    }
  },
  components: {
    Sticking, HighHat, Tom1, Tom4, Snare, Kick,
    StickingsLabel, HighHatLabel, Tom1Label, Tom4Label, SnareLabel, KickLabel, PermutationLabel,
    Help, Stickings, Download, TimeSignature, Share, MetronomeSpeed, Grooves
  },
  template: `
    <div class="context-menus">
      <component
        v-for="comp in components"
        :key="comp.name"
        :is="comp.name"
      />
    </div>
  `
}
