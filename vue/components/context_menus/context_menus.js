// Labels
import StickingsLabel from './sticking_label.js'
import HighHatLabel from './highhat_label.js'
import Tom1Label from './tom1_label.js'
import Tom4Label from './tom4_label.js'
import SnareLabel from './snare_label.js'
import KickLabel from './kick_label.js'
import PermutationLabel from './permutation_label.js'

// Instruments
import Sticking from './sticking.js'
import HighHat from './high_hat.js'
import Tom from './tom.js'
import Snare from './snare.js'
import Kick from './kick.js'

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
        { name: 'Tom', instrument: 'tom1', elementId: 'tom1ContextMenu' },
        { name: 'Tom', instrument: 'tom4', elementId: 'tom4ContextMenu' },
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
    Sticking, HighHat, Tom, Snare, Kick,
    StickingsLabel, HighHatLabel, Tom1Label, Tom4Label, SnareLabel, KickLabel, PermutationLabel,
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
