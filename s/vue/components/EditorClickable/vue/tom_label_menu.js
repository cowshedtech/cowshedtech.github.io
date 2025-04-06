
export default {
	props: {
		tomIndex: {
			type: Number,
			required: true
		}
	},

	methods: {
		handleClick(action) {
			noteLabelPopupClick('tom' + this.tomIndex, action)
		}
	  },

	template: `
	<div class="noteContextMenu">
		<ul :id="'tom' + tomIndex + 'LabelContextMenu'" class="list">
			<li @click="handleClick('all_of')">all Toms <b>Off</b></li>
			<li @click="handleClick('all_on')">all Toms <b>On</b></li>
			<li id='mute_tom1_menu_item' @click="handleClick('mute')">mute tom sound</li>
			<li @click="handleClick('cancel')">cancel</li>
		</ul>
	</div>
`
}