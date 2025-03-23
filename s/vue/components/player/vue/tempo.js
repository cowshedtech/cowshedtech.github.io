export default {
    data() {
        return {
            containerIndex: midiPlayer?.containerIndex || 1,
            touchClass: '',
            tempo: midiPlayer ? midiPlayer.getTempo() : 80
        }
    },
    props: {},
    methods: {
        update() {
            if (!midiPlayer) return
            this.tempo = midiPlayer ? midiPlayer.getTempo() : 80
            updateRangeSlider('tempoInput' + this.containerIndex)
        },
        handleTempoChange(event) {
            midiPlayer.setTempo(event.target.value)
        }        
    },
    mounted() {
        if (midiPlayer && this.containerIndex !== midiPlayer.containerIndex) {
            this.containerIndex = midiPlayer.containerIndex
        }
        this.removeSubscriber = midiPlayer?.subscribe(EventTypes.TEMPO, () => {
            this.update()
        })
        updateRangeSlider('tempoInput' + this.containerIndex)
    },
    beforeUnmount() {
        if (this.removeSubscriber) this.removeSubscriber()
    },
    template: `
    <div class="tempoRow">
        <span class="tempoLabel">BPM</span>
        <input type="text" 
                for="tempo" 
                class="tempoTextField" 
                pattern="\\d+" 
                :id="'tempoTextField' + containerIndex" 
                v-model="tempo"
                @change="handleTempoChange">
        <input type="range" 
                min="30" 
                max="300" 
                :class="'tempoInput' + touchClass" 
                :id="'tempoInput' + containerIndex" 
                list="tempoSettings"
                v-model="tempo"
                @change="handleTempoChange">
    </div>
`
}