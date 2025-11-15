export default {
	name: 'InstrumentMenuItem',
	
	props: {
		label: {
			type: String,
			required: true,
		},
		newState: {
			type: String,
			required: true,
		},
	},

	methods: {
		handleClick() {
			this.$emit('action', this.newState)
		}
	},
	
	template: `<li @click.stop.prevent="handleClick" style="font-family: monospace; padding:10px; border-bottom: solid 1px #393939; text-decoration: none;">{{ label }}</li>`
}