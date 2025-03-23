export default {
    data() {
        return {
            containerIndex: midiPlayer?.containerIndex || 1,
            touchClass: ''
        }
    },
    props: {},
    methods: {
        updateStats() {
            if (!midiPlayer) return
        }
    },
    mounted() {
        if (midiPlayer && this.containerIndex !== midiPlayer.containerIndex) {
            this.containerIndex = midiPlayer.containerIndex
        }
        this.removeHandler = midiPlayer?.addChangeHandler(() => {
            this.updateStats()
        })
    },
    beforeUnmount() {
        if (this.removeHandler) this.removeHandler()
    },
    template: `
    <div class="tempoRow">
        <span class="tempoLabel">BPM</span>
        <input type="text" 
                for="tempo" 
                class="tempoTextField" 
                pattern="\\d+" 
                :id="'tempoTextField' + containerIndex" 
                value="80">
        <input type="range" 
                min="30" 
                max="300" 
                value="90" 
                :class="'tempoInput' + touchClass" 
                :id="'tempoInput' + containerIndex" 
                list="tempoSettings">
    </div>
`
}