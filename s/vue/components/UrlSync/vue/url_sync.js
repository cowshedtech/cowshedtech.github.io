export default {
  inject: ['options', 'track'],

  data() {
    return {
      _debounceHandle: null
    };
  },

  methods: {
    syncURL() {
      if (this._debounceHandle != null) {
        clearTimeout(this._debounceHandle);
      }
      this._debounceHandle = setTimeout(() => {
        this._debounceHandle = null;
      if (typeof updateCurrentURL === 'function') {
        updateCurrentURL();
      }
      }, 300);
    },
  },

  watch: {
    'track.version': function() { this.syncURL() },
    'options.debugMode': function() { this.syncURL() },
    'options.viewMode': function() { this.syncURL() },
    'options.highlightOn': function() { this.syncURL() },
    'options.tomsVisible': function() { this.syncURL() },
    'options.stickingsVisible': function() { this.syncURL() },
    'options.grooveDBAuthoring': function() { this.syncURL() },
    // React to player settings mirrored on options
    'options.tempo': function() { this.syncURL() },
    'options.swing': function() { this.syncURL() },
  },

  // Render nothing visible; this component only manages side-effects.
  template: `<span style="display:none"></span>`
}

