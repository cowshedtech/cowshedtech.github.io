// Javascript for the Groove Scribe HTML application

class Metronome {

    #frequency = 0;
    #solo = false;
    #offsetClickStart = "1";
    #offsetClickStartRotation = 0;
    
    #autoSpeedUpActive = false;
    #autoSpeedUpForEver = false;
    #autoSpeedUpTempoIncreaseAmount = 5
    #autoSpeedUpTempoIncreaseInterval = 2
    #countInActive = false;
    #countInIsPlaying = false;
	
    constructor(containerIndex) { }

    /**
     * Gets the current frequency
     * @returns {number} The current frequency
     */
    getFrequency() {
        return this.#frequency;
    }

    /**
     * Sets a new frequency and notifies handlers
     * @param {number} newFrequency - The new frequency to set
     */
    setFrequency(newFrequency) {
        this.#frequency = newFrequency;
        window.eventBus.$emit('metronome-updated');
    }


    /**
     * 
     */    
    getSolo() {
        return this.#solo;
    };
    
    /**
     * 
     */    
    setSolo(trueElseFalse) {
        this.#solo = trueElseFalse;
        if (this.#solo && this.getFrequency() === 0)
            this.setFrequency(4);

        window.eventBus.$emit('metronome-updated');
    };

    /**
     * Gets the current frequency
     * @returns {number} The current frequency
     */
    isAutoSpeedUpActive() {
        return this.#autoSpeedUpActive;
    }

    /**
     * Sets a new frequency and notifies handlers
     * @param {number} newFrequency - The new frequency to set
     */
    setAutoSpeedUpActive(active) {
        this.#autoSpeedUpActive = active;
        window.eventBus.$emit('metronome-updated');
    }
    
    /**
     * Sets a new frequency and notifies handlers
     * @param {number} newFrequency - The new frequency to set
     */
    setAutoSpeedUpForever(forever) {
        this.#autoSpeedUpForEver = active;
        window.eventBus.$emit('metronome-updated');
    }

    /**
     *     
     */
    getAutoSpeedUpForever() {
        return this.#autoSpeedUpForEver;
    }

    /**
     *     
     */
    setAutoSpeedUpTempoIncreaseAmount(amount) {
        this.#autoSpeedUpTempoIncreaseAmount = amount
        window.eventBus.$emit('metronome-updated');
    }

    /**
     *     
     */
    getAutoSpeedUpTempoIncreaseAmount() {
        return this.#autoSpeedUpTempoIncreaseAmount
    }

    /**
     *     
     */
    setAutoSpeedUpTempoIncreaseInterval(amount) {
        this.#autoSpeedUpTempoIncreaseInterval = amount
        window.eventBus.$emit('metronome-updated');
    }

    /**
     *     
     */
    getAutoSpeedUpTempoIncreaseInterval() {
        return this.#autoSpeedUpTempoIncreaseInterval
    }
    
    /**
     * Gets the current frequency
     * @returns {number} The current frequency
     */
    getCountInActive() {
        return this.#countInActive;
    }

    /**
     * Sets a new frequency and notifies handlers
     * @param {number} newFrequency - The new frequency to set
     */
    setCountInActive(active) {
        this.#countInActive = active;
        window.eventBus.$emit('metronome-updated');
    }

    /**
     * Gets the current frequency
     * @returns {number} The current frequency
     */
    isCountInPlaying() {
        return this.#countInIsPlaying;
    }

    /**
     * Sets a new frequency and notifies handlers
     * @param {number} newFrequency - The new frequency to set
     */
    setCountInIsPlaying(active) {
        this.#countInIsPlaying = active;
    }

    /**
     * Gets the current offset click start value
     * @returns {string} The current offset click start value
     */    
    getOffsetClickStart() {
        return this.#offsetClickStart;
    };
    
    /**
     * Gets whether the offset click start is set to rotate
     * @returns {boolean} True if the offset click start is set to rotate, false otherwise
     */    
    getOffsetClickStartIsRotating() {
        return this.#offsetClickStart === 'ROTATE';
    };
    
    /**
     * Sets the offset click start value and notifies handlers
     * @param {string} value - The new offset click start value
     */    
    setOffsetClickStart(value) {
        this.#offsetClickStart = value;
        window.eventBus.$emit('metronome-updated');
    };

    /**
     * if the Metronome offset click start is set to rotate this
     * will advance the position of the rotation and return TRUE
     * returns FALSE if rotation is OFF     
     */    
    advanceOptionsOffsetClickStartRotation(isTriplets) {
        if (this.getOffsetClickStartIsRotating()) {
            this.#offsetClickStartRotation++;
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
            if (isTriplets && this.#offsetClickStartRotation > 2)
                this.#offsetClickStartRotation = 0;
            else if (this.#offsetClickStartRotation > 3)
                this.#offsetClickStartRotation = 0;
    
            switch (this.#offsetClickStartRotation) {
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
        return this.#offsetClickStartRotation = 0;
    };

    //
    //
    //
	
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
    // showAutoSpeedupConfiguration() {
	// 	var popup = document.getElementById("metronomeAutoSpeedupConfiguration");

	// 	if (popup) {
	// 		popup.style.display = "block";
	// 	}

	// 	document.getElementById('metronomeAutoSpeedupTempoIncreaseAmountOutput').innerHTML = document.getElementById('metronomeAutoSpeedupTempoIncreaseAmount').value;
	// 	document.getElementById('metronomeAutoSpeedupTempoIncreaseIntervalOutput').innerHTML = document.getElementById('metronomeAutoSpeedupTempoIncreaseInterval').value;
	// };

	// /**
    //  * 
    //  */    
    // closeAutoSpeedupConfiguration(type) {
	// 	var popup = document.getElementById("metronomeAutoSpeedupConfiguration");

	// 	if (popup)
	// 		popup.style.display = "none";
	// };
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


function metronomeEventCallbackClass() { };