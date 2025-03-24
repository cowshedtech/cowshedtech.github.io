import PlayButton from './play_button.js'
import Timer from './timer.js'
import Tempo from './tempo.js'
import Swing from './swing.js'

export default {
  data() {
    return {
      containerIndex: midiPlayer?.containerIndex || 1,
      expandable: false
    }
  },
  props: {},
  mounted() {
    if (midiPlayer && this.containerIndex !== midiPlayer.containerIndex) {
      this.containerIndex = midiPlayer.containerIndex
    }
  },
  components: {
    PlayButton, Timer, Tempo, Swing
  },
  methods: {
    handleFullScreen() {
        midiPlayer.loadFullScreenGrooveScribe();        
    },
    handleExpand() {
      console.log(`expandOrRetractMIDIPlayback`)
    }
    ,
    handleMetronomeMenu() {
      console.log(`handleMetronomeMenu metronome.miniMenuClick`)
    }
    ,
    handleRepeat() {
      console.log(`handleRepeat repeatToggle`)
    }
  },
  template: `
    <div id="midiPlayer" class="fullWidthEle">
      <div :id="'playerControl' + containerIndex" class="playerControl">
          <div :id="'playerControlsRow' + containerIndex" class="playerControlsRow">
              <PlayButton></PlayButton>
              <Timer></Timer>
              <span 
                  v-if="expandable" 
                  title="Metronome controls" 
                  class="midiMetronomeMenu" 
                  :id="'midiMetronomeMenu' + containerIndex"
                  @click="handleMetronomeMenu"
              >
              ${addInlineMetronomeSVG()}
              </span>
              <span class="tempoAndProgress" :id="'tempoAndProgress' + containerIndex">
                  <Tempo></Tempo>
                  <Swing></Swing>
              </span>
              <span 
                  v-if="expandable" 
                  title="Expand full screen in GrooveScribe" 
                  class="midiGSLogo" 
                  :id="'midiGSLogo' + containerIndex"
                  @click="handleFullScreen">
                  ${addInLineGScribeLogoLoneGSVG()}
              </span>
              <span v-if="expandable" title="Expand/Retract player"  class="midiExpandImage" :id="'midiExpandImage' + containerIndex" @click="handleExpand">Hello</span>              
            </div>    
        </div>
   </div>
`
}


/**
 * Toggles MIDI playback repeat mode
 */
// repeatToggle() {
//   this.#shouldRepeat = !this.#shouldRepeat; // Toggle repeat state
  
//   // Update MIDI player and UI
//   MIDI.Player.loop(this.#shouldRepeat);
//   if (this.#shouldRepeat)
//       document.getElementById("midiRepeatImage" + this.containerIndex).src = this.getImageLocation() + "repeat.png";
//   else
//       document.getElementById("midiRepeatImage" + this.containerIndex).src = this.getImageLocation() + "grey_repeat.png";
// }

// Enable or disable swing
//this.setSwingEnabled(this.doesDivisionSupportSwing(division));


 //
    //
    //
    // expandOrRetractMIDIPlayback(force, expandElseContract) {

    //     var playerControlElement = document.getElementById('playerControl' + this.containerIndex);
    //     var playerControlRowElement = document.getElementById('playerControlsRow' + this.containerIndex);
    //     var tempoAndProgressElement = document.getElementById('tempoAndProgress' + this.containerIndex);
    //     var midiMetronomeMenuElement = document.getElementById('midiMetronomeMenu' + this.containerIndex);
    //     var gsLogoLoadFullGSElement = document.getElementById('midiGSLogo' + this.containerIndex);
    //     var midiExpandImageElement = document.getElementById('midiExpandImage' + this.containerIndex);
    //     var midiPlayTime = document.getElementById('MIDIPlayTime' + this.containerIndex);
    
    //     if (playerControlElement.className.indexOf("small") > -1 || (force && expandElseContract)) {
    //         // make large
    //         playerControlElement.className = playerControlElement.className.replace(" small", "") + " large";
    //         playerControlRowElement.className = playerControlRowElement.className.replace(" small", "") + " large";
    //         tempoAndProgressElement.className = tempoAndProgressElement.className.replace(" small", "") + " large";
    //         midiMetronomeMenuElement.className = midiMetronomeMenuElement.className.replace(" small", "") + " large";
    //         gsLogoLoadFullGSElement.className = gsLogoLoadFullGSElement.className.replace(" small", "") + " large";
    //         midiExpandImageElement.className = midiExpandImageElement.className.replace(" small", "") + " large";
    //         midiPlayTime.className = midiPlayTime.className.replace(" small", "") + " large";
    //     } else {
    //         // make small
    //         playerControlElement.className = playerControlElement.className.replace(" large", "") + " small";
    //         playerControlRowElement.className = playerControlRowElement.className.replace(" large", "") + " small";
    //         midiMetronomeMenuElement.className = midiMetronomeMenuElement.className.replace(" large", "") + " small";
    //         tempoAndProgressElement.className = tempoAndProgressElement.className.replace(" large", "") + " small";
    //         gsLogoLoadFullGSElement.className = gsLogoLoadFullGSElement.className.replace(" large", "") + " small";
    //         midiExpandImageElement.className = midiExpandImageElement.className.replace(" large", "") + " small";
    //         midiPlayTime.className = midiPlayTime.className.replace(" large", "") + " small";
    //     }
    
    // };