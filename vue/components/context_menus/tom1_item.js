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
			console.log(`click`);
			console.log(this.drum);
			console.log(this.newState);
			myGrooveWriter.notePopupClick(this.drum, this.newState);
		}
	 },
  	template: `
		<li @click="handleClick">{{ label }}</li>
`
}