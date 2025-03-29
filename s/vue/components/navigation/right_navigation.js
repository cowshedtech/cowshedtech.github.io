import OptionsButton from '../../components/options/vue/button.js'
import HelpButton from '../../components/help/vue/button.js'

export default {
    data() {
        return {
            buttons: [
                {
                    id: 'permutationAnchor',
                    label: 'Permutations',
                    icon: 'fa-bars',
                    handler: (event) => permutationAnchorClick(event),
                    class: 'rightButtons grooveDB_hidden'
                },
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
        OptionsButton, HelpButton
    },
    template: `
        <span id="upperRight">
            <OptionsButton></OptionsButton>
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
