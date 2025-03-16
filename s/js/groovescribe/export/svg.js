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

// Render an SVG that is good for download.
// Constant size at 2000x200
function downloadImages(imageType) {
    var abc_source = generate_ABC(800);
    var svg_obj = renderABCtoSVG(editor.myGrooveUtils, abc_source);
    var filename;
    var tune_title = document.getElementById("tuneTitle").value;

    if (tune_title.length == 0) {
        filename = "notation.";
    } else {
        filename = tune_title;
    }
    filename += imageType;

    var svg_images = svg_obj.svg.split("</svg>");
    // that split should always create at least 2 since it will match that </svg> if there is only one
    // since the split creates an extra one reduce the length by 1
    for (var i = 0; i < svg_images.length - 1; i++) {
        var myPablo = Pablo(svg_images[i] + "</svg>");
        var width = parseFloat(myPablo.attr('width'));
        var height = parseFloat(myPablo.attr('height'));
        var imageRatio = height / width;
        var newWidth = 2000;
        var newHeight = Math.round(newWidth * imageRatio);
        var newBoxWidth = Math.round(newWidth * .8);
        var newBoxHeight = Math.round(newHeight * .8);
        myPablo.attr('width', newWidth + 'px');
        myPablo.attr('height', newHeight + 'px');
        myPablo.attr('viewBox', '0 0 ' + newBoxWidth + ' ' + newBoxHeight);
        myPablo.children('g').attr('transform', 'scale(2)');

        myPablo.download(imageType, filename, function (result) {
            if (result.error) {
                alert("An error occurred when trying to convert the sheet music to a PNG file.");
            }
        });
    }
}