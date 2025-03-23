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
<div class="swingRow">
    <span class="swingLabel">SWING</span>
    <span for="swingAmount" 
            class="swingOutput" 
            :id="'swingOutput' + containerIndex">0% swing</span>
    <input type="range" 
            min="0" 
            max="50" 
            value="0" 
            :class="'swingInput' + touchClass" 
            :id="'swingInput' + containerIndex" 
            list="swingSettings" 
            step="5">
</div>
`
}