import OptionsButton from '../../Options/vue/button.js'
import PermutationButton from '../../Permutations/vue/button.js'
import GroovesButton from '../../Grooves/vue/button.js'
import HelpButton from '../../help/vue/button.js'

export default {
   components: {
        OptionsButton, GroovesButton, PermutationButton, HelpButton
    },
    template: `
        <span id="upperRight">
            <OptionsButton></OptionsButton>
            <PermutationButton></PermutationButton>
            <GroovesButton></GroovesButton>
            <HelpButton></HelpButton>
        </span>        
    `
}
