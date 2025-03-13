// Javascript for the Groove Scribe HTML application

class Metronome {

    solo = false;
    offsetClickStart = "1";
    offsetClickStartRotation = 0;
    frequency = 0;

    autoSpeedUpActive = false;
	countInActive = false;
	countInIsPlaying = false;
	

    /**
     * 
     */    
    constructor(containerIndex) { }    

    /**
     * 
     */    
    setFrequency(frequency) {
        this.frequency = frequency;
        this.setButton(frequency);

        // TODO!!
        //root.updateCurrentURL();
    }

    /**
     * 
     */    
    getFrequency() {
        return this.frequency
    }


    //
    //
    //

    /**
     * 
     */    
    getSolo() {
        return this.solo;
    };
    
    /**
     * 
     */    
    setSolo(trueElseFalse) {
        this.solo = trueElseFalse;
    };


    //
    //
    //

    /**
     * 
     */    
    getOffsetClickStart() {
        return this.offsetClickStart;
    };
    
    /**
     * 
     */    
    getOffsetClickStartIsRotating() {
        return this.offsetClickStart == 'ROTATE';
    };
    
    /**
     * 
     */    
    setOffsetClickStart(value) {
        this.offsetClickStart = value;
    };

    /**
     * if the Metronome offset click start is set to rotate this
     * will advance the position of the rotation and return TRUE
     * returns FALSE if rotation is OFF     
     */    
    advanceOptionsOffsetClickStartRotation(isTriplets) {
        if (this.getOffsetClickStartIsRotating()) {
            this.offsetClickStartRotation++;
            return true;
        } else {
            return false;
        }
    };

    /**
     * 
     */    
    getOptionsOffsetClickStartRotation(isTriplets) {
        if (this.getOffsetClickStartIsRotating()) {
            // constrain the rotation
            if (isTriplets && metronome.offsetClickStartRotation > 2)
                this.offsetClickStartRotation = 0;
            else if (this.offsetClickStartRotation > 3)
                this.offsetClickStartRotation = 0;
    
            switch (this.offsetClickStartRotation) {
                case 0:
                    return '1';
                case 1:
                    if (isTriplets)
                        return 'TI';
                    else
                        return 'E';
                case 2:
                    if (isTriplets)
                        return 'TA';
                    else
                        return 'AND';
                case 3:
                    return 'A';
            }
        } else {
            return this.getOffsetClickStart();
        }
    };
    
    /**
     * 
     */    
    resetOptionsOffsetClickStartRotation(value) {
        // start with last in the rotation so the next rotation brings it to '1'
        return this.offsetClickStartRotation = 0;
    };

    //
    //
    //

    /**
     * 
     */    
    setFrequencyDisplay(newFrequency) {
        var mm = document.getElementById('midiMetronomeMenu' + root.grooveUtilsUniqueIndex);
    
        if (mm) {
            mm.className = mm.className.replace(" selected", "");
    
            if (newFrequency > 0) {
                mm.className += " selected";
            }
        }
    };

    
    ///
    //
    //

    /**
     * 
     */    
    miniMenuClick() {
        if (this.frequency > 0)
            this.frequency = 0;
        else
            this.frequency = 4;

        midiPlayer.setFrequencyDisplay(this.frequency);
        midiPlayer.noteHasChanged();
    };


    /**
     * 
     */    
    setButton(metronomeInterval) {

		var id = "";
		switch (metronomeInterval) {
			case 4:
				id = "metronome4ths";
				break;
			case 8:
				id = "metronome8ths";
				break;
			case 16:
				id = "metronome16ths";
				break;
			case 0:
			/* falls through */
			default:
				id = "metronomeOff";
				if (this.getSolo()) {
					// turn off solo if we are turning off the metronome
					root.optionsMenuPopupClick("Solo");
				}
				break;
		}

		// clear other buttons
		var myElements = document.querySelectorAll(".metronomeButton");
		for (var i = 0; i < myElements.length; i++) {
			var thisButton = myElements[i];
			// remove active status
			unselectButton(thisButton);
		}

		selectButton(document.getElementById(id));

		midiPlayer.noteHasChanged(); // pretty likely the case
	};

	// root.setFrequency = function (newFrequency) {
	// 	root.class_metronome_frequency = newFrequency;
	// 	root.setButton(newFrequency);

	// 	// update the current URL so that reloads and history traversal and link shares and bookmarks work correctly
	// 	root.updateCurrentURL();
	// };

	// the user has clicked on the metronome options button
	optionsAnchorClick(event) {

		var contextMenu = document.getElementById("metronomeOptionsContextMenu");
		if (contextMenu) {

			var anchorPoint = document.getElementById("metronomeOptionsAnchor");

			if (anchorPoint) {
				var anchorPos = getTagPosition(anchorPoint);
				contextMenu.style.top = anchorPos.y + anchorPoint.offsetHeight + "px";
				contextMenu.style.left = anchorPos.x + anchorPoint.offsetWidth - 150 + "px";
			}

			showContextMenu(contextMenu);
		}
	};


    // figure out if the metronome options menu should be selected and change the UI
    /**
     * 
     */    
    optionsMenuSetSelectedState() {

        if (this.getSolo() ||
            this.autoSpeedUpActive ||
            this.getOffsetClickStart() != "1") {
            // make menu look active
            addOrRemoveKeywordFromClassById("metronomeOptionsAnchor", "selected", true)
        } else {
            // inactive
            addOrRemoveKeywordFromClassById("metronomeOptionsAnchor", "selected", false)
        }
    };


