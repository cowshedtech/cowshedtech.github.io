import { reactive, computed } from 'vue'
// import download from '../download.js'

export default {
  name: 'DownloadMenu',

  setup() {
    const DEFAULTS = {
      MENU_WIDTH: '200px',
      DEFAULT_FILENAME: 'notation',
      SVG_WIDTH: 2000,
      SCALE_FACTOR: 2,
      VIEW_BOX_SCALE: 0.8
    };

    /**
     * State using Vue's reactive system
     */
    const state = reactive({
      menuWidth: DEFAULTS.MENU_WIDTH
    });

    /**
     * Processes SVG for download with specified dimensions
     * @param {string} svgContent - The SVG content to process
     * @param {string} imageType - The target image type
     * @param {string} filename - The output filename
     */
    const processSVGForDownload = (svgContent, imageType, filename) => {
      const myPablo = Pablo(svgContent + '</svg>');
      const width = parseFloat(myPablo.attr('width'));
      const height = parseFloat(myPablo.attr('height'));
      
      const newWidth = DEFAULTS.SVG_WIDTH;
      const newHeight = Math.round(newWidth * (height / width));
      const newBoxWidth = Math.round(newWidth * DEFAULTS.VIEW_BOX_SCALE);
      const newBoxHeight = Math.round(newHeight * DEFAULTS.VIEW_BOX_SCALE);

      myPablo
        .attr({
          width: `${newWidth}px`,
          height: `${newHeight}px`,
          viewBox: `0 0 ${newBoxWidth} ${newBoxHeight}`
        })
        .children('g')
        .attr('transform', `scale(${DEFAULTS.SCALE_FACTOR})`);

      return new Promise((resolve, reject) => {
        myPablo.download(imageType, filename, result => {
          if (result.error) {
            reject(new Error('Failed to convert sheet music to image file'));
          } else {
            resolve();
          }
        });
      });
    };

    /**
     * Handles image download
     * @param {string} imageType - Type of image to download
     */
    const downloadImages = async (imageType) => {
      try {
        const abc_source = generate_ABC(800);
        const svg_obj = renderABCtoSVG(editor.track, abc_source);
        const tuneTitle = document.getElementById('tuneTitle')?.value?.trim() || DEFAULTS.DEFAULT_FILENAME;
        const filename = `${tuneTitle}.${imageType}`;

        const svgImages = svg_obj.svg.split('</svg>');
        const promises = svgImages
          .slice(0, -1) // Remove last empty element from split
          .map(svg => processSVGForDownload(svg, imageType, filename));

        await Promise.all(promises);
      } catch (error) {
        console.error('Download failed:', error);
        alert(error.message);
      }
    };

    /**
     * Handles SVG download
     */
    const downloadSVG = () => downloadImages('svg');

    /**
     * Handles PNG download with browser support check
     */
    const downloadPNG = async () => {
      try {
        const acceptable = await new Promise(resolve => {
          Pablo.support.image.png(resolve);
        });

        if (!acceptable) {
          throw new Error('This browser cannot export PNG images');
        }

        await downloadImages('png');
      } catch (error) {
        console.error('PNG download failed:', error);
        alert(error.message);
      }
    };

    /**
     * Handles MIDI file download
     */
    const downloadMIDI = () => {
      try {
        const midi_url = createMidiUrlFromClickableUI('general_MIDI');
        if (!midi_url) {
          throw new Error('Failed to generate MIDI URL');
        }
        document.location = midi_url;
      } catch (error) {
        console.error('MIDI download failed:', error);
        alert('Failed to generate MIDI file');
      }
    };

    return {
      menuWidth: computed(() => state.menuWidth),
      downloadSVG,
      downloadPNG,
      downloadMIDI
    };
  },

  template: `
    <div class="noteContextMenu">
      <ul 
        id="downloadContextMenu" 
        class="list" 
        :style="{ width: menuWidth }"
      >
        <li @click="downloadSVG">
          <b>Download SVG Images</b>
        </li>
        <li @click="downloadPNG">
          <b>Download PNG Images</b>
        </li>
        <li @click="downloadMIDI">
          <b>Download MIDI file</b>
        </li>
      </ul>
    </div>
  `
}