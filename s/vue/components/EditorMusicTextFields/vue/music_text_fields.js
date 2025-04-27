export default {
  data() {
    return {
      track: editor.track ? editor.track : null,
      isViewMode : options ? options.isViewMode() : true,            
    }
  },

  computed: {
    title: {
      get() {
        return this.track?.getTitle() || ''
      },
      set(value) {
        editor.track?.setTitle(value)
      }
    },
    author: {
      get() {
        return this.track?.getAuthor() || ''
      },
      set(value) {
        editor.track?.setAuthor(value)
      }
    },
    comments: {
      get() {
        return this.track?.getComments() || ''
      },
      set(value) {
        editor.track?.setComments(value)
      }
    },
    showLegend: {
      get() {
        return options?.isShowLegend() || false
      },
      set(value) {
        options.setShowLegend(value)
      }
    }
  },

  mounted() {
    this.removeHandler = this.track?.addChangeHandler(() => {
      this.track = deepCopy(editor.track)            
    })
    eventBus.$on('options-updated', () => {
      this.isDBAuthoring = options.grooveDBAuthoring;     
      this.isViewMode = options.isViewMode();     
    });
  },

  beforeUnmount() {
      if (this.removeHandler) this.removeHandler() 
  },

  template: `
    <div v-if="isViewMode === false" id="sheetMusicTextFields" class="fullWidthEle grooveDB_hidden">
      <span class="sheetMusicTextField">
        <b>Title:</b> 
        <input 
          class="sheetMusicInputField" 
          id="tuneTitle" 
          v-model="title"
          type="text">
      </span>
      <span class="sheetMusicTextField">
        <b>Author:</b> 
        <input 
          class="sheetMusicInputField" 
          id="tuneAuthor"
          v-model="author"
          type="text">
      </span>
      <span class="sheetMusicTextField">
        <b>Comment:</b>
        <input 
          class="sheetMusicInputField" 
          id="tuneComments" 
          v-model="comments"
          type="text">
      </span>
      <span id='KeyButton'>
        <input 
          type="checkbox"
          class="hiddenCheckbox"
          v-model="showLegend" 
          id="showLegend">
            <label
              id="LegendLabel" 
              for="showLegend">
                <i class="fa fa-key"></i>
            </label>
      </span>
    </div>`
}