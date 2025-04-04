
//
//
export default {
  data() {
    return {
      measureIndex: 1,
      repeatCount: 2
    }
  },

  template: `
    <div class="line-labels">
      <div class="hh-label">Hi-hat</div>
      <div class="tom-label" id="tom1-label">Tom</div>
      <div class="snare-label">Snare</div>
      <div class="tom-label" id="tom4-label">Tom</div>
      <div class="kick-label">Kick</div>
    </div>`
}

{/* 
    <div class="tom-label" id="tom1-label" onClick="noteLabelClick(event, 'tom1', ${baseindex})" oncontextmenu="event.preventDefault(); noteLabelClick(event, 'tom1', ${baseindex})">Tom</div>
    <div class="snare-label" onClick="noteLabelClick(event, 'snare', ${baseindex})" oncontextmenu="event.preventDefault(); noteLabelClick(event, 'snare', ${baseindex})">Snare</div>
    <div class="tom-label" id="tom4-label" onClick="noteLabelClick(event, 'tom4', ${baseindex})" oncontextmenu="event.preventDefault(); noteLabelClick(event, 'tom4', ${baseindex})">Tom</div>
    <div class="kick-label" onClick="noteLabelClick(event, 'kick', ${baseindex})" oncontextmenu="event.preventDefault(); noteLabelClick(event, 'kick', ${baseindex})">Kick</div> */}