export default {
  data() {
    return {
      groovesAsHTML: ''
    }
  },
  
  props: {},
  
  created() {
    try {
      this.groovesAsHTML = grooves.getGroovesAsHTML();
    } catch (error) {
      console.error('Failed to load grooves:', error);
      this.groovesAsHTML = '<span class="error">Failed to load grooves</span>';
    }
  },
  
  template: `
    <div id="grooveListWrapper">
      <span v-html="groovesAsHTML" />
    </div>
  `
}