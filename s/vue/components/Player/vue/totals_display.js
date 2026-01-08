export default {
  inject: ['midiPlayer'],
  data() {
    /** @type {{ stats: PlayerStats }} */
    return {
      stats: this.getInitialStats()
    }
  },
  
  methods: {
    getInitialStats() {
      return {
        formattedTime: '00:00',
        notes: 0,
        repeats: 0,
        playTimeTotal: 0
      }
    },
    updateStats() {
      if (!this.midiPlayer) return

      const playTimeTotal = this.midiPlayer.getPlayTimeTotal() || 0
      this.stats = {
        formattedTime: formatDuration(playTimeTotal),
        notes: this.midiPlayer.totalNotes || 0,
        repeats: this.midiPlayer.totalRepeats || 0,
        playTimeTotal
      }
    }
  },
  
  mounted() {
    eventBus.$on(EventTypes.PLAY_PROGRESS, () => {
			this.updateStats()
		})
  },

  beforeUnmount() {
    eventBus.$off(EventTypes.PLAY_PROGRESS);
  },

  template: `
   <div id="totalPlayTime">
      Total Play Time: <span class="totalTimeNum">{{ stats.formattedTime }}</span>
      notes: <span class="totalTimeNum">{{ stats.notes }}</span>
      repetitions: <span class="totalTimeNum">{{ stats.repeats }}</span>
    </div>
`
}