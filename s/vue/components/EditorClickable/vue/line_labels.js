export default {
  data() {
    return {
      labels: [
        { class: 'hh-label', id: 'hh-label', text: 'Hi-hat' },
        { class: 'tom-label', id: 'tom1-label', text: 'Tom' },
        { class: 'snare-label', id: 'snare-label', text: 'Snare' },
        { class: 'tom-label', id: 'tom4-label', text: 'Tom' },
        { class: 'kick-label', id: 'kick-label', text: 'Kick' }
      ]
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
      <div v-for="label in labels"
           :key="label.id"
           :class="label.class"
           :id="label.id"
           @click="handleClick"
           @contextmenu.prevent="handleClick">
        {{ label.text }}
      </div>
    </div>
  `
}