export default {
	inject: ['metronome', 'track', 'metronomeState'],
	data() {
		return {
			menuItems: [
				{ 	id: '1', 
					label: 'Start on 1', 
				 	isChecked: this.metronome?.getOffsetClickStart() === '1',
					isVisible: true
				},
				{ 	id: 'E', 
					label: 'Start on E', 
					isChecked: this.metronome?.getOffsetClickStart() === 'E',
					isVisible: !this.track?.isTripletDivision()
				},
				{ 	id: 'TI', 
					label: 'Start on &', 
					isChecked: this.metronome?.getOffsetClickStart() === 'TI',
					isVisible: this.track?.isTripletDivision()
				},
				{ 	id: 'AND', 
					label: 'Start on &', 
					isChecked: this.metronome?.getOffsetClickStart() === 'AND', 
					isVisible: !this.track?.isTripletDivision()
				},
				{ 	id: 'A', 
					label: 'Start on A', 
					isChecked: this.metronome?.getOffsetClickStart() === 'A',
					isVisible: !this.track?.isTripletDivision()
				},
				{ 	id: 'TA', 
					label: 'Start on &', 
					isChecked: this.metronome?.getOffsetClickStart() === 'TA',
					isVisible: this.track?.isTripletDivision()
				},
				{ 	id: 'ROTATE', 
					label: 'Rotate through', 
					isChecked: this.metronome?.getOffsetClickStart() === 'ROTATE',
					isVisible: true
				}
			]
		}
	},

	methods: {
		handleOffsetClick(position) {
			this.metronome?.setOffsetClickStart(position)
			this.$emit('close')
		}
	},

	watch: {
		'metronomeState.version': function() {
			if (!this.menuItems) return;
			this.menuItems.forEach((item, index) => {
				if (!item) return;
				item.isChecked = this.metronome?.getOffsetClickStart() === item.id;
				if (index === 1 || index === 3 || index === 4) {
					item.isVisible = !this.track?.isTripletDivision();
				} else if (index === 2 || index === 5) {
					item.isVisible = this.track?.isTripletDivision();
				}
			});
		},
		'track.version': function() {
			if (!this.menuItems) return;
			this.menuItems.forEach((item, index) => {
				if (!item) return;
				if (index === 1 || index === 3 || index === 4) {
					item.isVisible = !this.track?.isTripletDivision();
				} else if (index === 2 || index === 5) {
					item.isVisible = this.track?.isTripletDivision();
				}
			});
		}
	},

	template: `
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
	`
}

// v-if="item && item.isVisible"
					