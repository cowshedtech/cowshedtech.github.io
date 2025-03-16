//
//
function generateMeasureButtons(class_number_of_measures, baseindex, repeat) {
    var buttonsHTML = '';

    buttonsHTML += '<div style="display: inline-block;vertical-align: top; margin-top: 15px; margin-left: 15px; margin-right: 15px">'

    if (class_number_of_measures > 1)
        buttonsHTML += '<div title="Remove Measure" id="closeMeasureButton' + baseindex + '" onClick="myGrooveWriter.closeMeasureButtonClick(' + baseindex + ')" class="closeMeasureButton"><i class="fa fa-times-circle"></i></div>';
    else
        buttonsHTML += '<div class="closeMeasureButton"><i class="fa"></i></div>';

    buttonsHTML += '<div title="Repeat Measure" id="repeateMeasureIncButton' + baseindex + '" onClick="myGrooveWriter.repeatMeasureIncButtonClick(' + baseindex + ')" class="closeMeasureButton"><i class="fa">↑</i></div>';
    buttonsHTML += '<span style="color: var(--highlight-color-on-white);">' + repeat + '</span>';
    buttonsHTML += '<div title="Repeat Measure" id="repeateMeasureDecButton' + baseindex + '" onClick="myGrooveWriter.repeatMeasureDecButtonClick(' + baseindex + ')" class="closeMeasureButton"><i class="fa">↓</i></div>';
    buttonsHTML += '<div title="Duplicate Measure" id="duplicateMeasureButton' + baseindex + '" onClick="myGrooveWriter.duplicateMeasureButtonClick(' + baseindex + ')" class="closeMeasureButton"><i class="fa fa-rotate-left"></i></div>';
    buttonsHTML += '<div title="Add Measure" id="addMeasureMiddleButton' + baseindex + '" onClick="myGrooveWriter.addMeasureMiddleButtonClick(' + baseindex + ')" class="closeMeasureButton"><i class="fa fa-plus"></i></div>';
    buttonsHTML += '</div>'

    return buttonsHTML;
}

//
//
//
function generateLineLabels(baseindex) {
    return `
			<div class="line-labels">
				<div class="hh-label" onClick="noteLabelClick(event, 'hh', ${baseindex})" oncontextmenu="event.preventDefault(); noteLabelClick(event, 'hh', ${baseindex})">Hi-hat</div>
				<div class="tom-label" id="tom1-label" onClick="noteLabelClick(event, 'tom1', ${baseindex})" oncontextmenu="event.preventDefault(); noteLabelClick(event, 'tom1', ${baseindex})">Tom</div>
				<div class="snare-label" onClick="noteLabelClick(event, 'snare', ${baseindex})" oncontextmenu="event.preventDefault(); noteLabelClick(event, 'snare', ${baseindex})">Snare</div>
				<div class="tom-label" id="tom4-label" onClick="noteLabelClick(event, 'tom4', ${baseindex})" oncontextmenu="event.preventDefault(); noteLabelClick(event, 'tom4', ${baseindex})">Tom</div>
				<div class="kick-label" onClick="noteLabelClick(event, 'kick', ${baseindex})" oncontextmenu="event.preventDefault(); noteLabelClick(event, 'kick', ${baseindex})">Kick</div>
			</div>
		`;
}

function generateLineLabels(baseindex) {
    return `
        <div class="line-labels">
            <div class="hh-label" onClick="noteLabelClick(event, 'hh', ${baseindex})" oncontextmenu="event.preventDefault(); noteLabelClick(event, 'hh', ${baseindex})">Hi-hat</div>
            <div class="tom-label" id="tom1-label" onClick="noteLabelClick(event, 'tom1', ${baseindex})" oncontextmenu="event.preventDefault(); noteLabelClick(event, 'tom1', ${baseindex})">Tom</div>
            <div class="snare-label" onClick="noteLabelClick(event, 'snare', ${baseindex})" oncontextmenu="event.preventDefault(); noteLabelClick(event, 'snare', ${baseindex})">Snare</div>
            <div class="tom-label" id="tom4-label" onClick="noteLabelClick(event, 'tom4', ${baseindex})" oncontextmenu="event.preventDefault(); noteLabelClick(event, 'tom4', ${baseindex})">Tom</div>
            <div class="kick-label" onClick="noteLabelClick(event, 'kick', ${baseindex})" oncontextmenu="event.preventDefault(); noteLabelClick(event, 'kick', ${baseindex})">Kick</div>
        </div>
    `;
}


//
//
function shiftRepeatedMeasuresAfterIndex(measureIndex, direction) {
    // Convert Map to array of entries and sort by measure index
    const sortedEntries = [...editor.class_repeated_measures.entries()].sort((a, b) => a[0] - b[0]);
    
    // Process in reverse order to avoid overwriting
    for (let i = sortedEntries.length - 1; i >= 0; i--) {
        const [key, value] = sortedEntries[i];
        if (key > measureIndex) {
            editor.class_repeated_measures.set(key + direction, value);
            editor.class_repeated_measures.delete(key);
        }
    }
}