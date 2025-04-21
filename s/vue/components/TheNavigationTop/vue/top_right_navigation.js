import OptionsButton from '../../Options/vue/button.js'
import PermutationButton from '../../Permutations/vue/button.js'
import GroovesButton from '../../Grooves/vue/button.js'
import HelpButton from '../../Help/vue/button.js'

export default {
    data() {
        return {
            track: editor.track ? editor.track : null
        }
    },

    components: {
        OptionsButton, GroovesButton, PermutationButton, HelpButton
    },

    mounted() {
        this.removeHandler = editorClickable?.addChangeHandler(() => {
          this.track = deepCopy(editor.track)            
        })        
    },

    template: `
        <span id="upperRight">
            <OptionsButton></OptionsButton>
            <PermutationButton :track="track"></PermutationButton>
            <GroovesButton></GroovesButton>
            <HelpButton></HelpButton>
        </span>        
    `
}
