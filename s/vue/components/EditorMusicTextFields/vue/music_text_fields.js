export default {
  data() {
    return {
      track: editor.track ? editor.track : null
    }
  },

  computed: {
    title: {
      get() {
        return this.track?.getTitle() || ''
      },
      set(value) {
        this.track?.setTitle(value)
      }
    },
    author: {
      get() {
        return this.track?.getAuthor() || ''
      },
      set(value) {
        this.track?.setAuthor(value)
      }
    },
    comments: {
      get() {
        return this.track?.getComments() || ''
      },
      set(value) {
        this.track?.setComments(value)
      }
    }
  },

  mounted() {
    this.removeHandler = this.track?.addChangeHandler(() => {
      this.track = deepCopy(editor.track)            
    })
  },

  beforeUnmount() {
      if (this.removeHandler) this.removeHandler() 
  },

  template: `
    <div id="sheetMusicTextFields" class="fullWidthEle grooveDB_hidden edit-block">
      <span class="sheetMusicTextField">
        <b>Title:</b> 
        <input 
          class="sheetMusicInputField" 
          id="tuneTitle" 
          v-model="title"
          onchange="editor.updateSheetMusic();" 
          type="text">
      </span>
      <span class="sheetMusicTextField">
        <b>Author:</b> 
        <input 
          class="sheetMusicInputField" 
          id="tuneAuthor"
          v-model="author" 
          onchange="editor.updateSheetMusic();" 
          type="text">
      </span>
      <span class="sheetMusicTextField">
        <b>Comment:</b>
        <input 
          class="sheetMusicInputField" 
          id="tuneComments" 
          v-model="comments" 
          onchange="editor.updateSheetMusic();" 
          type="text">
      </span>
      <span id='KeyButton'>
        <input 
          type="checkbox"
          class="hiddenCheckbox" 
          id="showLegend" 
          onclick="editor.updateSheetMusic();">
            <label
              id="LegendLabel" 
              for="showLegend">
                <i class="fa fa-key"></i>
            </label>
      </span>
    </div>`
}