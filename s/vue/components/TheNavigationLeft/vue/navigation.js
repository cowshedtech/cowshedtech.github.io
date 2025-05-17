import TimeSignatureMenu from './../../SignatureTime/vue/picker.js'
import AdvancedEditButton from './../../Options/vue/advancededit_button.js'
import ViewEditButton from './../../Options/vue/viewedit_button.js'
import UndoButton from './../../Undo/vue/button.js'

export default {
    components: {
        AdvancedEditButton, ViewEditButton, TimeSignatureMenu, UndoButton
    },

    template: `
    <div id="LeftHandNav">
        <span id="divisionButtonContainer">
            <span id="logoInSubdivision" class="left-button-content"><img src="images/GScribe_Logo_lone_g.svg"></span>
            <TimeSignatureMenu></TimeSignatureMenu>
            <ViewEditButton></ViewEditButton>
            <AdvancedEditButton></AdvancedEditButton>
            <UndoButton></UndoButton>
        </span>
    </div>    
  `
}