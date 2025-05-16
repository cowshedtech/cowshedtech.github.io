/**
 * A bottom navigation button component that displays an icon and label.
 * @component
 */
export default {
  name: 'BaseButtonNavigationButton',

  props: {
    buttonId: {
      type: String,
      required: true,
      validator: (value) => value.length > 0
    },
    buttonText: {
      type: String,
      required: true,
      validator: (value) => value.length > 0
    },
    buttonClass: {
      type: String,
      default: 'pageBottomButton',
      validator: (value) => typeof value === 'string'
    }
  },

  template: `
    <span 
      :class="buttonClass"
      :id="buttonId"
      role="button"
      tabindex="0"
    >
      <span class="bottomButtonIcon" aria-hidden="true">
        <slot></slot>
      </span>
      <span class="bottomButtonLabel">{{ buttonText }}</span>
    </span>
  `
}