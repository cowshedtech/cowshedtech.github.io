export default {
    data() {
      return { }
    },
    props: { },
    template: `
      <div class="noteContextMenu">
          <ul id="metronomeOptionsOffsetClickForTripletsContextMenu" class="list">
              <li class="metronomeOptionsOffsetClickContextMenuItem menuChecked" id="metronomeOptionsOffsetClickContextMenuOnThe1Triplet"  onclick='metronome.optionsMenuOffsetClickPopupClick("1");'>Start on "<b>1</b>"</li>
              <li class="metronomeOptionsOffsetClickContextMenuItem" id="metronomeOptionsOffsetClickContextMenuOnTheTI" onclick='metronome.optionsMenuOffsetClickPopupClick("TI");'>Start on "<b>&amp;</b>"</li>
              <li class="metronomeOptionsOffsetClickContextMenuItem" id="metronomeOptionsOffsetClickContextMenuOnTheTA" onclick='metronome.optionsMenuOffsetClickPopupClick("TA");'>Start on "<b>A</b>"</li>
              <li class="metronomeOptionsOffsetClickContextMenuItem" id="metronomeOptionsOffsetClickContextMenuOnTheROTATE"   onclick='metronome.optionsMenuOffsetClickPopupClick("ROTATE");'>Rotate through</li>
          </ul>
      </div>
  `
  }