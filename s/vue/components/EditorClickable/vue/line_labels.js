export default {
  data() {
    return {
      measureIndex: 1     
    }
  },

  props: {
    measureIndex: {
      type: Number,
      required: true
    }
  },

  methods: {
    handleClick(event) {
      const idParts = event.srcElement.id.split('-')
      const idBeforeHyphen = idParts[0]
      noteLabelClick(event, idBeforeHyphen, this.measureIndex)
    }
  },

  template: `
    <div class="line-labels">
      <div class="hh-label" 
           id="hh-label" 
           @click="handleClick"
           @contextmenu.prevent="handleClick">
        Hi-hat
      </div>
      <div class="tom-label" 
           id="tom1-label" 
          @click="handleClick"
          @contextmenu.prevent="handleClick">
        Tom
      </div>
      <div class="snare-label" 
           id="snare-label" 
          @click="handleClick"
          @contextmenu.prevent="handleClick">
        Snare
      </div>
      <div class="tom-label" 
           id="tom4-label" 
           @click="handleClick"
           @contextmenu.prevent="handleClick">
        Tom
      </div>
      <div class="kick-label" 
           id="kick-label" 
          @click="handleClick"
          @contextmenu.prevent="handleClick">
        Kick
      </div>
    </div>
  `
}