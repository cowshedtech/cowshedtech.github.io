import ContextMenu from '../../BaseContextMenu/vue/base_context_menu.js'
import OptionsMenu from './menu_options.js'

export default {
    props: {
        eventBus: {
            type: Object,
            required: true
        }
    },
    
    inject: ['metronome', 'metronomeState'],

    data() {
        return {
            isPopupOpen: false,
            menuX: 0,
            menuY: 0,
        }
    },

    computed: {
        freq() {
            // depend on reactive state to trigger re-compute
            this.metronomeState && this.metronomeState.version;
            return this.metronome ? this.metronome.getFrequency() : 0;
        },
        buttonClasses() {
            return (value) => [
                'metronomeButton',
                { buttonSelected: this.freq === value }
            ]
        }
    },

    methods: {
        setFrequency(value) {
            this.metronome.setFrequency(value)
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

    mounted() {},
    beforeUnmount() {},

    components: {
        ContextMenu, OptionsMenu
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
            
        <ContextMenu 
            :is-open="isPopupOpen" 
            :x="menuX" 
            :y="menuY" 
            @close="closeMenu">
            <OptionsMenu
                :eventBus="eventBus"
            >
            </OptionsMenu>
        </ContextMenu>          
  `
}