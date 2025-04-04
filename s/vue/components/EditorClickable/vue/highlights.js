import { ref, h } from 'vue'

export default {

    setup() {
        const { notesPerMeasure, numBeats, noteValue } = editor.track;
        const groupSize = noteGroupingSize(notesPerMeasure, numBeats, noteValue)
        
        const highlights = ref([])
        for (let i = 0; i < notesPerMeasure; i++) {
            highlights.value.push({
                id: i,
                shouldAddSpace: (i + 1) % groupSize === 0 && i < notesPerMeasure - 1
            })
        }

        return { highlights }
    },

    template: `
        <dev class="background-highlight-container">
            <dev class="opening_note_space"></div>
            <template v-for="(highlight, index) in highlights" :key="highlight.id">
                <div :id="'bg-highlight' + highlight.id" class="bg-highlight"></div>
                <div v-if="highlight.shouldAddSpace" class="space_between_note_groups"></div>
            </template>
            <dev class="end_note_space"></div>
        </div>
    `
}