import SheetMusic from '../components/DisplaySheetMusic/vue/display.js'
import { provide as vueProvide } from 'vue'

export default {
  components: {
    SheetMusic
  },

  props: {
    track: {
      type: Object,
      required: true
    },
    instanceId: {
      type: [Number, String],
      required: false,
      default: null
    }
  },

  setup(props) {
    const inst = (props.instanceId != null && window.GrooveDisplay && window.GrooveDisplay.__instances)
      ? window.GrooveDisplay.__instances[props.instanceId]
      : null

    if (inst) {
      vueProvide('options', inst.options)
      vueProvide('track', props.track)
      vueProvide('sheetMusic', inst.sheetMusic)
      vueProvide('gsActivate', () => window.GrooveDisplay.activateInstance(inst))
      vueProvide('gsUid', '_' + inst.id)
    } else {
      if (!window.options) {
        window.options = new Options()
      }
      vueProvide('options', window.options)
      vueProvide('track', props.track)
    }
    return {}
  },

  template: `
    <SheetMusic></SheetMusic>
	`
}
