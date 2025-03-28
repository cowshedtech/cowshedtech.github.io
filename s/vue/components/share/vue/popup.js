import ShareButton from './button.js'
import { reactive, watch } from 'vue'

export default {
	name: 'SharePopup',


	setup(props, { emit }) {
		const handleClose = () => {
			emit('close-clicked');
		};

		return {
			handleClose
		};
	},

	data() {
		return {
			longURL: "",
			shortURL: "",
			url: "",
			isShortURL: false,
			isEmbedCode: false
		}
	},

	props: {
		isOpen: {
			type: Boolean,
			default: false
		}
	},

	mounted() {
		this.longURL = editor?.get_FullURLForPage() || "";
		this.url = this.longURL;
	},

	methods: {

		// /*
		//  *
		// */
		close() {
			// var popup = document.getElementById("fullURLPopup");	
			// if (popup) popup.style.display = "none";
			this.handleClose();
		},


		/*
		 *
		*/
		handleShortUrlChange() {
			if (!this.isShortURL) this.getShortURL();
			if (this.isShortURL) this.url = this.longURL;
		},


		/*
		 *
		*/
		handleEmbedUrlChange() {
			if (!this.isEmbedCode) this.getEmbedURL();
			if (this.isEmbedCode) this.url = this.longURL;
		},


		/*
		 *
		*/
		handleCopyClick(event) {
			event.preventDefault();

			var copyText = document.getElementById("fullURLPopupTextField");
			copyText.select();
			copyText.setSelectionRange(0, 99999);	 // hack fix for mobile
			document.execCommand("copy");
		},


		/*
		 *
		*/
		getShortURL() {
			this.isEmbedCode = false;

			var params = {
				"dynamicLinkInfo": {
					"domainUriPrefix": "https://gscribe.com/share",
					"link": this.longURL
				}
			};

			var parent = this;
			var xhr = new XMLHttpRequest();
			xhr.open('POST', 'https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyBx4So11fGFPgTI62nP-JmxrxHmuRpJ120');
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.onload = function () {
				if (xhr.status === 200) {
					var response = JSON.parse(xhr.responseText);
					parent.url = response.shortLink
				} else {
					this.isShortURL = false;
				}
			};
			xhr.send(JSON.stringify(params));
		},


		/*
		 *
		*/
		getEmbedURL() {
			var embedText = '<iframe width="100%" height="240" src="' + this.longURL + '" frameborder="0" ></iframe>	';
			this.url = embedText
		}
	},

	template: `
	<!-- this is used by the share/save button, and is hidden by default -->
	<div id="fullURLPopup" v-if="isOpen">
	    <span id="fullURLPopupCloseButton" @click="close();"><i class="fa fa-lg fa-times-circle"></i></span>
		<div id="fullURLPopupTitle">Share Your Groove</div>
		<div id="fullURLPopupSubTitle">Use this URL to share or save this groove</div>
		<div id="fullURLPopupSubSubTitle">(You can also bookmark this page)</div>
		<div id="fullURLPopupCheckboxes">
			<span>
				<label id="shortURLLabel" class="fullURLPopupCheckboxLabel">
					<input 
						type="checkbox" 
						id="shortenerCheckbox"
						v-model="isShortURL"
						@click="handleShortUrlChange"
					>Short URL
				</label>
			</span>
			<span>
				<label id="embedCodeLabel" class="fullURLPopupCheckboxLabel">
					<input 
						type="checkbox" 
						id="embedCodeCheckbox"
						v-model="isEmbedCode"
						@click="handleEmbedUrlChange"
					>Embed Code
				</label>
			</span>
		</div>
		<div id="fullURLPopupTextFieldContainer">
			<input 
				type="text" 
				id="fullURLPopupTextField"
				v-model="url"
			>
		</div>
		<br>
		<div id="shareButtonContainer">
			<button 
				id="fullURLPopupCopyButton"
				@click="handleCopyClick"
				class="copy-button"
			>
				<i class="fa fa-copy"></i>
				<span>COPY</span>
			</button>
			&nbsp; &nbsp; &nbsp;
			<share-button id="shareButton"></share-button>
		</div>
	</div>
`
}