import OptionsMenu from './menu_options.js'

export default {
    props: {
        midiPlayer: {
            type: Object,
            required: true
        },
        eventBus: {
            type: Object,
            required: true
        }
    },

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
            if (!this.isPopupOpen) {
                this.eventBus.$emit('close-all-menus');
                this.isPopupOpen = true;
            } else {
                this.isPopupOpen = false;
            } 
        },
        closeMenu() {
            this.isPopupOpen = false;
        },
    },

    mounted() {
        this.eventBus.$on('metronome-updated', () => {
			this.freq = metronome.getFrequency()
		})
        this.eventBus.$on('close-all-menus', () => {
            if (this.isPopupOpen) {
                this.isPopupOpen = false;
            }
        });
    },
    
    beforeUnmount() {
        this.eventBus.$off('metronome-updated');
        this.eventBus.$off('close-all-menus');
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
                    @click.stop.prevent="handleOptions"                    
                >Options</span>                                                    
            </span>
            <OptionsMenu
                :is-open="isPopupOpen" 
                :x="menuX" 
                :y="menuY"
                :midiPlayer="midiPlayer"
                :eventBus="eventBus"
                @close="closeMenu">
            </OptionsMenu>             
  `
}