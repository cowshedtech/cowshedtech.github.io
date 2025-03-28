import Options from '../../components/options/vue/menu.js'

export default {
    data() {
        return {
            buttons: [
                {
                    id: 'optionsAnchor',
                    label: 'Options',
                    icon: 'fa-bars',
                    handler: (event) => options.optionsAnchorClick(event),
                    class: 'rightButtons'
                },
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
                },
                {
                    id: 'helpAnchor',
                    label: 'Help',
                    icon: 'fa-bars',
                    handler: (event) => helpAnchorClick(event),
                    class: 'rightButtons'
                }
            ]
        }
    },
    components: {
        Options
    },
    template: `
        <span id="upperRight">
            <span v-for="button in buttons"
                :key="button.id"
                :id="button.id"
                :class="button.class"
                @click="button.handler"
            >
                <i class="fa" :class="button.icon"></i> {{ button.label }}
            </span>
        </span>
        <Options></Options>
    `
}
