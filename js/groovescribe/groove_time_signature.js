// Javascript for the Groove Scribe HTML application

// parse a string like "4/4", "5/4" or "2/4"
function parseTimeSigString(timeSigString) {
    var split_arr = timeSigString.split("/");

    if(split_arr.length != 2)
        return [4, 4];

    var timeSigTop = parseInt(split_arr[0], 10);
    var timeSigBottom = parseInt(split_arr[1], 10);

    if(timeSigTop < 1 || timeSigTop > 32)
        timeSigTop = 4;

    // only valid if 2,4,8, or 16
    if(timeSigBottom != 2 && timeSigBottom != 4 && timeSigBottom != 8 && timeSigBottom != 16)
        timeSigBottom = 4;

    return [timeSigTop, timeSigBottom];
};