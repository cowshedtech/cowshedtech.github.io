import { ref } from 'vue'

function buildHighlights(track) {
    const { notesPerMeasure, numBeats, noteValue } = track;
    const groupSize = noteGroupingSize(notesPerMeasure, numBeats, noteValue)

    const highlights = ref([])
    for (let i = 0; i < notesPerMeasure; i++) {
        highlights.value.push({
            id: i,
            shouldAddSpace: (i + 1) % groupSize === 0 && i < notesPerMeasure - 1
        })
    }

    return highlights
}

export default {
    props: {
        track: {
            type: Object,
            required: true
        },
        measureIndex: {
            type: Number,
            required: true
        }
    },

    data() {
        return {
            highlights: null,
        }
    },

    watch: {
        track: {
            handler(newVal, oldVal) {
                let highlights = buildHighlights(newVal)
                this.highlights = highlights;
                this.$forceUpdate();
            },
            deep: true
        },
    },

    onBeforeMount() {
        let highlights = buildHighlights(this.track)
        this.highlights = highlights;
    },

    template: `
        <div class="background-highlight-container">
            <div class="opening_note_space"></div>
            <template v-for="(highlight, index) in highlights" :key="highlight.id">
                <div :id="'bg-highlight' + highlight.id" class="bg-highlight"></div>
                <div v-if="highlight.shouldAddSpace" class="space_between_note_groups"></div>
            </template>
            <div class="end_note_space"></div>
        </div>
    `
}