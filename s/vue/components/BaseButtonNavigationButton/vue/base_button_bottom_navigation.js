export default {
  name: 'BaseButtonNavigationButton',

  props: {
    buttonId: {
      type: String,
      required: true
    },
    buttonText: {
      type: String,
      required: true
    },
    buttonClass: {
      type: String,
      default: 'pageBottomButton edit-block'
    }
  },

  template: `
    <span 
      :class="buttonClass"
      :id="buttonId"
    >
      <span class="bottomButtonIcon">
        <slot></slot>
      </span>
      <span class="bottomButtonLabel">{{ buttonText }}</span>
    </span>
  `
}