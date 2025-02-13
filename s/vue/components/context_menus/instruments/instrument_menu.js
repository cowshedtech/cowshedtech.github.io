import MenuItem from './instrument_menu_item.js'

export default {
	components: { MenuItem },
	props: ['instrument', 'element', 'instrumentModes'],
	template: `
	  <div class="noteContextMenu">
		  <ul :id="element" class="list">
			 <MenuItem
				v-for="instrumentMode in instrumentModes"
				:key="instrumentMode.newState"
				:instrument="instrument"
				:new-state="instrumentMode.newState"
				:label="instrumentMode.label"
				/>
		  </ul>		  
	  </div>
  `
}
