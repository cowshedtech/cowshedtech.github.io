export default {

    data() {
        return {
            containerIndex: midiPlayer?.containerIndex || 1,
            touchClass: '',
            swing: midiPlayer ? midiPlayer.getSwing() : 0,
            enabled: midiPlayer ? midiPlayer.isSwingEnabled() : true,            
        }
    },
    
    methods: {
        update() {
            if (!midiPlayer) return
            this.swing = midiPlayer ? midiPlayer.getSwing() : 0
            this.enabled = midiPlayer ? midiPlayer.isSwingEnabled() : true
            this.updateRangeSlider('swingInput' + this.containerIndex, this.swing)
        },
        handleSwingChange(event) {
            midiPlayer.setSwing(event.target.value)
        },
        updateRangeSlider(sliderID, value) {

            var slider = document.getElementById(sliderID);
            var programaticCSSRules = document.getElementById(sliderID + "CSSRules");
            if (!programaticCSSRules) {
                // create a new one.
                programaticCSSRules = document.createElement('style');
                programaticCSSRules.id = sliderID + "CSSRules";
                document.body.appendChild(programaticCSSRules);
            }
        
            var style_before = document.defaultView.getComputedStyle(slider, ":before");
            var style_after = document.defaultView.getComputedStyle(slider, ":after");
            var before_color = style_before.getPropertyValue('color');
            var after_color = style_after.getPropertyValue('color');
        
            // change the before and after colors of the slider using a gradiant
            var percent = Math.ceil(((value - slider.min) / (slider.max - slider.min)) * 100);
        
            var new_style_str = '#' + sliderID + '::-moz-range-track' + '{ background: -moz-linear-gradient(left, ' + before_color + ' ' + percent + '%, ' + after_color + ' ' + percent + '%)}\n';
            new_style_str += '#' + sliderID + '::-webkit-slider-runnable-track' + '{ background: -webkit-linear-gradient(left, ' + before_color + ' ' + '0%, ' + before_color + ' ' + percent + '%, ' + after_color + ' ' + percent + '%)}\n';
            programaticCSSRules.textContent = new_style_str;
        
        }
    },

    mounted() {
        if (midiPlayer && this.containerIndex !== midiPlayer.containerIndex) {
            this.containerIndex = midiPlayer.containerIndex
        }
        eventBus.$on(EventTypes.PARAMETERS_UPDATE, () => {
            this.update()
        })
    },

    beforeUnmount() {
        eventBus.$off(EventTypes.PARAMETERS_UPDATE);
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
