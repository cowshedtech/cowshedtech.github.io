export default {
  data() {
    return { 
      totalPlayTime: "0:00",
      totalNotes: midiPlayer ? midiPlayer.totalNotes : 0,
      totalRepeats: midiPlayer ? midiPlayer.totalRepeats : 0
    }
  },
  props: { },
  mounted() {
    // Subscribe to midiPlayer changes
    this.removeHandler = midiPlayer?.addChangeHandler(() => {
        const totalPlayTime = midiPlayer.getPlayTimeTotal();
        const hours = totalPlayTime.getUTCHours();
        const minutes = totalPlayTime.getUTCMinutes().toString().padStart(2, '0');
        const seconds = totalPlayTime.getSeconds().toString().padStart(2, '0');
        
        this.totalPlayTime = hours > 0 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
        this.totalNotes = midiPlayer ? midiPlayer.totalNotes : 0,
        this.totalRepeats = midiPlayer ? midiPlayer.totalRepeats : 0
    })
  },
  beforeUnmount() {
      // Cleanup event handler
      if (this.removeHandler) this.removeHandler() 
  },
  template: `
  <div id="totalPlayTime">Total Play Time: <span class="totalTimeNum">{{totalPlayTime}}</span> notes: <span class="totalTimeNum">{{totalNotes}}</span> repetitions: <span class="totalTimeNum">{{totalRepeats}}</span></div>
`
}