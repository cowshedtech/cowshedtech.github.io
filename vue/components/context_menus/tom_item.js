export default {
	data() { },
	props: {
		drum: String,
		label: String,
		newState: String,
	 },
	mounted() { },
	methods: {
		handleClick() { 
			myGrooveWriter.notePopupClick(this.drum, this.newState);
		}
	 },
  	template: `
		<li @click="handleClick">{{ label }}</li>
`
}