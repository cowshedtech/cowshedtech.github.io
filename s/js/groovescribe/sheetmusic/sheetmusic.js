// called by generate_ABC to remake the sheet music on the page
function displayNewSVG() {
    var svgTarget = document.getElementById("svgTarget"),
        diverr = document.getElementById("diverr");

    var abc_source = document.getElementById("ABCsource").value;
    var svg_return = renderABCtoSVG(editor.track, abc_source);

    diverr.innerHTML = svg_return.error_html;
    svgTarget.innerHTML = svg_return.svg;
};