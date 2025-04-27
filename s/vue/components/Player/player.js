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
    UNINITIALISED: 'Uninitialised',
    STOPPED: 'Stopped',
    PLAYING: 'Playing',
    PAUSED: 'Paused'
};

const EventTypes = {
    PARAMETERS_UPDATE: 'parametersUpdate',
    PLAY_STATE: 'playState',
    PLAY_PROGRESS: 'playProgress',
    PLAY_COMPLETE: 'playComplete'
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
    noteHasChangedSinceLastDataLoad = false;
    
    /**
     * 
     */    
    constructor(containerIndex) {
        this.playTime = "0:00";
        this.containerIndex = containerIndex;
    }        
    

    // TODO
    //this.setSwingEnabled(this.doesDivisionSupportSwing(division));

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

    //
    //
    //

    
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
            window.eventBus.$emit(EventTypes.PLAY_STATE, { isPlaying: this.isPlaying });
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
            this.resetStartTime();
            this.#lastUpdateTime = 0;
            MIDI.Player.resume();
        } else {
            MIDI.Player.ctx.resume();
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
        // this.eventCallbacks.notePlaying("clear", -1);
        window.eventBus.$emit(EventTypes.PLAY_STATE);
    };
    

    /**
     * Stop 
     */    
    stop() {
        if (!MIDI.Player.playing && this.getState() !== PlayerState.PAUSED) return;

        // Reset player state
        this.setState(PlayerState.STOPPED);
        MIDI.Player.stop();
    
        // this.eventCallbacks.notePlaying("clear", -1);
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
    isSwingEnabled() {
        return this.#swingIsEnabled
    }

    //
    //
    //
    setSwingEnabled(trueElseFalse) {
		this.#swingIsEnabled = trueElseFalse;
		if (this.#swingIsEnabled === false) {
			this.setSwing(0);
		} else {
			// this.swingUpdateText(this.getSwing()); // remove N/A label
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
            
        if (this.#swingIsEnabled === false)
			swingAmount = 0;

        this.#swing = swingAmount
		this.noteHasChanged();
        window.eventBus.$emit(EventTypes.PARAMETERS_UPDATE, { swingAmount });
	};


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
        window.eventBus.$emit(EventTypes.PARAMETERS_UPDATE, { newTempo });
        this.noteHasChanged();        
	};


    //
    //
    //
    upTempo() {
		var tempo = this.getTempo();
		tempo++;
		this.setTempo(tempo);
	};

	//
    //
    //
    downTempo() {
		var tempo = this.getTempo();
		tempo--;
		this.setTempo(tempo);
	};
    

    /**
     * 
     */
    callback(data) {
        var percentComplete = (data.now / data.end);
        
        let parent = this;
        // this.eventCallbacks.percentProgress(this.eventCallbacks.classRoot, percentComplete * 100);

        if (midiPlayer.#lastMidiTimeUpdate && midiPlayer.#lastMidiTimeUpdate < (data.now + 800)) {
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
            // midiPlayer.eventCallbacks.notePlaying("complete", 1);
            window.eventBus.$emit(EventTypes.PLAY_COMPLETE);

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
                // midiPlayer.eventCallbacks.notePlaying(note_type, percentComplete);
                // TODO Fix midiPlayer
                window.eventBus.$emit(EventTypes.PLAY_PROGRESS, { percentComplete: percentComplete });
                // if (editor.oteCallback) {
                // if (midiPlayer.root.noteCallback) {
                //     midiPlayer.root.noteCallback(note_type);
                // }
            }
        }            
    }

    // open a new tab with GrooveScribe with the current groove
	loadFullScreenGrooveScribe() {
		var fullURL = getUrlStringFromGrooveData(editor.track, options, midiPlayer, metronome, 'fullGrooveScribe')
		var win = window.open(fullURL, '_blank');
		win.focus();
	};


}


function midiEventCallbackClass() { };