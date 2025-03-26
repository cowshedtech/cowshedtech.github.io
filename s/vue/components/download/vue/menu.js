// import download from '../download.js'

export default {
  data() {
    return {
      menuWidth: '200px'
    }
  },
  methods: {
    downloadSVG() { 
      this.downloadImages('svg');  
    },
    
    downloadPNG() { 
      var parent = this;

      Pablo.support.image.png(function (acceptable) {
          if (acceptable) {
            parent.downloadImages('png');
          } else {
              alert("Sorry, this browser can't export PNG images");
          }
      });       
    },
    
    downloadMIDI() { 
      var midi_url = createMidiUrlFromClickableUI("general_MIDI");
      document.location = midi_url;
     },


    // Render an SVG that is good for download.
    // Constant size at 2000x200
    downloadImages(imageType) {
      var abc_source = generate_ABC(800);
      var svg_obj = renderABCtoSVG(editor.track, abc_source);
      var filename;
      var tune_title = document.getElementById("tuneTitle").value;

      if (tune_title.length == 0) {
          filename = "notation.";
      } else {
          filename = tune_title;
      }
      filename += imageType;

      var svg_images = svg_obj.svg.split("</svg>");
      // that split should always create at least 2 since it will match that </svg> if there is only one
      // since the split creates an extra one reduce the length by 1
      for (var i = 0; i < svg_images.length - 1; i++) {
          var myPablo = Pablo(svg_images[i] + "</svg>");
          var width = parseFloat(myPablo.attr('width'));
          var height = parseFloat(myPablo.attr('height'));
          var imageRatio = height / width;
          var newWidth = 2000;
          var newHeight = Math.round(newWidth * imageRatio);
          var newBoxWidth = Math.round(newWidth * .8);
          var newBoxHeight = Math.round(newHeight * .8);
          myPablo.attr('width', newWidth + 'px');
          myPablo.attr('height', newHeight + 'px');
          myPablo.attr('viewBox', '0 0 ' + newBoxWidth + ' ' + newBoxHeight);
          myPablo.children('g').attr('transform', 'scale(2)');

          myPablo.download(imageType, filename, function (result) {
              if (result.error) {
                  alert("An error occurred when trying to convert the sheet music to a PNG file.");
              }
          });
      }
    }


  },
  template: `
	<div class="noteContextMenu">
		<ul id="downloadContextMenu" class="list" :style="{ width: menuWidth }">
			<li @click="downloadSVG"><b>Download SVG Images</b></li>
			<li @click="downloadPNG"><b>Download PNG Images</b></li>
			<li @click="downloadMIDI"><b>Download MIDI file</b></li>
		</ul>
	</div>	
`
}