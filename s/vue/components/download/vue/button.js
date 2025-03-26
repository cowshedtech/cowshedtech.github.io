import BottomNavigationButton from '../../navigation/bottom_navigation_button.js'

export default {
  name: 'DownloadButton',

  components: {
    BottomNavigationButton
  },

  setup() {
    /**
     * Handles the download button click
     * @param {MouseEvent} event - The click event
     */
    const handleDownloadClick = (event) => {
      event.preventDefault();
      // window.downloadAnchorClick?.(); // Safely call the global function if it exists
        const contextMenu = document.getElementById('downloadContextMenu');
        if (!contextMenu) return;
    
        // Normalize event object for cross-browser compatibility
        const e = event || window.event;
        if (!e) return;
    
        // Position menu relative to click coordinates with a 150px offset
        const OFFSET = 150;
        if (typeof e.clientX === 'number' && typeof e.clientY === 'number') {
            contextMenu.style.top = `${e.clientY - OFFSET}px`;
            contextMenu.style.left = `${e.clientX - OFFSET}px`;
        }
    
        showContextMenu(contextMenu);
    };

    return {
      handleDownloadClick
    };
  },

  template: `
    <BottomNavigationButton
      button-class="grooveDB_hidden pageBottomButton"
      button-id="downloadButton"
      button-text="DOWNLOAD"
      @click="handleDownloadClick"
    >
      <span class="bottomButtonIcon">
        <i class="fa fa-download fa-2x"></i>
      </span>
    </BottomNavigationButton>
  `
}