export default {
  
  props: {
    measureIndex: {
      type: Number,
      required: true
    }
  },

  methods: {
    handleClick(event) {
        noteLeftClick('kick', this.noteIndex, false)
    }
  },

  template: `
    <div :id="'unmuteKickButton' + measureIndex" class="unmuteKickButton" @click="handleClick">
      <span class="fa-stack unmuteKickStack">
        <i class="fa fa-ban fa-stack-2x" style="color:red"></i>
        <i class="fa fa-volume-down fa-stack-1x"></i>
      </span>
    </div>
  `
}