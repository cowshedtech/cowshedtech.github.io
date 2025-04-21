import { ref } from 'vue'

function buildHighlights(track, measureIndex) {
    if (!track || !measureIndex) return null;
    
    const groupSize = track.noteGroupingSize();
    const startIndex = (measureIndex - 1) * track.notesPerMeasure;
    const endIndex = startIndex + track.notesPerMeasure;

    const highlights = ref(
        Array.from({ length: track.notesPerMeasure }, (_, i) => {
            const id = startIndex + i;
            return {
                id,
                shouldAddSpace: (id + 1) % groupSize === 0 && id < endIndex - 1
            };
        })
    );

    return highlights;
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
            highlights: buildHighlights(this.track, this.measureIndex)
        }
    },

    watch: {
        track: {
            handler(newVal, oldVal) {
                this.highlights = buildHighlights(newVal, this.measureIndex);                
            },
            deep: true
        },
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