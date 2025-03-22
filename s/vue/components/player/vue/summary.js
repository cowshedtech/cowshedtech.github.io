export default {
  data() {
    // return { 
    //   totalPlayTime: "0:00",
    //   totalNotes: midiPlayer ? midiPlayer.totalNotes : 0,
    //   totalRepeats: midiPlayer ? midiPlayer.totalRepeats : 0
    // }
    /** @type {{ stats: PlayerStats }} */
    return {
      stats: this.getInitialStats()
    }
  },
  props: { },
  methods: {
    /**
     * Format milliseconds into a duration string
     * @param {number} ms - Milliseconds
     * @returns {string} Formatted duration string
     */
    formatDuration(ms) {
      const hours = ms.getUTCHours();
      const minutes = ms.getUTCMinutes().toString().padStart(2, '0');
      const seconds = ms.getSeconds().toString().padStart(2, '0');
      return hours > 0 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
    },

    /**
     * Get initial stats when no player exists
     * @returns {PlayerStats}
     */
    getInitialStats() {
      return {
        formattedTime: '00:00',
        notes: 0,
        repeats: 0,
        totalMs: 0
      }
    },

    /**
     * Update component stats from player
     */
    updateStats() {
      if (!midiPlayer) {
        this.stats = this.getInitialStats()
        return
      }

      const totalMs = midiPlayer.getPlayTimeTotal() || 0
      this.stats = {
        formattedTime: this.formatDuration(totalMs),
        notes: midiPlayer.totalNotes || 0,
        repeats: midiPlayer.totalRepeats || 0,
        totalMs
      }
    }
  },
  mounted() {
    this.removeHandler = midiPlayer?.addChangeHandler(() => {
        this.updateStats()
    })
  },
  beforeUnmount() {
      if (this.removeHandler) this.removeHandler() 
  },
  template: `
   <div id="totalPlayTime">
      Total Play Time: <span class="totalTimeNum">{{ stats.formattedTime }}</span>
      notes: <span class="totalTimeNum">{{ stats.notes }}</span>
      repetitions: <span class="totalTimeNum">{{ stats.repeats }}</span>
    </div>
`
}