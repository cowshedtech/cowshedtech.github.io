
// Instruments
import Sticking from './sticking.js'

export default {
  data() {
    return {
      components: [
        // Instruments
        { name: 'Sticking' },
        // Labels
      ]
    }
  },
  components: {
    Sticking
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
