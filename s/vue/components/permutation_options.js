import { ref } from 'vue'

//
//
// function generateWriterHTML() {
//   var genHTML = "";
//   var cur_measure;
//   for (cur_measure = 1; cur_measure <= myGrooveWriter.numberOfMeasures(); cur_measure++) {
//     genHTML += myGrooveWriter.HTMLforStaffContainer(cur_measure, (cur_measure - 1) * myGrooveWriter.notesPerMeasure());
//   }
//   return genHTML
// }


//
//
export default {
  data() {
    return { }
  },
  props: {    
  },
  setup() {
    const content = ref("")
    var genHTML = "";
    
    // TODO Need to revisit and ensure permutations working!!
    
    // genHTML += HTMLforPermutationOptions();
    content.value = genHTML
    return { content }    
  },
  template: `
    <div class="nonPrintable">
        <div id="PermutationOptions" v-html="content"></div>
    </div>`
}