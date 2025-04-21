export default {
	props: {
		isOpen: {
			type: Boolean,
			default: false
		},
		x: {
			type: Number
		},
		y: {
			type: Number
		}
	},

	data() {
		return {
			menuItems: [
				{ id: '1', label: 'Start on 1', isChecked: metronome.getOffsetClickStart() === '1' },
				{ id: 'E', label: 'Start on E', isChecked: metronome.getOffsetClickStart() === 'E' },
				{ id: 'AND', label: 'Start on &', isChecked: metronome.getOffsetClickStart() === 'AND' },
				{ id: 'A', label: 'Start on A', isChecked: metronome.getOffsetClickStart() === 'A' },
				{ id: 'ROTATE', label: 'Rotate through', isChecked: metronome.getOffsetClickStart() === 'ROTATE' }
			]
		}
	},

	methods: {
		handleOffsetClick(position) {
			metronome.setOffsetClickStart(position)
			this.$emit('close')
		}
	},

	mounted() {
		// Subscribe to metronome changes
		this.removeHandler = metronome?.addChangeHandler(() => {
			this.menuItems[0].isChecked = metronome ? metronome.getOffsetClickStart() === '1' : false
			this.menuItems[1].isChecked = metronome ? metronome.getOffsetClickStart() === 'E' : false
			this.menuItems[2].isChecked = metronome ? metronome.getOffsetClickStart() === 'AND' : false
			this.menuItems[3].isChecked = metronome ? metronome.getOffsetClickStart() === 'A' : false
			this.menuItems[4].isChecked = metronome ? metronome.getOffsetClickStart() === 'ROTATE' : false			
		})
	},
	
	beforeUnmount() {
		// Cleanup event handler
		if (this.removeHandler) this.removeHandler()
	},

	template: `
		<span 
			class="noteContextMenuNew" 
			v-if="isOpen" 
			:style="{ top: y + 'px', left: x + 'px' }"
		>
			<ul id="metronomeOptionsOffsetClickContextMenu" class="list">
				<li 
					v-for="item in menuItems"
					:key="item.id"
					class="metronomeOptionsOffsetClickContextMenuItem"
					:class="{ menuChecked: item.isChecked }"
					:id="'metronomeOptionsOffsetClickContextMenuOnThe' + item.id"
					@click="handleOffsetClick(item.id)"
				>
					{{ item.label }}
				</li>
			</ul>
		</span>
	`
}