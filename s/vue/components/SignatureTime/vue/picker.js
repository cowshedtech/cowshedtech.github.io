import Menu from './menu.js'

export default {
    data() {
        return {
            track: editor.track ? editor.track : null,
            disabledEight : ((8 * editor.track.numBeats / editor.track.noteValue) % 1 != 0),
            disabledTriplets : editor.track.noteValue != 4,
            isDBAuthoring : options ? options.grooveDBAuthoring : true,
            isViewMode : options ? options.isViewMode() : true,
            isPopupOpen: false,
            menuX: 0,
            menuY: 0,
        }
    },

    mounted() {
        this.removeEditorHandler = editorClickable?.addChangeHandler(() => {
            this.track = deepCopy(editor.track)            
            this.disabledEight = ((8 * editor.track.numBeats / editor.track.noteValue) % 1 != 0)
            this.disabledTriplets = editor.track.noteValue != 4
        })
        this.removeOptionsHandler = options?.addChangeHandler(() => {
            this.isDBAuthoring = options.grooveDBAuthoring;     
            this.isViewMode = options.isViewMode();     
        })
    },

    beforeUnmount() {
        if (this.removeEditorHandler) this.removeEditorHandler() 
        if (this.removeOptionsHandler) this.removeOptionsHandler() 
    },

    components: {
        Menu
    },

    methods: {
        toggleMenu() {
            this.isPopupOpen = !this.isPopupOpen;
        },

        closeMenu() {
            this.isPopupOpen = false;
        },

        handleTimeSigClick(event) {
            this.toggleMenu();
            this.menuX = event.clientX;
            this.menuY = event.clientY;
        },

        handleViewEditClick(event) {
            let newMode = !options.isViewMode();
            options.setViewMode(newMode);
        },

        handleChangeDivisionClick(division) {
            editor.track.changeDivision(division)
        },
    },

    template: `
    <div id="LeftHandNav">
        <span id="divisionButtonContainer">
            <span id="logoInSubdivision" class="left-button-content"><img src="images/GScribe_Logo_lone_g.svg"></span>
            <span v-if="isViewMode === false" class="left-button" id="timeLabel" @click="handleTimeSigClick"><span class="left-button-content"><span><span id="timeSigLabel" class="buttonFraction"><sup>{{track.numBeats}}</sup>/<sub>{{track.noteValue}}</sub></span><span id="timeSubLabel">TIME</span></span></span></span>
            <span v-if="isViewMode === false" class="left-button subdivision" id="subdivision_8ths" :class="{ buttonSelected: track?.notesPerMeasure === 8, disabled: disabledEight }" @click="handleChangeDivisionClick(8)"><span class="left-button-content"><span><span class="buttonFraction"><sup>1</sup>/<sub>8</sub></span>NOTES</span></span></span>
            <span v-if="isViewMode === false" class="left-button subdivision" id="subdivision_16ths" :class="{ buttonSelected: track?.notesPerMeasure === 16 }" @click="handleChangeDivisionClick(16)"><span class="left-button-content"><span><span class="buttonFraction"><sup>1</sup>/<sub>16</sub></span>NOTES</span></span></span>
            <span v-if="isViewMode === false" class="left-button subdivision" id="subdivision_32ths" :class="{ buttonSelected: track?.notesPerMeasure === 32 }" @click="handleChangeDivisionClick(32)"><span class="left-button-content"><span><span class="buttonFraction"><sup>1</sup>/<sub>32</sub></span>NOTES</span></span></span>
            <span v-if="isViewMode === false" class="left-button subdivision" id="subdivision_12ths" :class="{ buttonSelected: track?.notesPerMeasure === 12, disabled: disabledTriplets }" @click="handleChangeDivisionClick(12)"><span class="left-button-content"><span><span class="buttonFraction"><sup>1</sup>/<sub>8</sub></span>TRIPLETS</span></span></span>
            <span v-if="isViewMode === false" class="left-button subdivision" id="subdivision_24ths" :class="{ buttonSelected: track?.notesPerMeasure === 24, disabled: disabledTriplets }" @click="handleChangeDivisionClick(24)"><span class="left-button-content"><span><span class="buttonFraction"><sup>1</sup>/<sub>16</sub></span>TRIPLETS</span></span></span>
            <span v-if="isViewMode === false" class="left-button subdivision" id="subdivision_48ths" :class="{ buttonSelected: track?.notesPerMeasure === 48, disabled: disabledTriplets }" @click="handleChangeDivisionClick(48)"><span class="left-button-content"><span>MIXED<br>Division</span></span></span>
            <span v-if="isDBAuthoring == false" class="left-button" @click="handleViewEditClick" >
                <span class="left-button-content">
                    <span id="view-edit-switch">Switch to {{ isViewMode === false ? 'VIEW' : 'EDIT' }} mode</span>
                </span>
            </span>
            <span v-if="isViewMode === false" class="left-button" id="undoButton" onclick="undoCommand();"><span class="left-button-content"><i class="fa fa-undo"></i>&nbsp;&nbsp;Undo</span></span>
        </span>

    </div>
    <Menu :is-open="isPopupOpen" :x="menuX" :y="menuY" @close-clicked="closeMenu"></Menu>
  `
  }


// <script>
//   if (isTouchDevice()) {
//       document.write('<span class="left-button edit-block" id="advancedEditAnchor" onclick="event.preventDefault(); myGrooveWriter.toggleAdvancedEdit()"><span class="left-button-content">Advanced Edit</span></span>');
//   }
// </script>