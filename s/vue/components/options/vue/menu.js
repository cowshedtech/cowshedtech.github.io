export default {
  
  data() {
    return {
		highlight: options ? options.isHighlightOn() : false		
	 }
  },
  
  props: {
		isOpen: {
			type: Boolean,
			default: false
		},
		x: {
			type: String
		},
		y: {
			type: String
		}
	},

  watch: {
		isOpen() {
			console.log(`here`)
			console.log(this.isOpen)
			console.log(this.x)
			console.log(this.y)
      		// options.optionsAnchorClick()
		}
	},

	methods: {
        handleToggleHighlight() {
			let higlightOn = options.isHighlightOn();
			options.setHighlightOn(!higlightOn)            
        },        
    },

	mounted() {
        // Subscribe to metronome changes
        this.removeHandler = options?.addChangeHandler(() => {
            this.highlight = options.isHighlightOn()
        })
    },
    beforeUnmount() {
        // Cleanup event handler
        if (this.removeHandler) this.removeHandler() 
    },

  template: `
	<span class="noteContextMenuNew" v-if="isOpen" :style="{ top: y + 'px', left: x + 'px' }">
		<ul id="optionsContextMenu" class="list">
			<li 
				class="metronomeOptionsContextMenuItem" 
				:class="{ 'menuChecked': highlight }"
				id="optionsContextMenuHighlight" 
				@click="handleToggleHighlight"
			>
				<b>Highlighting</b>
			</li>
		</ul>
	</span>
`
}