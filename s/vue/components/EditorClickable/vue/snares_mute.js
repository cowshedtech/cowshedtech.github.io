export default {
  
  props: {
    measureIndex: {
      type: Number,
      required: true
    }
  },

  methods: {
    handleClick(event) {
        noteLeftClick('hh', this.noteIndex, false)
    }
  },

  template: `
    <div :id="'unmutesnareButton' + measureIndex" class="unmuteSnareButton" @click="handleClick">
      <span class="fa-stack unmuteStack">
        <i class="fa fa-ban fa-stack-2x" style="color:red"></i>
        <i class="fa fa-volume-down fa-stack-1x"></i>
      </span>
    </div>
  `
}