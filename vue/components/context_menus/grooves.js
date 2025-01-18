export default {
  data() {
    return { }
  },
  props: { },
  template: `
	<div id="grooveListWrapper">
    <script>
			document.write(grooves.getGroovesAsHTML());
		</script>
	</div>
`
}