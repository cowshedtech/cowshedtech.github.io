export default {
  data() {
    return { }
  },
  props: { },
  mounted() {
    // Subscribe to midiPlayer changes
    this.removeHandler = midiPlayer?.addChangeHandler(() => {
        //this.updatePlayTime();
        console.log(`here`)
    })
  },
  beforeUnmount() {
      // Cleanup event handler
      if (this.removeHandler) this.removeHandler() 
  },
  template: `
  <div id="totalPlayTime">Total Play Time: <span class="totalTimeNum">x</span> notes: <span class="totalTimeNum">x</span> repetitions: <span class="totalTimeNum">x</span></div>
`
}