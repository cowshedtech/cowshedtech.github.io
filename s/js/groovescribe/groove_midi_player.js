// Javascript for the Groove Scribe HTML application
// Groove Scribe is for drummers and helps create sheet music with an easy to use WYSIWYG groove editor.
//
// This is our MIDI player wrapper integrating MIDI.js into Groove Scribe
//


class MIDIPlayer {
    
    initialised = false;
    
    totalPlayTimeMsecs = 0;  // Culmative play time
    currentStartTime = 0;  // Start time of most recent play
    lastUpdateTime = 0;
    lastMidiTimeUpdate = 0;
    
    isPaused = false;
    shouldRepeat = true;
    
    eventCallbacks;
    noteHasChangedSinceLastDataLoad = false;

    containerIndex = 0;

    swingIsEnabled = true;

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

        if (this.initialised) return;            
        this.initialised = true;        

        let parent = this;

        MIDI.loadPlugin({
            soundfontUrl: this._getSoundFontLocation(),
            instruments: ["gunshot"],
            callback: function () {
                MIDI.programChange(9, 127); // use "Gunshot" instrument because I don't know how to create new ones
                
                // Successfully loaded MIDI plugin so lets init our MIDI play button
                parent._updatePlayButtonState(parent.containerIndex, 'Stopped');
                document.getElementById("midiPlayImage" + parent.containerIndex).onclick = function (event) {
                    midiPlayer.startOrStop();
                }; 
                setupHotKeys(); // spacebar to play
            }
        });
    };


    /**
     * 
     */
    _getSoundFontLocation() {
        return getGrooveUtilsBaseLocation() + "../soundfont/";
    };
    

    /**
     * 
     */
    getImageLocation() {
        return getGrooveUtilsBaseLocation() + "../images/";
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

    
    //
    // Time functions
    //

    /**
     * Return data representing when we started the most recent play
     */
    getStartTime() {
        return ;
    };

    
    /**
     * Reset the 
     */
    resetStartTime() {
        this.currentStartTime = new Date();
    };


    /**
     * calculate how long the midi has been playing total (since the last play/pause press)
     */
    getPlayTime() {
        const now = new Date();
        const playTimeDiff = new Date(now - this.currentStartTime);

        const totalPlayTime = document.getElementById("totalPlayTime");
        if (totalPlayTime) {
            if (!this.lastUpdateTime) {
                this.lastUpdateTime = this.currentStartTime;
            }
            
            const deltaTime = now - this.lastUpdateTime;
            this.totalPlayTimeMsecs += deltaTime;
            
            const totalTime = new Date(this.totalPlayTimeMsecs);
            const hours = totalTime.getUTCHours();
            const minutes = totalTime.getUTCMinutes().toString().padStart(2, '0');
            const seconds = totalTime.getSeconds().toString().padStart(2, '0');
            
            const timeString = hours > 0 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
            
            totalPlayTime.innerHTML = `Total Play Time: <span class="totalTimeNum">${timeString}</span> notes: <span class="totalTimeNum">${global_total_midi_notes}</span> repetitions: <span class="totalTimeNum">${global_total_midi_repeats}</span>`;
        }

        this.lastUpdateTime = now;
        return playTimeDiff;
    };


    /**
     * update the midi play timer on the player. Keeps track of how long we have been playing.
     */    
    updatePlayTime() {
        const totalTime = this.getPlayTime();
        const minutes = totalTime.getUTCMinutes();
        const seconds = totalTime.getSeconds();
        const time_string = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        const midiPlayTime = document.getElementById(`MIDIPlayTime${this.containerIndex}`);
        if (midiPlayTime) midiPlayTime.innerHTML = time_string;        
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
        
        if (this.isPaused && false === this.doesMidiDataNeedRefresh()) {
            this.currentStartTime = new Date();
            this.lastUpdateTime = 0;
            MIDI.Player.resume();
        } else {
            MIDI.Player.ctx.resume();
            this.currentStartTime = new Date();
            this.lastUpdateTime = 0;
            this.eventCallbacks.loadMidiDataEvent(true);
            MIDI.Player.stop();
            MIDI.Player.loop(this.shouldRepeat); // set the loop parameter
            MIDI.Player.start();
        }
        
        this._updatePlayButtonState(this.containerIndex, 'Playing');
        
        this.isPaused = false;
    };


    /**
     * Pauses  MIDI playback and resets player state
     */
    pause() {
        if (this.isPaused === true) return
        this.isPaused = true;
                
        MIDI.Player.pause();
        this._updatePlayButtonState(this.containerIndex, 'Paused');
        this.eventCallbacks.notePlaying("clear", -1);
        clearHighlightNoteInABCSVG(this.containerIndex);        
    };
    

    /**
     * Stop 
     */    
    stop() {
        if (!MIDI.Player.playing && !this.isPaused) return;

        // Reset player state
        this.isPaused = false;
        MIDI.Player.stop();
    
        this._updatePlayButtonState(this.containerIndex, 'Stopped');

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
        this.shouldRepeat = !this.shouldRepeat; // Toggle repeat state
        
        // Update MIDI player and UI
        MIDI.Player.loop(this.shouldRepeat);
        if (this.shouldRepeat)
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
        
        rootElement.innerHTML = this._HTMLForMidiPlayer(expandable);
        
        const uniqueIndex = this.containerIndex
        
        // Define event listeners configuration
        const eventListeners = [
            {
                id: `tempoInput${uniqueIndex}`,
                event: isIE10 ? 'click' : 'input',
                handler: midiPlayer.tempoUpdateFromSlider
            },
            {
                id: `tempoTextField${uniqueIndex}`,
                event: 'change',
                handler: midiPlayer.tempoUpdateFromTextField
            },
            {
                id: `swingInput${uniqueIndex}`,
                event: isIE10 ? 'click' : 'input',
                handler: grooveUtil.swingUpdateEvent
            },
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

		if (isTripletDivision(division) || division == 4)
			return false;

		return true;
	};


    //
    // used to update the on screen swing display
	// also the onClick handler for the swing slider
	swingUpdateText(swingAmount) {

		if (midiPlayer.swingIsEnabled === false) {
			document.getElementById('swingOutput' + this.containerIndex).innerHTML = "N/A";
		} else {
			document.getElementById('swingOutput' + this.containerIndex).innerHTML = "" + swingAmount + "%";
			// TODO
            // midiPlayer.swingPercent = swingAmount;
			midiPlayer.noteHasChanged();
		}

	};
    
    
    //
    //
    //
    getSwing() {
		var swing = 0;

		if (midiPlayer.swingIsEnabled) {
			var swingInput = document.getElementById("swingInput" + this.containerIndex);

			if (swingInput) {
				swing = parseInt(swingInput.value, 10);
				if (swing < 0 || swing > 60)
					swing = 0;
			}
		}

		return (swing);
	};

	
    //
    //
    //
    setSwing(swingAmount) {
		if (midiPlayer.swingIsEnabled === false)
			swingAmount = 0;

		midiPlayer.setSwingSlider(swingAmount);

		midiPlayer.swingUpdateText(swingAmount);  // update the output
	};

        
    //
    //
    //
    swingEnabled(trueElseFalse) {

		midiPlayer.swingIsEnabled = trueElseFalse;

		if (midiPlayer.swingIsEnabled === false) {
			midiPlayer.setSwing(0);
		} else {
			midiPlayer.swingUpdateText(midiPlayer.getSwing()); // remove N/A label
		}
	};
    
    //
    //
    //
    swingUpdateEvent(event) {

		if (root.swingIsEnabled === false) {
			midiPlayer.setSwingSlider(0);
		} else {
			midiPlayer.swingUpdateText(event.target.value);
			midiPlayer.updateRangeSlider('swingInput' + this.containerIndex);
		}
	};    
    
    //
    //
    //
    setSwingSlider(newSetting) {
		document.getElementById("swingInput" + this.containerIndex).value = newSetting;
		midiPlayer.updateRangeSlider('swingInput' + this.containerIndex);
	};


    //
    // Tempo functions
    //

    //
    //
    //
    getTempo() {
		var tempoInput = document.getElementById("tempoInput" + this.containerIndex);
		var tempo = constant_DEFAULT_TEMPO;

		if (tempoInput) {
			tempo = parseInt(tempoInput.value, 10);
			if (tempo < 19 && tempo > 281)
				tempo = constant_DEFAULT_TEMPO;
		}

		return tempo;
	};

    // update the tempo string display
	// called by the oninput handler everytime the range slider changes
	tempoUpdate(tempo) {
		document.getElementById('tempoTextField' + this.containerIndex).value = "" + tempo;

		midiPlayer.updateRangeSlider('tempoInput' + this.containerIndex);
		midiPlayer.noteHasChanged();

        // TODO
		// if (root.tempoChangeCallback)
		// 	root.tempoChangeCallback(tempo);
	};

	//
    //
    //
    tempoUpdateFromTextField(event) {
		var newTempo = event.target.value;

		document.getElementById("tempoInput" + this.containerIndex).value = newTempo;
		midiPlayer.tempoUpdate(newTempo);
	};

	//
    //
    //
    tempoUpdateFromSlider(event) {
		midiPlayer.tempoUpdate(event.target.value);
	};

    //
    //
    //
    setTempo(newTempo) {
		if (newTempo < 19 && newTempo > 281)
			return;

		document.getElementById("tempoInput" + this.containerIndex).value = newTempo;
		midiPlayer.tempoUpdate(newTempo);
	};

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
    _HTMLForMidiPlayer(expandable) {
        const touchClass = is_touch_device() ? ' touch' : '';

        // Build the base player controls
        const baseControls = `
            <div id="playerControl${this.containerIndex}" class="playerControl">
                <div class="playerControlsRow" id="playerControlsRow${this.containerIndex}">
                    <span title="Play/Pause" class="midiPlayImage" id="midiPlayImage${this.containerIndex}"></span>
                    <span class="MIDIPlayTime" id="MIDIPlayTime${this.containerIndex}">${midiPlayer.playTime}</span>`;

        // Optional metronome controls
        const metronomeControls = expandable ? `
                    <span title="Metronome controls" class="midiMetronomeMenu" id="midiMetronomeMenu${this.containerIndex}">
                        ${addInlineMetronomeSVG()}
                    </span>` : '';

        // Tempo and swing controls
        const tempoAndSwingControls = `
                    <span class="tempoAndProgress" id="tempoAndProgress${this.containerIndex}">
                        <div class="tempoRow">
                            <span class="tempoLabel">BPM</span>
                            <input type="text" 
                                   for="tempo" 
                                   class="tempoTextField" 
                                   pattern="\\d+" 
                                   id="tempoTextField${this.containerIndex}" 
                                   value="80">
                            <input type="range" 
                                   min="30" 
                                   max="300" 
                                   value="90" 
                                   class="tempoInput${touchClass}" 
                                   id="tempoInput${this.containerIndex}" 
                                   list="tempoSettings">
                        </div>
                        <div class="swingRow">
                            <span class="swingLabel">SWING</span>
                            <span for="swingAmount" 
                                  class="swingOutput" 
                                  id="swingOutput${this.containerIndex}">0% swing</span>
                            <input type="range" 
                                   min="0" 
                                   max="50" 
                                   value="0" 
                                   class="swingInput${touchClass}" 
                                   id="swingInput${this.containerIndex}" 
                                   list="swingSettings" 
                                   step="5">
                        </div>
                    </span>`;

        // Optional expand controls
        const expandControls = expandable ? `
                    <span title="Expand full screen in GrooveScribe" 
                          class="midiGSLogo" 
                          id="midiGSLogo${this.containerIndex}">
                        ${addInLineGScribeLogoLoneGSVG()}
                    </span>
                    <span title="Expand/Retract player" 
                          class="midiExpandImage" 
                          id="midiExpandImage${this.containerIndex}"></span>` : '';

        // Combine all components
        return `${baseControls}${metronomeControls}${tempoAndSwingControls}${expandControls}</div>`;
    }


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

        if (midiPlayer.lastMidiTimeUpdate && midiPlayer.lastMidiTimeUpdate < (data.now + 800)) {
            midiPlayer.updatePlayTime();
            midiPlayer.lastMidiTimeUpdate = data.now;
        }

        if (data.now < 16) {
            // this is considered the start.   It doesn't come in at zero for some reason
            // The second note should always be at least 16 ms behind the first
            //class_midi_note_num = 0;
            midiPlayer.lastMidiTimeUpdate = -1;
        }
        if (data.now == data.end) {

            // at the end of a song
            midiPlayer.eventCallbacks.notePlaying("complete", 1);

            if (midiPlayer.shouldRepeat) {

                global_total_midi_repeats++;

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
                global_total_midi_notes++;
                midiPlayer.eventCallbacks.notePlaying(note_type, percentComplete);
                // TODO Fix this
                // if (midiPlayer.root.highlightOn) highlightNoteInABCSVGFromPercentComplete(midiPlayer.root.midiPlayer.rootsUniqueIndex, midiPlayer.root.note_mapping_array, percentComplete, midiPlayer.root.numberOfMeasures, midiPlayer.root.repeatedMeasures);
                // if (midiPlayer.root.noteCallback) {
                //     midiPlayer.root.noteCallback(note_type);
                // }
            }
        }            
    }

    updateRangeSlider(sliderID) {

        var slider = document.getElementById(sliderID);
        var programaticCSSRules = document.getElementById(sliderID + "CSSRules");
        if (!programaticCSSRules) {
            // create a new one.
            programaticCSSRules = document.createElement('style');
            programaticCSSRules.id = sliderID + "CSSRules";
            document.body.appendChild(programaticCSSRules);
        }
    
        var style_before = document.defaultView.getComputedStyle(slider, ":before");
        var style_after = document.defaultView.getComputedStyle(slider, ":after");
        var before_color = style_before.getPropertyValue('color');
        var after_color = style_after.getPropertyValue('color');
    
        // change the before and after colors of the slider using a gradiant
        var percent = Math.ceil(((slider.value - slider.min) / (slider.max - slider.min)) * 100);
    
        var new_style_str = '#' + sliderID + '::-moz-range-track' + '{ background: -moz-linear-gradient(left, ' + before_color + ' ' + percent + '%, ' + after_color + ' ' + percent + '%)}\n';
        new_style_str += '#' + sliderID + '::-webkit-slider-runnable-track' + '{ background: -webkit-linear-gradient(left, ' + before_color + ' ' + '0%, ' + before_color + ' ' + percent + '%, ' + after_color + ' ' + percent + '%)}\n';
        programaticCSSRules.textContent = new_style_str;
    
    }


    /**
     * Updates the MIDI play button icon state
     * @param {string} containerIndex - The unique index for the container
     * @param {string} state - The state to set ('Playing', 'Stopped', or 'Paused')
     * @returns {void}
     */
    _updatePlayButtonState(containerIndex, state) {
        const icon = document.getElementById(`midiPlayImage${containerIndex}`);
        if (icon) {
            icon.className = `midiPlayImage ${state}`;
        }
    }
}


function midiEventCallbackClass() { };



