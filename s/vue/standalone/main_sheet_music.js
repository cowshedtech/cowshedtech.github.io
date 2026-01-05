import SheetMusic from '../components/DisplaySheetMusic/vue/display.js'

export default {
  props: {
    track: {
      type: Object,
      required: false
    }
  },
  components: {
    SheetMusic
  },
  
  template: `
    <SheetMusic :track="track"></SheetMusic>
	`
}

