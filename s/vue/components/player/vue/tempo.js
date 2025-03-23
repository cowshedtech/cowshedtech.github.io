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
            this.updateRangeSlider('tempoInput' + this.containerIndex)
        },
        handleTempoChange(event) {
            midiPlayer.setTempo(event.target.value)
        },
        updateRangeSlider(sliderID) {

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
            var percent = Math.ceil(((slider.value - slider.min) / (slider.max - slider.min)) * 100);
        
            var new_style_str = '#' + sliderID + '::-moz-range-track' + '{ background: -moz-linear-gradient(left, ' + before_color + ' ' + percent + '%, ' + after_color + ' ' + percent + '%)}\n';
            new_style_str += '#' + sliderID + '::-webkit-slider-runnable-track' + '{ background: -webkit-linear-gradient(left, ' + before_color + ' ' + '0%, ' + before_color + ' ' + percent + '%, ' + after_color + ' ' + percent + '%)}\n';
            programaticCSSRules.textContent = new_style_str;
        
        }
    },
    mounted() {
        if (midiPlayer && this.containerIndex !== midiPlayer.containerIndex) {
            this.containerIndex = midiPlayer.containerIndex
        }
        this.removeHandler = midiPlayer?.addChangeHandler(() => {
            this.update()
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