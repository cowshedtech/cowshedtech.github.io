import { watch } from 'vue'
import ShareTo from './button_share_to.js'

export default {
	name: 'SharePopup',

	components: {
		ShareTo
	},

	compilerOptions: {
		isCustomElement: tag => tag === 'share-button'
	},

	data() {
		return {
			longURL: "",
			shortURL: "",
			url: "",
			isShortURL: false,
			isEmbedCode: false,
			popupLeft: 300,
			popupTop: 250
		}
	},

	props: {
		isOpen: {
			type: Boolean,
			default: false
		},
		left: {
			type: Number,
			default: null
		},
		top: {
			type: Number,
			default: null
		}
	},

	watch: {
		isOpen() {
			this.isEmbedCode = false;
			this.isShortURL = false;
			this.longURL = editor?.get_FullURLForPage() || "";
			this.url = this.longURL;
			this.getShortURL();
			// position popup based on provided props, falling back to defaults
			this.popupLeft = (this.left ?? 300);
			this.popupTop = (this.top ?? 250);
		}
	},

	methods: {

		/*
		 *
		*/
		close() {
			this.$emit('close-clicked');
		},


		/*
		 *
		*/
		handleShortUrlChange() {
			if (this.isShortURL) {
				this.url = this.shortURL;
				this.isEmbedCode = false;
			}
			if (!this.isShortURL) this.url = this.longURL;
		},


		/*
		 *
		*/
		handleEmbedUrlChange() {
			if (this.isEmbedCode) this.getEmbedURL();
			if (!this.isEmbedCode) this.url = this.longURL;
		},


		/*
		 *
		*/
		handleCopyClick(event) {
			navigator.clipboard.writeText(this.url);
		},


		/*
		 *
		*/
		getShortURL() {
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
					parent.shortURL = response.shortLink
					parent.url = parent.shortURL
					parent.isShortURL = true;
					parent.isEmbedCode = false;
				}
			};
			xhr.send(JSON.stringify(params));
		},


		/*
		 *
		*/
		getEmbedURL() {
			var embedText = '<iframe width="100%" height="240" src="' + this.longURL + '" frameborder="0" ></iframe>';
			this.url = embedText
			this.isShortURL = false;
		}
	},

	template: `
	<!-- this is used by the share/save button, and is hidden by default -->
	<div id="fullURLPopup" v-if="isOpen" :style="{ left: popupLeft + 'px', top: popupTop + 'px' }">
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
						@change.stop="handleShortUrlChange"
					>Short URL
				</label>
			</span>
			<span>
				<label id="embedCodeLabel" class="fullURLPopupCheckboxLabel">
					<input 
						type="checkbox" 
						id="embedCodeCheckbox"
						v-model="isEmbedCode"
						@change.stop="handleEmbedUrlChange"
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
				@click.stop.prevent="handleCopyClick"
				class="copy-button"
			>
				<i class="fa fa-copy"></i>
				<span>COPY</span>
			</button>
			&nbsp; &nbsp; &nbsp;
			<share-button id="shareButton"></share-button>
			<ShareTo :gsurl="url"></ShareTo>
		</div>		
	</div>	
`
}


{/* <ShareTo :gsurl="url"></ShareTo> */}