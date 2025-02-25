// Labels
import StickingsLabel from './instruments/sticking_label.js'
import HighHatLabel from './instruments/highhat_label.js'
import Tom1Label from './instruments/tom1_label.js'
import Tom4Label from './instruments/tom4_label.js'
import SnareLabel from './instruments/snare_label.js'
import KickLabel from './instruments/kick_label.js'
import PermutationLabel from './permutation_label.js'
import Options from './options.js'

// Instruments
import Sticking from './instruments/sticking.js'
import HighHat from './instruments/high_hat.js'
import Tom1 from './instruments/tom1.js'
import Tom4 from './instruments/tom4.js'
import Snare from './instruments/snare.js'
import Kick from './instruments/kick.js'

// Controls
import Help from './help.js'
import Stickings from './stickings.js'
import Download from './download.js'
import TimeSignature from './time_signature.js'
import Share from './share.js'
import MetronomeSpeed from './metronome_speed.js'
import Grooves from './grooves.js'

export default {
  data() {
    return {
      components: [
        // Instruments
        { name: 'Sticking' },
        { name: 'HighHat' },
        { name: 'Tom1'},
        { name: 'Tom4'},
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
        { name: 'Options' },        
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
    StickingsLabel, HighHatLabel, Tom1Label, Tom4Label, SnareLabel, KickLabel, PermutationLabel, Options,
    Help, Stickings, Download, TimeSignature, Share, MetronomeSpeed, Grooves
  },
  template: `
    <div class="context-menus">
      <component
        v-for="comp in components"
        :key="comp.name"
        :is="comp.name"
        :drum="comp.instrument"
        :elementId="comp.elementId"
      />
    </div>
  `
}
