// callback class for abc generator library
function SVGLibCallback(root) {
    // -- required methods
    this.abc_svg_output = "";
    this.abc_error_output = "";

    // include a file (%%abc-include)
    this.read_file = function (fn) {
        return "";
    };
    // insert the errors
    this.errmsg = function (msg, l, c) {
        this.abc_error_output += msg + "<br/>\n";
    };

    // for possible playback or linkage
    this.get_abcmodel = function (tsfirst, voice_tb, music_types) {

        /*
        console.log(tsfirst);
        var next = tsfirst.next;

        while(next) {
        console.log(next);
        next = next.next;
        }
         */
    };

    // annotations
    this.anno_start = function (type, start, stop, x, y, w, h) { };
    this.svg_highlight_y = 0;
    this.svg_highlight_h = 44;
    this.anno_stop = function (type, start, stop, x, y, w, h) {

        // create a rectangle
        if (type == "bar") {
            // use the bar as the default y & hack
            this.svg_highlight_y = y + 5;
            this.svg_highlight_h = h + 10;
        }
        if (type == "note" || type == "grace") {
            y = this.svg_highlight_y;
            h = this.svg_highlight_h;
            root.abc_obj.out_svg('<rect style="fill: transparent;" class="abcr" id="abcNoteNum_' + root.grooveUtilsUniqueIndex + "_" + root.abcNoteNumIndex + '" x="');
            root.abc_obj.out_sxsy(x, '" y="', y);
            root.abc_obj.out_svg('" width="' + w.toFixed(2) + '" height="' + h.toFixed(2) + '"/>\n');

            //console.log("Type:"+type+ "\t abcNoteNumIndex:"+root.abcNoteNumIndex+ "\t X:"+x+ "\t Y:"+y+ "\t W:"+w+ "\t H:"+h);

            // don't increment on the grace note, since it is attached to the real note
            if (type != "grace")
                root.abcNoteNumIndex++;
        }
    };

    // image output
    this.img_out = function (str) {
        this.abc_svg_output += str; // + '\n'
    };

    // -- optional attributes
    this.page_format = true; // define the non-page-breakable blocks
}

// converts incoming ABC notation source into an svg image.
// returns an object with two items.   "svg" and "error_html"
function renderABCtoSVG(root, abc_source) {
    root.abc_obj = new Abc(root.abcToSVGCallback);
    if ((root.myGrooveData && root.myGrooveData.showLegend) || root.isLegendVisable)
        root.abcNoteNumIndex = -15; // subtract out the legend notes for a proper index.
    else
        root.abcNoteNumIndex = 0;
        root.abcToSVGCallback.abc_svg_output = ''; // clear
        root.abcToSVGCallback.abc_error_output = ''; // clear

    root.abc_obj.tosvg("SOURCE", abc_source);
    return {
        svg: root.abcToSVGCallback.abc_svg_output,
        error_html: root.abcToSVGCallback.abc_error_output
    };
};