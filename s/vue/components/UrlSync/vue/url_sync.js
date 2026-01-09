export default {
  inject: ['options', 'track'],

  methods: {
    syncURL() {
      if (typeof updateCurrentURL === 'function') {
        updateCurrentURL();
      }
    }
  },

  watch: {
    'track.version': function() { this.syncURL() },
    'options.debugMode': function() { this.syncURL() },
    'options.viewMode': function() { this.syncURL() },
    'options.highlightOn': function() { this.syncURL() },
    'options.tomsVisible': function() { this.syncURL() },
    'options.stickingsVisible': function() { this.syncURL() },
    'options.grooveDBAuthoring': function() { this.syncURL() },
  },

  // Render nothing visible; this component only manages side-effects.
  template: `<span style="display:none"></span>`
}

