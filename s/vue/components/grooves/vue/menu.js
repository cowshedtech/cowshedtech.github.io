export default {
  data() {
    return {
      groovesAsHTML: ''
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
  
  created() {
    try {
      this.groovesAsHTML = grooves.getGroovesAsHTML();
    } catch (error) {
      console.error('Failed to load grooves:', error);
      this.groovesAsHTML = '<span class="error">Failed to load grooves</span>';
    }
  },
  
  template: `
    <div id="grooveListWrapper" v-if="isOpen" :style="{ top: y + 'px', left: x + 'px' }">
      <span v-html="groovesAsHTML" />
    </div>
  `
}