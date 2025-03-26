import BottomNavigationButton from '../../navigation/bottom_navigation_button.js'

export default {
  name: 'ShareButton',

  components: {
    BottomNavigationButton
  },

  methods: {
    openPopup() {    
      var popup = document.getElementById("fullURLPopup");
      if (popup) popup.style.display = "block";  
    },

    /**
     * Handles the share button click
     * @param {MouseEvent} event - The click event
     */
    handleShareClick(event) {
      event.preventDefault();
      
        var ShareBut = new ShareButton({
            ui: {
                flyout: 'bottom center', // change the flyout direction of the shares. chose from `top left`, `top center`, `top right`, `bottom left`, `bottom right`, `bottom center`, `middle left`, or `middle right` [Default: `top center`]
                button_font: false, // include the Lato font set from the Google Fonts API. [Default: `true`]
                buttonText: 'SHARE', // change the text of the button, [Default: `Share`]
                icon_font: false,   // include the minified Entypo font set. [Default: `true`]
            },
            networks: {
                facebook: {
                    before: function () {
                        this.url = document.getElementById("fullURLPopupTextField").value;
                        this.description = "Check out this groove.";
                    },
                    //app_id : "839699029418014"    // staging id
                    // app_id : "1499163983742002"   // MLDC id, lou created
                    appId: "445510575651140",   // MLDC id, brad created
                    loadSdk: true
                },
                googlePlus: {
                    enabled: false
                },
                twitter: {
                    before: function () {
                        this.url = encodeURIComponent(document.getElementById("fullURLPopupTextField").value);
                        this.description = "Check out this groove:  " + document.getElementById("fullURLPopupTextField").value;
                    }
                },
                reddit: {
                    before: function () {
                        this.url = document.getElementById("fullURLPopupTextField").value;
                        this.title = "Check out this groove: " + document.getElementById("fullURLPopupTextField").value;
                    }
                },
                email: {
                    before: function () {
                        this.url = document.getElementById("fullURLPopupTextField").value;
                        this.description = "Check out this groove. %0A%0A " + encodeURIComponent(document.getElementById("fullURLPopupTextField").value);
                    }
                },
                pinterest: {
                    enabled: false
                },
                linkedin: {
                    enabled: false
                },
                whatsapp: {
                    enabled: false
                }
            }
        });
    
        // open the popup with full url and try to load short in the background
        this.openPopup();            
    }
  },

  template: `
    <BottomNavigationButton
      button-class="grooveDB_hidden shareSaveButton"
      button-id="shareButton"
      button-text="SHARE"
      @click="handleShareClick"
    >
      <i class="fa fa-share fa-2x"></i>
    </BottomNavigationButton>
  `
} 