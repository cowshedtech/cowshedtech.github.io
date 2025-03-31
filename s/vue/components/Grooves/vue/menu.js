var rockGrooves = {
  'Empty 16th note groove': '?TimeSig=4/4&Div=16&Tempo=80&Measures=1&H=|----------------|&S=|----------------|&K=|----------------|',
  '8th Note Rock': '?TimeSig=4/4&Div=8&Tempo=80&Measures=1&H=|xxxxxxxx|&S=|--O---O-|&K=|o---o--|',
  '16th Note Rock': '?TimeSig=4/4&Div=16&Tempo=80&Measures=1&H=|xxxxxxxxxxxxxxxx|&S=|----O-------O---|&K=|o-------o-------|',
  'Syncopated Hi-hats #1': '?TimeSig=4/4&Div=16&Title=Syncopated%20hi-hats%201&Tempo=80&Measures=1&H=|x-xxx-xxx-xxx-xx|&S=|----O-------O---|&K=|o-------o-------|',
  'Syncopated Hi-hats #2': '?TimeSig=4/4&Div=16&Title=Syncopated%20hi-hats%202&Tempo=80&Measures=1&H=|xxx-xxx-xxx-xxx-|&S=|----O-------O---|&K=|o-------o-------|',
  'Train Beat': '?TimeSig=4/4&Div=16&Swing=0&Title=Train%20Beat&Tempo=95&Measures=1&H=|----------------|&S=|ggOgggOgggOggOOg|&K=|o-x-o-x-o-x-o-x-|'
};

var tripletGrooves = {
  'Jazz Shuffle': '?TimeSig=4/4&Div=12&Title=Jazz%20Shuffle&Tempo=100&Measures=1&H=|r--r-rr--r-r|&S=|g-gO-gg-gO-g|&K=|o--X--o--X--|',
  'Half Time Shuffle in 8th notes': '?TimeSig=4/4&Div=12&Title=Half%20Time%20Shuffle&Swing=0&measures=1&H=|x-xx-xx-xx-x|&S=|-g--g-Og--g-|&K=|------------|',
  'Half Time Shuffle in 16th notes': '?TimeSig=4/4&Div=24&Swing=0&Tempo=85&Measures=1&H=|x-xx-xx-xx-xx-xx-xx-xx-x|&S=|-g--g-Og--g--g--g-Og--g-|&K=|------------------------|',
  'Purdie Shuffle': '?TimeSig=4/4&Div=12&Swing=0&Tempo=120&Title=Purdie%20Shuffle&Swing=0&measures=1&H=|x-xx-xx-xx-x|&S=|-g--g-Og--g-|&K=|o----o-----o|',
  'Jazz Ride': '?TimeSig=4/4&Div=12&Tempo=80&Measures=1&H=|r--r-rr--r-r|&S=|------------|&K=|---x-----x--|'
};

var worldGrooves = {
  'Bossa Nova': '?TimeSig=4/4&Div=8&Title=Bossa%20Nova&Tempo=140&Measures=2&H=|xxxxxxxx|xxxxxxxx|&S=|x-x--x-x|-x--x-x-|&K=|o-xoo-xo|o-xoo-xo|',
  'Jazz Samba': '?TimeSig=4/4&Div=16&Title=Samba&Tempo=80&Measures=1&H=|r-rrr-rrr-rrr-rr|&S=|o-o--o-o-o-oo-o-|&K=|o-xoo-xoo-xoo-xo|',
  'Songo': '?TimeSig=4/4&Div=16&Title=Songo&Tempo=80&Measures=1&&H=|x---x---x---x---|&S=|--O--g-O-gg--g-g|&K=|---o--o----o--o-|'
};

var footOstinatos = {
  'Samba': '?TimeSig=4/4&Div=16&Title=Samba Ostinato&Tempo=60&Swing=0&measures=1&H=|----------------|&S=|----------------|&K=|o-xoo-xoo-xoo-xo|',
  'Tumbao': '?TimeSig=4/4&Div=16&Title=Tumbao Ostinato&Tempo=60&Measures=1&H=|----------------|&S=|----------------|&K=|x--ox-o-x--ox-o-|',
  'Baiao': '?TimeSig=4/4&Div=16&Title=Baiao Ostinato&Tempo=60&Measures=1&H=|----------------|&S=|----------------|&K=|o-xo--X-o-xo--X-|'
};

export default {
  data() {
    return {
      content: {
        "Rock grooves": rockGrooves,
        "Triplet grooves": tripletGrooves,
        "World grooves": worldGrooves,
        "Foot Ostinatos": footOstinatos
      }
    }
  },

  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    x: {
      type: String
    },
    y: {
      type: String
    }
  },

  methods: {
    handleGrooveClick(name, pattern) {
      myGrooveWriter.updateFromURL(pattern)
    }
  },

  template: `
    <div id="grooveListWrapper" v-if="isOpen" :style="{ top: y + 'px', left: x + 'px' }">
      <ul class="grooveListUL">

        <span 
          v-for="(items, section) in content" 
          :key="section"
        >
          <li class="grooveListHeaderLI">{{ section }}</li>
          <li 
            v-for="(pattern, name) in items" 
            :key="name" 
            class="grooveListLI"
            @click="handleGrooveClick(name, pattern)"
          >
            {{ name }}
          </li>
        </span>
      </ul>
    </div>  
  `
}