import OptionsMenu from './menu_options.js'

export default {
    data() {
        return {
            freq: metronome ? metronome.getFrequency() : 0,
            isPopupOpen: false,
            menuX: 0,
            menuY: 0,
        }
    },
    computed: {
        buttonClasses() {
            return (value) => [
                'metronomeButton',
                { buttonSelected: this.freq === value }
            ]
        }
    },
    methods: {
        setFrequency(value) {
            metronome.setFrequency(value)
        },
        handleOptions(event) {
            this.menuX = event.clientX;
            this.menuY = event.clientY;
            this.isPopupOpen = !this.isPopupOpen;
        },
        closeMenu() {
            this.isPopupOpen = false;
        },
    },
    mounted() {
        // Subscribe to metronome changes
        this.removeHandler = metronome?.addChangeHandler(() => {
            this.freq = metronome.getFrequency()
        })
    },
    beforeUnmount() {
        // Cleanup event handler
        if (this.removeHandler) this.removeHandler() 
    },

    components: {
        OptionsMenu
    },

    template: `
            <span id="metronomeContainer">
                <span id="metronomeLabel">METRONOME:</span>
                <span 
                    v-for="(label, value) in { 0: 'OFF', 4: '4th', 8: '8th', 16: '16th' }" 
                    :key="value"
                    :id="'metronome' + (value === 0 ? 'Off' : value + 'ths')"
                    :class="buttonClasses(Number(value))"
                    @click="setFrequency(Number(value))"
                >{{ label }}</span>
                <span 
                    class="metronomeButton Options grooveDB_hidden" 
                    id="metronomeOptionsAnchor"
                    @click="handleOptions"                    
                >Options</span>                                                    
            </span>
            <OptionsMenu
                :is-open="isPopupOpen" 
                :x="menuX" 
                :y="menuY"
                @close="closeMenu">
            </OptionsMenu>
  `
  }