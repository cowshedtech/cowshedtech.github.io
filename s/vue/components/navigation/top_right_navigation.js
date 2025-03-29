import OptionsButton from '../options/vue/button.js'
import HelpButton from '../help/vue/button.js'
import PermutationButton from '../permutations/vue/button.js'

export default {
    data() {
        return {
            buttons: [
                {
                    id: 'groovesAnchor',
                    label: 'Grooves',
                    icon: 'fa-bars',
                    handler: (event) => myGrooveWriter.groovesAnchorClick(event),
                    class: 'rightButtons'                
                }
            ]
        }
    },
    components: {
        OptionsButton, HelpButton, PermutationButton
    },
    template: `
        <span id="upperRight">
            <OptionsButton></OptionsButton>
            <PermutationButton></PermutationButton>
            <span v-for="button in buttons"
                :key="button.id"
                :id="button.id"
                :class="button.class"
                @click="button.handler"
            >
                <i class="fa" :class="button.icon"></i> {{ button.label }}
            </span>
            <HelpButton></HelpButton>
        </span>        
    `
}
