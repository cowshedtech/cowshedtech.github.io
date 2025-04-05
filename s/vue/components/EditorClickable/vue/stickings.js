import Sticking from './sticking.js'

export default {

  props: {
    measureIndex: {
      type: Number,
      required: true
    }
  },

  components: {
    Sticking
  },

  setup(props) {
    const { notesPerMeasure, numBeats, noteValue } = editor.track;
    const groupSize = noteGroupingSize(notesPerMeasure, numBeats, noteValue)
    const startNoteIndex = (props.measureIndex - 1) * notesPerMeasure;
    return { startNoteIndex, notesPerMeasure, groupSize }
  },

  methods: {
    handleClick(event) {
      noteLabelClick(event, "stickings", this.measureIndex)
    }
  },

  template: `
    <div class="stickings-row-container">
        <div class="line-labels">
            <div class="stickings-label" @click="handleClick" @contextmenu.prevent="handleClick">STICKINGS</div>
        </div>      
        <div class="music-line-container">
            <div class="notes-container">
                <div class="stickings-container">
                    <div class="opening_note_space"></div>
                        <template v-for="i in notesPerMeasure" :key="i">
                            <Sticking :noteIndex="startNoteIndex + (i - 1)"  />
                            <div v-if="i % groupSize === 0 && i < notesPerMeasure" class="space_between_note_groups"></div>
                        </template>
                    </div>
                </div>   
            </div>
            <slot></slot>
        </div>
    </div>`
}