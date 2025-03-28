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

  watch: {
		gsurl() {
			console.log(`here`)
		}
	},

  mounted() {

    // TODO FIX
    console.log(this.gsurl)

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
            // this.url = document.getElementById("fullURLPopupTextField").value;
            this.url = parent.url
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
            // this.url = encodeURIComponent(document.getElementById("fullURLPopupTextField").value);
            // this.description = "Check out this groove:  " + document.getElementById("fullURLPopupTextField").value;
            this.url = parent.url
            this.description = "Check out this groove:  " + url;            
          }
        },
        reddit: {
          before: function () {
            // this.url = document.getElementById("fullURLPopupTextField").value;
            // this.title = "Check out this groove: " + document.getElementById("fullURLPopupTextField").value;
            this.url = parent.url            
            this.title = "Check out this groove: " + url;
          }
        },
        email: {
          before: function () {
            // this.url = document.getElementById("fullURLPopupTextField").value;
            // this.description = "Check out this groove. %0A%0A " + encodeURIComponent(document.getElementById("fullURLPopupTextField").value);
            this.url = parent.url
            this.description = "Check out this groove. %0A%0A " + url;
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
    })
  },

  props: { },
  template: ``
}