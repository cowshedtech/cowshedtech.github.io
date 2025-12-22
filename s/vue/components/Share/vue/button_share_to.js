export default {
  data() {
    return { }
  },

  props: {
		gsurl: {
			type: String,
			required: true
		}
	},

  mounted() {

    var parent = this;

    this.ShareBut = new ShareButton({
      ui: {
        flyout: 'bottom center', // change the flyout direction of the shares. chose from `top left`, `top center`, `top right`, `bottom left`, `bottom right`, `bottom center`, `middle left`, or `middle right` [Default: `top center`]
        button_font: false, // include the Lato font set from the Google Fonts API. [Default: `true`]
        buttonText: 'SHARE', // change the text of the button, [Default: `Share`]
        icon_font: false,   // include the minified Entypo font set. [Default: `true`]
      },
      networks: {
        facebook: {
          before: function () {
            this.url = parent.gsurl
            this.description = "Check out this groove.";
          },
          appId: "445510575651140",   // MLDC id, brad created
          loadSdk: true
        },
        twitter: {
          before: function () {
            this.url = parent.gsurl
            this.description = "Check out this groove";
          }
        },
        reddit: {
          before: function () {
            this.url = parent.gsurl
            this.description = "Check out this groove";
          }
        },
        googlePlus: {
          enabled: false
        },
        email: {
          enabled: false
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
    })
  },

  template: ``
}