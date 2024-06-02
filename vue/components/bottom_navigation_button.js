export default {
  data() {
    return { }
  },
  props: {
    buttonId: String,
    buttonText: String,
    clickHandler: String,
    buttonClass: {
      default: "pageBottomButton edit-block",
      type: String
    }
  },
  template: `
  <span v-bind:class="buttonClass" v-bind:id="buttonId" v-bind:onclick="clickHandler">
    <span class="bottomButtonIcon"><slot></slot></span>
    <span class="bottomButtonLabel">{{ buttonText }}</span>
  </span>`
}