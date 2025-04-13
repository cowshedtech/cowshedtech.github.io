export default {
	name: 'InstrumentMenuItem',
	
	props: {
		instrument: {
			type: String,
			required: true,
		},
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
			if (typeof myGrooveWriter === 'undefined') {
				console.warn('myGrooveWriter is not defined');
				return;
			}
			notePopupClick(this.instrument, this.newState);
			this.$emit('close')
		}
	},
	
	template: `<li @click="handleClick">{{ label }}</li>`
}