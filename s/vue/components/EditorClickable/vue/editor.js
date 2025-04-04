import ContextMenus from './instruments/context_menus.js'
import Measure from './measure.js'

export default {
  components: {
    ContextMenus,Measure
  },

  template: `
    <div id="musicalInput" class="fullWidthEle edit-block">
      <div id="measureContainer">
        <Measure measureIndex="1"></Measure>
      </div>
    <ContextMenus></ContextMenus>`
  }


