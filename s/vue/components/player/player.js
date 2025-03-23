// Javascript for the Groove Scribe HTML application
// Groove Scribe is for drummers and helps create sheet music with an easy to use WYSIWYG groove editor.
//
// This is our MIDI player wrapper integrating MIDI.js into Groove Scribe
//

/**
 * @readonly
 * @enum {string}
 */
const PlayerState = {
    UNINITIALISED: 'uninitialised',
    STOPPED: 'Stopped',
    PLAYING: 'Playing',
    PAUSED: 'Paused'
};


class MIDIPlayer {
    
    #initialised = false;
    containerIndex = 0;    
    
    #state = PlayerState.UNINITIALISED;
    #tempo = 80
    #swingIsEnabled = true;
    #swing = 0
    
    #totalPlayTimeMsecs = 0;  // Culmative play time
    #currentStartTime = 0;  // Start time of most recent play
    #lastUpdateTime = 0;
    #lastMidiTimeUpdate = 0;
    totalNotes = 0;
    totalRepeats = 0;
    #shouldRepeat = true;
    
    
    eventCallbacks;
    #changeHandlers = [];
    noteHasChangedSinceLastDataLoad = false;

    /**
     * 
     */    
    constructor(containerIndex) {
        this.playTime = "0:00";
        this.containerIndex = containerIndex;
    }        
    
    /**
     * 
     */    
    initialise() {

        if (this.#initialised) return;            
        this.#initialised = true;        

        let parent = this;

        MIDI.loadPlugin({
            soundfontUrl: this._getSoundFontLocation(),
            instruments: ["gunshot"],
            callback: function () {
                MIDI.programChange(9, 127); // use "Gunshot" instrument because I don't know how to create new ones
                
                // Successfully loaded MIDI plugin so lets init our MIDI play button
                parent.setState(PlayerState.STOPPED);
                setupHotKeys(); // spacebar to play
            }
        });
    };

    /**
     * Adds a new change event handler
     * @param {Function} handler - The callback function to be called when changes occur
     * @returns {Function} - A function to remove this handler
     */
    addChangeHandler(handler) {
        this.#changeHandlers.push(handler);
        return () => this.removeChangeHandler(handler);
    }

    /**
     * Removes a change event handler
     * @param {Function} handler - The callback function to remove
     */
    removeChangeHandler(handler) {
        const index = this.#changeHandlers.indexOf(handler);
        if (index !== -1) this.#changeHandlers.splice(index, 1);
    }

    /**
     * Notifies all registered handlers of a change
     */
    #notifyHandlers() {
        this.#changeHandlers.forEach(handler => handler());
    }

    /**
     * 
     */
    _getSoundFontLocation() {
        return getGrooveUtilsBaseLocation() + "../../soundfont/";
    };
    

    /**
     * 
     */
    getImageLocation() {
        return getGrooveUtilsBaseLocation() + "../../images/";
    };
    
    
    /**
     * 
     */
    loadFromURL(midiURL, tempo) {
        MIDI.Player.timeWarp = 1; // speed the song is played back
        MIDI.Player.BPM = tempo
        MIDI.Player.addListener(this.callback);
        MIDI.Player.loadFile(midiURL);
    };

    /**
     * Get the current state of the player
     * @returns {string} Current state ('Playing', 'Paused', or 'Stopped')
     */
    getState() {
        return this.#state;
    }

    /**
     * Set the current state of the player
     * @param {string} newState - New state ('Playing', 'Paused', or 'Stopped')
     */
    setState(newState) {
        if (newState !== this.#state) {
            this.#state = newState;
            this.#notifyHandlers();
        }
    }
    
    //
    // Time functions
    //

    /**
     * Return data representing when we started the most recent play
     */
    getStartTime() {
        return this.#currentStartTime;
    };

    
    /**
     * Reset the 
     */
    resetStartTime() {
        this.#currentStartTime = new Date();
    };


