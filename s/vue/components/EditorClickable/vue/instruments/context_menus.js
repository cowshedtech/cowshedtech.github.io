// Labels
import StickingsLabel from './sticking_label.js'
import HighHatLabel from './highhat_label.js'
import Tom1Label from './tom1_label.js'
import Tom4Label from './tom4_label.js'
import SnareLabel from './snare_label.js'
import KickLabel from './kick_label.js'

// Instruments
import Sticking from './sticking.js'
import HighHat from './high_hat.js'
import Tom1 from './tom1.js'
import Tom4 from './tom4.js'
import Snare from './snare.js'
import Kick from './kick.js'

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
      ]
    }
  },
  components: {
    Sticking, HighHat, Tom1, Tom4, Snare, Kick,
    StickingsLabel, HighHatLabel, Tom1Label, Tom4Label, SnareLabel, KickLabel
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
