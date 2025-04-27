export default {
  data() {
    /** @type {{ stats: PlayerStats }} */
    return {
      stats: this.getInitialStats()
    }
  },
  props: { },
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
      if (!midiPlayer) return

      const playTimeTotal = midiPlayer.getPlayTimeTotal() || 0
      this.stats = {
        formattedTime: formatDuration(playTimeTotal),
        notes: midiPlayer.totalNotes || 0,
        repeats: midiPlayer.totalRepeats || 0,
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
    if (this.removeSubscriber) this.removeSubscriber()
  },
  template: `
   <div id="totalPlayTime">
      Total Play Time: <span class="totalTimeNum">{{ stats.formattedTime }}</span>
      notes: <span class="totalTimeNum">{{ stats.notes }}</span>
      repetitions: <span class="totalTimeNum">{{ stats.repeats }}</span>
    </div>
`
}