    /**
     * calculate how long the midi has been playing total (since the last play/pause press)
     */
    getPlayTimeThisPlay() {
        if (!this.#currentStartTime) this.resetStartTime();
        return new Date(new Date() - this.#currentStartTime);
    };

     /**
     * calculate how long the midi has been playing for all plays total (since player initialised)
     */   
    getPlayTimeTotal() {
        if (!this.#lastUpdateTime) {
            this.#lastUpdateTime = this.#currentStartTime;
        }
        
        const deltaTime = new Date() - this.#lastUpdateTime;
        this.#totalPlayTimeMsecs += deltaTime;
        this.#lastUpdateTime = new Date();
        return new Date(this.#totalPlayTimeMsecs);
    }; 

    //
    // Play and stop functions
    //

    /**
     * This is called so that the MIDI player will reload the groove at repeat time.   If not set then the midi player just repeats what is already loaded.
     */    
    noteHasChanged() {
        this.noteHasChangedSinceLastDataLoad = true;
    };


    /**
     * 
     */    
    resetNoteHasChanged() {
        this.noteHasChangedSinceLastDataLoad = false;
    };


    /**
     * 
     */    
    doesMidiDataNeedRefresh() {
        return this.noteHasChangedSinceLastDataLoad;
    }


    //
    // Play and stop functions
    //

    /**
     * Play single specific note
     */    
    playSingleNote(note_val) {
        if (MIDI.WebAudio) {
            MIDI.WebAudio.noteOn(9, note_val, constant_OUR_MIDI_VELOCITY_NORMAL, 0);
        } else if (MIDI.AudioTag) {
            MIDI.AudioTag.noteOn(9, note_val, constant_OUR_MIDI_VELOCITY_NORMAL, 0);
        }
    }

    
    /**
     * Play 
     */    
    play() {
        if (MIDI.Player.playing) return;
        
        if (this.getState() === PlayerState.PAUSED && false === this.doesMidiDataNeedRefresh()) {
            // this.#currentStartTime = new Date();
            this.resetStartTime();
            this.#lastUpdateTime = 0;
            MIDI.Player.resume();
        } else {
            MIDI.Player.ctx.resume();
            // this.#currentStartTime = new Date();
            this.resetStartTime();
            this.#lastUpdateTime = 0;
            this.eventCallbacks.loadMidiDataEvent(true);
            MIDI.Player.stop();
            MIDI.Player.loop(this.#shouldRepeat); // set the loop parameter
            MIDI.Player.start();
        }
        
        this.setState(PlayerState.PLAYING);
    };


    /**
     * Pauses  MIDI playback and resets player state
     */
    pause() {
        if (this.getState() === PlayerState.PAUSED) return
                
        MIDI.Player.pause();
        this.setState(PlayerState.PAUSED);
        this.eventCallbacks.notePlaying("clear", -1);
        clearHighlightNoteInABCSVG(this.containerIndex);        
    };
    

    /**
     * Stop 
     */    
    stop() {
        if (!MIDI.Player.playing && this.getState() !== PlayerState.PAUSED) return;

        // Reset player state
        this.setState(PlayerState.STOPPED);
        MIDI.Player.stop();
    
        this.eventCallbacks.notePlaying("clear", -1);
        clearHighlightNoteInABCSVG(this.containerIndex);
        metronome.resetOptionsOffsetClickStartRotation();
    };


    /**
     * toggle stop and start 
     */    
    startOrStop() {
        MIDI.Player.playing ? this.stop() : this.play();
    };


    /**
     * toggle pause and start 
     */    
    startOrPause() {
        MIDI.Player.playing ? this.pause() : this.play();
    };

    
    /**
     * Toggles MIDI playback repeat mode
     */
    repeatToggle() {
        this.#shouldRepeat = !this.#shouldRepeat; // Toggle repeat state
        
        // Update MIDI player and UI
        MIDI.Player.loop(this.#shouldRepeat);
        if (this.#shouldRepeat)
            document.getElementById("midiRepeatImage" + this.containerIndex).src = midiPlayer.getImageLocation() + "repeat.png";
        else
            document.getElementById("midiRepeatImage" + this.containerIndex).src = midiPlayer.getImageLocation() + "grey_repeat.png";
    }


    //
    // Setup and display functions
    //

    //
    // pass in a tag ID.  (not a class)
    // HTML will be put within the tag replacing whatever else was there
    AddMidiPlayerToPage(grooveUtil, HTML_Id_to_attach_to, division, expandable) {
        const rootElement = document.getElementById(HTML_Id_to_attach_to);
        if (!rootElement) return;
        
        const uniqueIndex = this.containerIndex
        
        // Define event listeners configuration
        const eventListeners = [
            {
                id: `midiRepeatImage${uniqueIndex}`,
                event: 'click',
                handler: midiPlayer.repeatToggle
            },
            {
                id: `midiExpandImage${uniqueIndex}`,
                event: 'click',
                handler: midiPlayer.expandOrRetractMIDI_playback
            },
            {
                id: `midiGSLogo${uniqueIndex}`,
                event: 'click',
                handler: grooveUtil.loadFullScreenGrooveScribe
            },
            {
                id: `midiMetronomeMenu${uniqueIndex}`,
                event: 'click',
                handler: metronome.miniMenuClick
            }
        ];

        // Attach event listeners
        eventListeners.forEach(({ id, event, handler }) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener(event, handler, false);
            }
        });

        // Enable or disable swing
        midiPlayer.swingEnabled(midiPlayer.doesDivisionSupportSwing(division));
    }


    //
    // Swing functions
    //
    
    //
    //
    //
    doesDivisionSupportSwing(division) {
		if (isTripletDivision(division) || division == 4) return false;
		return true;
	};


    //
    //
    //
    swingEnabled(trueElseFalse) {
		midiPlayer.#swingIsEnabled = trueElseFalse;
		if (midiPlayer.#swingIsEnabled === false) {
			midiPlayer.setSwing(0);
		} else {
			// midiPlayer.swingUpdateText(midiPlayer.getSwing()); // remove N/A label
		}
	};

    //
    //
    //
    getSwing() {
		return this.#swing
	};
 
	
    //
    //
    //
    setSwing(swingAmount) {
		if (swingAmount < 0 || swingAmount > 60)
            swingAmount = 0;
            
        if (midiPlayer.#swingIsEnabled === false)
			this.#swing = 0;

        this.#swing = swingAmount
		midiPlayer.noteHasChanged();
        midiPlayer.#notifyHandlers();
        midiPlayer.swingChangeCallback();
	};

    
            
     // called every time the tempo changes, which can be a lot of times due to the range slider
	// update the main URL with the tempo, but only do it every third of a second at the most
	swingChangeCallbackTimeout = null;
	swingChangeCallback() {

		// if there is a timeout running clear it
		if (this.swingChangeCallbackTimeout != null)
			window.clearTimeout(this.swingChangeCallbackTimeout);

		// set a new timeout
		this.swingChangeCallbackTimeout = window.setTimeout(function () {
			this.swingChangeCallbackTimeout = null
            // TODO
			// update the Main URL to show the new tempo
			updateCurrentURL();
		}, 300);
	}



    //
    // Tempo functions
    //

    //
    //
    //
    getTempo() {
		return this.#tempo;
	};

    //
    //
    //
    setTempo(newTempo) {
		if (newTempo < 19 && newTempo > 281) return;

        this.#tempo = newTempo;
		midiPlayer.#notifyHandlers();
        midiPlayer.noteHasChanged();
        this.tempoChangeCallback(this.#tempo);
	};

    
    /*
    * called every time the tempo changes, which can be a lot of times due to the range slider
	* update the main URL with the tempo, but only do it every third of a second at the most
    */ 
	tempoChangeCallbackTimeout = null;
	tempoChangeCallback(newTempo) {

		// if there is a timeout running clear it
		if (this.tempoChangeCallbackTimeout != null)
			window.clearTimeout(this.tempoChangeCallbackTimeout);

		// set a new timeout
		this.tempoChangeCallbackTimeout = window.setTimeout(function () {
			this.tempoChangeCallbackTimeout = null
            updateCurrentURL();
		}, 300);
	}

    //
    //
    //
    upTempo() {
		var tempo = midiPlayer.getTempo();
		tempo++;
		midiPlayer.setTempo(tempo);
	};

	//
    //
    //
    downTempo() {
		var tempo = midiPlayer.getTempo();
		tempo--;
		midiPlayer.setTempo(tempo);
	};


    //
    // Core display functions
    //

    //
    //
    //
    // _HTMLForMidiPlayer(expandable) {
    //     const touchClass = isTouchDevice() ? ' touch' : '';

    //     // Build the base player controls
    //     const baseControls = `
    //         <div id="playerControl${this.containerIndex}" class="playerControl">
    //             <div class="playerControlsRow" id="playerControlsRow${this.containerIndex}">
    //                 <span title="Play/Pause" class="midiPlayImage" id="midiPlayImage${this.containerIndex}"></span>
    //                 <span class="MIDIPlayTime" id="MIDIPlayTime${this.containerIndex}">${midiPlayer.playTime}</span>`;

    //     // Optional metronome controls
    //     const metronomeControls = expandable ? `
    //                 <span title="Metronome controls" class="midiMetronomeMenu" id="midiMetronomeMenu${this.containerIndex}">
    //                     ${addInlineMetronomeSVG()}
    //                 </span>` : '';

    //     // Tempo and swing controls
    //     const tempoAndSwingControls = `
    //                 <span class="tempoAndProgress" id="tempoAndProgress${this.containerIndex}">
    //                     <div class="tempoRow">
    //                         <span class="tempoLabel">BPM</span>
    //                         <input type="text" 
    //                                for="tempo" 
    //                                class="tempoTextField" 
    //                                pattern="\\d+" 
    //                                id="tempoTextField${this.containerIndex}" 
    //                                value="80">
    //                         <input type="range" 
    //                                min="30" 
    //                                max="300" 
    //                                value="90" 
    //                                class="tempoInput${touchClass}" 
    //                                id="tempoInput${this.containerIndex}" 
    //                                list="tempoSettings">
    //                     </div>
    //                     <div class="swingRow">
    //                         <span class="swingLabel">SWING</span>
    //                         <span for="swingAmount" 
    //                               class="swingOutput" 
    //                               id="swingOutput${this.containerIndex}">0% swing</span>
    //                         <input type="range" 
    //                                min="0" 
    //                                max="50" 
    //                                value="0" 
    //                                class="swingInput${touchClass}" 
    //                                id="swingInput${this.containerIndex}" 
    //                                list="swingSettings" 
    //                                step="5">
    //                     </div>
    //                 </span>`;

    //     // Optional expand controls
    //     const expandControls = expandable ? `
    //                 <span title="Expand full screen in GrooveScribe" 
    //                       class="midiGSLogo" 
    //                       id="midiGSLogo${this.containerIndex}">
    //                     ${addInLineGScribeLogoLoneGSVG()}
    //                 </span>
    //                 <span title="Expand/Retract player" 
    //                       class="midiExpandImage" 
    //                       id="midiExpandImage${this.containerIndex}"></span>` : '';

    //     // Combine all components
    //     return `${baseControls}${metronomeControls}${tempoAndSwingControls}${expandControls}</div>`;
    // }


    //
    //
    //
    expandOrRetractMIDIPlayback(force, expandElseContract) {

        var playerControlElement = document.getElementById('playerControl' + this.containerIndex);
        var playerControlRowElement = document.getElementById('playerControlsRow' + this.containerIndex);
        var tempoAndProgressElement = document.getElementById('tempoAndProgress' + this.containerIndex);
        var midiMetronomeMenuElement = document.getElementById('midiMetronomeMenu' + this.containerIndex);
        var gsLogoLoadFullGSElement = document.getElementById('midiGSLogo' + this.containerIndex);
        var midiExpandImageElement = document.getElementById('midiExpandImage' + this.containerIndex);
        var midiPlayTime = document.getElementById('MIDIPlayTime' + this.containerIndex);
    
        if (playerControlElement.className.indexOf("small") > -1 || (force && expandElseContract)) {
            // make large
            playerControlElement.className = playerControlElement.className.replace(" small", "") + " large";
            playerControlRowElement.className = playerControlRowElement.className.replace(" small", "") + " large";
            tempoAndProgressElement.className = tempoAndProgressElement.className.replace(" small", "") + " large";
            midiMetronomeMenuElement.className = midiMetronomeMenuElement.className.replace(" small", "") + " large";
            gsLogoLoadFullGSElement.className = gsLogoLoadFullGSElement.className.replace(" small", "") + " large";
            midiExpandImageElement.className = midiExpandImageElement.className.replace(" small", "") + " large";
            midiPlayTime.className = midiPlayTime.className.replace(" small", "") + " large";
        } else {
            // make small
            playerControlElement.className = playerControlElement.className.replace(" large", "") + " small";
            playerControlRowElement.className = playerControlRowElement.className.replace(" large", "") + " small";
            midiMetronomeMenuElement.className = midiMetronomeMenuElement.className.replace(" large", "") + " small";
            tempoAndProgressElement.className = tempoAndProgressElement.className.replace(" large", "") + " small";
            gsLogoLoadFullGSElement.className = gsLogoLoadFullGSElement.className.replace(" large", "") + " small";
            midiExpandImageElement.className = midiExpandImageElement.className.replace(" large", "") + " small";
            midiPlayTime.className = midiPlayTime.className.replace(" large", "") + " small";
        }
    
    };


    /**
     * 
     */
    callback(data) {
        var percentComplete = (data.now / data.end);
        
        // midiPlayer.eventCallbacks.percentProgress(midiPlayer.eventCallbacks.classRoot, percentComplete * 100);

        if (midiPlayer.#lastMidiTimeUpdate && midiPlayer.#lastMidiTimeUpdate < (data.now + 800)) {
            midiPlayer.#notifyHandlers();
            midiPlayer.#lastMidiTimeUpdate = data.now;
        }

        if (data.now < 16) {
            // this is considered the start.   It doesn't come in at zero for some reason
            // The second note should always be at least 16 ms behind the first
            //class_midi_note_num = 0;
            midiPlayer.#lastMidiTimeUpdate = -1;
        }
        if (data.now == data.end) {

            // at the end of a song
            midiPlayer.eventCallbacks.notePlaying("complete", 1);

            if (midiPlayer.#shouldRepeat) {

                midiPlayer.totalRepeats++;

                // regenerate the MIDI if the data needs refreshing or the OffsetClick is rotating every time
                // advanceOptionsOffsetClickStartRotation will return false if not rotating
                if (metronome.advanceOptionsOffsetClickStartRotation() || midiPlayer.doesMidiDataNeedRefresh()) {
                    MIDI.Player.stop();
                    midiPlayer.eventCallbacks.loadMidiDataEvent(midiPlayer.eventCallbacks.classRoot, false);
                    MIDI.Player.start();                    
                }                
            } else {
                MIDI.Player.stop();  // not repeating, so stopping               
            }
        }

        // note on
        var note_type = false;
        if (data.message == 144) {
            if (data.note == constant_OUR_MIDI_METRONOME_1 || data.note == constant_OUR_MIDI_METRONOME_NORMAL) {
                note_type = "metronome";
            } else if (data.note == constant_OUR_MIDI_HIHAT_NORMAL || data.note == constant_OUR_MIDI_HIHAT_OPEN ||
                data.note == constant_OUR_MIDI_HIHAT_ACCENT || data.note == constant_OUR_MIDI_HIHAT_CRASH ||
                data.note == constant_OUR_MIDI_HIHAT_RIDE || data.note == constant_OUR_MIDI_HIHAT_STACKER ||
                data.note == constant_OUR_MIDI_HIHAT_RIDE_BELL || data.note == constant_OUR_MIDI_HIHAT_COW_BELL ||
                data.note == constant_OUR_MIDI_HIHAT_METRONOME_NORMAL || data.note == constant_OUR_MIDI_HIHAT_METRONOME_NORMAL) {
                note_type = "hi-hat";
            } else if (data.note == constant_OUR_MIDI_SNARE_NORMAL || data.note == constant_OUR_MIDI_SNARE_ACCENT ||
                data.note == constant_OUR_MIDI_SNARE_GHOST || data.note == constant_OUR_MIDI_SNARE_XSTICK ||
                data.note == constant_OUR_MIDI_SNARE_FLAM || data.note == constant_OUR_MIDI_SNARE_DRAG ||
                data.note == constant_OUR_MIDI_SNARE_BUZZ) {
                note_type = "snare";
            } else if (data.note == constant_OUR_MIDI_KICK_NORMAL || data.note == constant_OUR_MIDI_HIHAT_FOOT) {
                note_type = "kick";
            } else if (data.note == constant_OUR_MIDI_TOM1_NORMAL || data.note == constant_OUR_MIDI_TOM2_NORMAL || data.note == constant_OUR_MIDI_TOM3_NORMAL || data.note == constant_OUR_MIDI_TOM4_NORMAL) {
                note_type = "tom";
            }
            if (note_type) {
                midiPlayer.totalNotes++;
                midiPlayer.eventCallbacks.notePlaying(note_type, percentComplete);
                // TODO Fix this
                // if (midiPlayer.root.highlightOn) highlightNoteInABCSVGFromPercentComplete(midiPlayer.root.midiPlayer.rootsUniqueIndex, midiPlayer.root.noteMappingArray, percentComplete, midiPlayer.root.numberOfMeasures, midiPlayer.root.repeatedMeasures);
                 if (options.highlightOn) highlightNoteInABCSVGFromPercentComplete(editor.track.trackID, editor.track.noteMappingArray, percentComplete, editor.track.numberOfMeasures, editor.track.repeatedMeasures);
                // if (editor.oteCallback) {
                // if (midiPlayer.root.noteCallback) {
                //     midiPlayer.root.noteCallback(note_type);
                // }
            }
        }            
    }

    // open a new tab with GrooveScribe with the current groove
	loadFullScreenGrooveScribe() {
		var fullURL = getUrlStringFromGrooveData(root.track, options, midiPlayer, metronome, 'fullGrooveScribe')

		var win = window.open(fullURL, '_blank');
		win.focus();
	};
}


function midiEventCallbackClass() { };



