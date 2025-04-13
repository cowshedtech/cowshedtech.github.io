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
	
	template: `<li @click.stop.prevent="handleClick">{{ label }}</li>`
}