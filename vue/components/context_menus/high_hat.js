export default {
  data() {
    return { }
  },
  props: { },
  template: `
	<div class="noteContextMenu">
		<ul id="hhContextMenu" class="list">
			<li onclick='myGrooveWriter.notePopupClick("hh", "off");'>Off</li>
			<li onclick='myGrooveWriter.notePopupClick("hh","normal");'>Hi-hat normal</li>
			<li onclick='myGrooveWriter.notePopupClick("hh","open");'>Hi-hat open</li>
			<!-- <li onclick='myGrooveWriter.notePopupClick("hh","close");'>Hi-hat closed</li> -->
			<li onclick='myGrooveWriter.notePopupClick("hh","accent");'>Hi-hat accent</li>
			<li onclick='myGrooveWriter.notePopupClick("hh","crash");'>Crash</li>
			<li onclick='myGrooveWriter.notePopupClick("hh","ride");'>Ride</li>
			<li onclick='myGrooveWriter.notePopupClick("hh","ride_bell");'>Ride Bell</li>
			<li onclick='myGrooveWriter.notePopupClick("hh","cow_bell");'>Cow Bell</li>
			<li onclick='myGrooveWriter.notePopupClick("hh","stacker");'>Stacker</li>
			<li onclick='myGrooveWriter.notePopupClick("hh","metronome_normal");'>Click</li>
			<li onclick='myGrooveWriter.notePopupClick("hh","metronome_accent");'>Click - accent</li>
		</ul>
	</div>
`
}