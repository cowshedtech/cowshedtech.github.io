export default {
    
    inject: ['midiPlayer'],
    
    data() {
        return {
            containerIndex: this.midiPlayer?.containerIndex || 1,
            touchClass: '',
            tempo: this.midiPlayer ? this.midiPlayer.getTempo() : 80
        }
    },
    
    methods: {
        update() {
            if (!this.midiPlayer) return
            this.tempo = this.midiPlayer ? this.midiPlayer.getTempo() : 80
            this.updateRangeSlider('tempoInput' + this.containerIndex, this.tempo)
        },
        handleTempoChange(event) {
            this.midiPlayer.setTempo(event.target.value)
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
        if (this.midiPlayer && this.containerIndex !== this.midiPlayer.containerIndex) {
            this.containerIndex = this.midiPlayer.containerIndex
        }
        eventBus.$on(EventTypes.PARAMETERS_UPDATE, () => {
            this.update()
        })
        this.updateRangeSlider('tempoInput' + this.containerIndex, this.tempo)
    },
    
    beforeUnmount() {
        eventBus.$off(EventTypes.PARAMETERS_UPDATE);
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