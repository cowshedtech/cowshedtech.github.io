export default {
    data() {
        return {
            containerIndex: midiPlayer?.containerIndex || 1,
            touchClass: '',
            swing: midiPlayer ? midiPlayer.getSwing() : 0,
            enabled: midiPlayer ? midiPlayer.isSwingEnabled() : true,            
        }
    },
    props: {},
    methods: {
        update() {
            if (!midiPlayer) return
            this.swing = midiPlayer ? midiPlayer.getSwing() : 0
            this.enabled = midiPlayer ? midiPlayer.isSwingEnabled() : true
            updateRangeSlider('swingInput' + this.containerIndex, this.swing)
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
            <span  v-if="enabled"  
                   for="swingAmount" 
                    class="swingOutput" 
                    :id="'swingOutput' + containerIndex"                    
            >{{ swing }}%</span>
            <span v-else
                   for="swingAmount" 
                    class="swingOutput" 
                    :id="'swingOutput' + containerIndex"                    
            >N/A</span>
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


// Enable or disable swing
//this.setSwingEnabled(this.doesDivisionSupportSwing(division));
