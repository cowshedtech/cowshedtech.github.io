import BottomNavigationButton from '../../BaseButtonNavigationButton/vue/base_button_bottom_navigation.js'

export default {
  name: 'PrintButton',
  
  components: {
    BottomNavigationButton
  },

  setup() {
    /**
     * Prints using the browser's native print dialog
     */
    const printDirect = () => {
      window.print();
    }

    /**
     * Creates a new window for printing (Chrome/Windows specific)
     */
    const printInNewWindow = () => {
      const { constant_APP_TITLE: appTitle } = editor;
      const svgContent = document.getElementById('svgTarget')?.innerHTML;

      if (!svgContent) {
        console.error('SVG content not found');
        return;
      }

      const printWindow = window.open('', `${appTitle} Print`);
      if (!printWindow) {
        console.error('Could not open print window. Check if popups are blocked.');
        return;
      }

      const content = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${appTitle}</title>
          </head>
          <body>
            <center>
              ${svgContent}
            </center>
          </body>
        </html>
      `;

      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.print();
    }

    /**
     * Determines print method and handles printing
     */
    const handlePrint = () => {
      try {
        const isWindowsChrome = 
          editor.browserInfo.browser === 'Chrome' && 
          editor.browserInfo.platform === 'windows';

        isWindowsChrome ? printInNewWindow() : printDirect();
      } catch (error) {
        console.error('Print failed:', error);
        // Fallback to direct printing if something goes wrong
        window.print();
      }
    }

    return {
      handlePrint
    }
  },

  template: `
    <BottomNavigationButton
      button-class="grooveDB_hidden pageBottomButton"
      button-id="printButton"
      button-text="PRINT"
      @click="handlePrint"
    >
      <i class="fa fa-print fa-2x"></i>
    </BottomNavigationButton>
  `
} 