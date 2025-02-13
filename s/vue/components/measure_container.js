import { ref } from 'vue'

//
//
function generateWriterHTML() {
  var genHTML = "";
  var cur_measure;
  for (cur_measure = 1; cur_measure <= myGrooveWriter.numberOfMeasures(); cur_measure++) {
    genHTML += myGrooveWriter.HTMLforStaffContainer(cur_measure, (cur_measure - 1) * myGrooveWriter.notesPerMeasure());
  }
  return genHTML
}


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
    content.value = generateWriterHTML();
    return { content }
  },
  template: `<div id="musicalInput" class="fullWidthEle edit-block"><div id="measureContainer" v-html="content"></div></div>`
}