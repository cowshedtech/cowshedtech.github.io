export default {

  template: `
    <i class="fa ">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" width="30" height="30">
        <style type="text/css">
        .drag_fill {fill: currentColor}
        .drag_stroke {stroke: currentColor; fill: none; stroke-width: .7}
        </style>
        <defs>
        <path id="drag_ghd" class="drag_fill" d="m1.7-1c-1-1.7-4.5 0.2-3.4 2 1 1.7 4.5-0.2 3.4-2"></path>
        <ellipse id="drag_hd" rx="4.1" ry="2.9" transform="rotate(-20)" class="drag_fill"></ellipse>
        </defs>
        <g id="note" transform="translate(-44 -35)">
        <path class="fill" d="m51.81 38.34 l8.58 0.00v1.60l-8.58 0.00"></path>
        <path class="fill" d="m52.10 41.34 l8.00 0.00v1.60l-8.00 0.00"></path>
        <path class="drag_stroke" d="m52.1 53.34v-15.00"></path>
        <use x="50.50" y="53.34" xlink:href="#drag_ghd"></use>
        <path class="drag_stroke" d="m49.50 49.34l8.00 -15.00"></path>
        <path class="drag_stroke" d="m60.10 53.34v-15.00"></path>
        <use x="58.50" y="53.34" xlink:href="#drag_hd"></use>
        <path class="drag_stroke" d="m50.5 58.34c2.9 3 11.6 3 14.5 0M69.5 53.34v-21"></path>
        <use x="66.00" y="53.34" xlink:href="#drag_hd"></use>
        </g>
    </svg>
    </i>
  `
}