import { ref, h, createStaticVNode } from 'vue'

export default {

    setup() {
        const { notesPerMeasure, numBeats, noteValue } = editor.track;
        const highlightsContent = ref("")
        highlightsContent.value = generateBackgroundHighlights(0, notesPerMeasure, numBeats, noteValue)

        return { highlightsContent }
    },

    render() {
        return createStaticVNode(this.highlightsContent)
    }
}