    /**
     * 
     */    
    optionsMenuPopupClick(option_type) {

		switch (option_type) {
			case "Solo":
				var current = this.getSolo();
				if (!current) {
					this.setSolo(true);
					addOrRemoveKeywordFromClassById("metronomeOptionsContextMenuSolo", "menuChecked", true);
					if (this.getFrequency() === 0)
						this.setFrequency(4);
				} else {
					this.setSolo(false);
					addOrRemoveKeywordFromClassById("metronomeOptionsContextMenuSolo", "menuChecked", false);
				}
				midiPlayer.noteHasChanged();
				break;

			case "SpeedUp":
				if (this.autoSpeedUpActive) {
					// just turn it off if it is on, don't show the configurator
					this.autoSpeedUpActive = false;
					addOrRemoveKeywordFromClassById("metronomeOptionsContextMenuSpeedUp", "menuChecked", false);
				} else {
					this.autoSpeedUpActive = true;
					addOrRemoveKeywordFromClassById("metronomeOptionsContextMenuSpeedUp", "menuChecked", true);
					this.showAutoSpeedupConfiguration();
				}
				break;

			case "CountIn":
				if (this.countInActive) {
					// just turn it off if it is on, don't show the configurator
					this.countInActive = false;
					addOrRemoveKeywordFromClassById("metronomeOptionsContextMenuCountIn", "menuChecked", false);
				} else {
					this.countInActive = true;
					addOrRemoveKeywordFromClassById("metronomeOptionsContextMenuCountIn", "menuChecked", true);
				}
				break;

			case "OffTheOne":
				// bring up the next menu to be clicked
				var contextMenu;

				if (usingTriplets())
					contextMenu = document.getElementById("metronomeOptionsOffsetClickForTripletsContextMenu");
				else
					contextMenu = document.getElementById("metronomeOptionsOffsetClickContextMenu");
				if (contextMenu) {
					var anchorPoint = document.getElementById("metronomeOptionsContextMenuOffTheOne");

					if (anchorPoint) {
						var anchorPos = getTagPosition(anchorPoint);
						contextMenu.style.top = anchorPos.y + anchorPoint.offsetHeight + "px";
						contextMenu.style.left = anchorPos.x + anchorPoint.offsetWidth - 150 + "px";
					}
					showContextMenu(contextMenu);
				}
				break;

			case "Dropper":

				break;

			default:
				console.log("bad case in optionsMenuPopupClick()");
				break;
		}

		metronome.optionsMenuSetSelectedState();
	};


    /**
     * 
     */    
    optionsMenuOffsetClickPopupClick(option_type) {

		this.setOffsetClickStart(option_type);

		// clear other and select
		var myElements = document.querySelectorAll(".metronomeOptionsOffsetClickContextMenuItem");
		for (var i = 0; i < myElements.length; i++) {
			var thisItem = myElements[i];
			// remove active status
			addOrRemoveKeywordFromClass(thisItem, "menuChecked", false);

		}

		// turn on the new one selected
		addOrRemoveKeywordFromClassById("metronomeOptionsOffsetClickContextMenuOnThe" + option_type, "menuChecked", true);


		if (option_type != "1") { // 1 is the default state
			// add a check to the menu
			addOrRemoveKeywordFromClassById("metronomeOptionsContextMenuOffTheOne", "menuChecked", true);
		} else {

			addOrRemoveKeywordFromClassById("metronomeOptionsContextMenuOffTheOne", "menuChecked", false);
		}

		midiPlayer.noteHasChanged();
		this.optionsMenuSetSelectedState();
	};

	/**
     * 
     */    
    resetOptionsMenuOffsetClick() {
		// call with the default option
		root.optionsMenuOffsetClickPopupClick("1");
	};

	/**
     * 
     */    
    showAutoSpeedupConfiguration() {
		var popup = document.getElementById("metronomeAutoSpeedupConfiguration");

		if (popup) {
			popup.style.display = "block";
		}

		document.getElementById('metronomeAutoSpeedupTempoIncreaseAmountOutput').innerHTML = document.getElementById('metronomeAutoSpeedupTempoIncreaseAmount').value;
		document.getElementById('metronomeAutoSpeedupTempoIncreaseIntervalOutput').innerHTML = document.getElementById('metronomeAutoSpeedupTempoIncreaseInterval').value;
	};

	/**
     * 
     */    
    closeAutoSpeedupConfiguration(type) {
		var popup = document.getElementById("metronomeAutoSpeedupConfiguration");

		if (popup)
			popup.style.display = "none";
	};
}







function addInlineMetronomeSVG() {
    return '<svg class="midiMetronomeImage" version="1.1" width="30" height="30"' +
        'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" ' +
        'xml:space="preserve"><path d="M86.945,10.635c-0.863-0.494-1.964-0.19-2.455,0.673l-8.31,14.591l-2.891-1.745l-1.769,9.447l0.205,0.123' +
        'l-1.303,2.286L63.111,6.819c-0.25-1-1.299-1.819-2.33-1.819H37.608c-1.031,0-2.082,0.818-2.334,1.818L13.454,93.182' +
        'c-0.253,1,0.385,1.818,1.416,1.818h68.459c1.031,0,1.67-0.818,1.42-1.818L71.69,41.061l3.117-5.475l0.152,0.092l7.559-5.951' +
        'l-3.257-1.966l8.355-14.67C88.11,12.226,87.81,11.127,86.945,10.635z M71.58,70.625H54.855l12.946-22.737l5.197,20.789' +
        'C73.25,69.678,72.61,70.625,71.58,70.625z M50.714,70.625H26.57c-1.031,0-1.669-0.994-1.416-1.994L39.59,11.5' +
        'c0.253-1,1.303-1.812,2.334-1.812h14.431c1.032,0,2.081,0.725,2.331,1.725l7.854,31.421L50.714,70.625z"></path></svg>'
}
