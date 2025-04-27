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
				{ 	id: '1', 
					label: 'Start on 1', 
				 	isChecked: metronome?.getOffsetClickStart() === '1',
					isVisible: true
				},
				{ 	id: 'E', 
					label: 'Start on E', 
					isChecked: metronome?.getOffsetClickStart() === 'E',
					isVisible: !editor?.track?.isTripletDivision()
				},
				{ 	id: 'TI', 
					label: 'Start on &', 
					isChecked: metronome?.getOffsetClickStart() === 'TI',
					isVisible: editor?.track?.isTripletDivision()
				},
				{ 	id: 'AND', 
					label: 'Start on &', 
					isChecked: metronome?.getOffsetClickStart() === 'AND', 
					isVisible: !editor?.track?.isTripletDivision()
				},
				{ 	id: 'A', 
					label: 'Start on A', 
					isChecked: metronome?.getOffsetClickStart() === 'A',
					isVisible: !editor?.track?.isTripletDivision()
				},
				{ 	id: 'TA', 
					label: 'Start on &', 
					isChecked: metronome?.getOffsetClickStart() === 'TA',
					isVisible: editor?.track?.isTripletDivision()
				},
				{ 	id: 'ROTATE', 
					label: 'Rotate through', 
					isChecked: metronome?.getOffsetClickStart() === 'ROTATE',
					isVisible: true
				}
			]
		}
	},

	methods: {
		handleOffsetClick(position) {
			metronome?.setOffsetClickStart(position)
			this.$emit('close')
		}
	},

	mounted() {
		eventBus.$on('metronome-updated', () => {
			if (!this.menuItems) return;
			
			this.menuItems.forEach((item, index) => {
				if (!item) return;
				
				// Update checked state
				item.isChecked = metronome?.getOffsetClickStart() === item.id;
				
				// Update visibility for specific items
				if (index === 1 || index === 3 || index === 4) {
					item.isVisible = !editor?.track?.isTripletDivision();
				} else if (index === 2 || index === 5) {
					item.isVisible = editor?.track?.isTripletDivision();
				}
			});
		})
	},
	
	beforeUnmount() {
		eventBus.$off('metronome-updated');
	},

	template: `
		<span 
			class="noteContextMenuNew" 
			v-if="isOpen" 
			style="position: absolute; z-index: 9999; display: block" 
			:style="{ top: y + 'px', left: x + 'px' }"
		>
			<ul id="metronomeOptionsOffsetClickContextMenu" class="list">
				<li 
					v-for="item in menuItems"
					:key="item.id"
					class="metronomeOptionsOffsetClickContextMenuItem"
					:class="{ menuChecked: item.isChecked }"
					:style="{ display: item.isVisible ? 'block' : 'none' }"
					:id="'metronomeOptionsOffsetClickContextMenuOnThe' + item.id"
					@click.stop.prevent="handleOffsetClick(item.id)"
				>
					{{ item.label }}
				</li>
			</ul>
		</span>
	`
}

// v-if="item && item.isVisible"
					