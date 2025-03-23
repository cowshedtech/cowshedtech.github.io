export default {
    data() {
        return {
            containerIndex: midiPlayer?.containerIndex || 1,
            touchClass: '',
            swing: midiPlayer ? midiPlayer.getSwing() : 0
        }
    },
    props: {},
    methods: {
        update() {
            if (!midiPlayer) return
            this.swing = midiPlayer ? midiPlayer.getSwing() : 0
            updateRangeSlider('swingInput' + this.containerIndex)
        },
        handleSwingChange(event) {
            midiPlayer.setSwing(event.target.value)
        }     
    },
    mounted() {
        if (midiPlayer && this.containerIndex !== midiPlayer.containerIndex) {
            this.containerIndex = midiPlayer.containerIndex
        }
        this.removeSubscriber = midiPlayer?.subscribe(EventTypes.PARAMETERS_UPDATE, () => {
            this.update()
        })
    },
    beforeUnmount() {
        if (this.removeSubscriber) this.removeSubscriber()
    },
    template: `
        <div class="swingRow">
            <span class="swingLabel">SWING</span>
            <span for="swingAmount" 
                    class="swingOutput" 
                    :id="'swingOutput' + containerIndex"                    
            >{{ swing }}%</span>
            <input type="range" 
                    min="0" 
                    max="50" 
                    value="0" 
                    :class="'swingInput' + touchClass" 
                    :id="'swingInput' + containerIndex" 
                    list="swingSettings" 
                    step="5"
                    v-model="swing"
                    @change="handleSwingChange">
        </div>
`
}