export default {

  template: `
    <i class="fa ">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" width="30" height="30">
        <style type="text/css">
        .flam_fill {fill: currentColor}
        .flam_stroke {stroke: currentColor; fill: none; stroke-width: .7}
        </style>
        <defs>
        <path id="flam_ghd" class="flam_fill" d="m1.7-1c-1-1.7-4.5 0.2-3.4 2 1 1.7 4.5-0.2 3.4-2"></path>
        <ellipse id="flam_hd" rx="4.1" ry="2.9" transform="rotate(-20)" class="flam_fill"></ellipse>
        </defs>
        <g id="note" transform="translate(-44 -35)">
        <path class="flam_stroke" d="m52.1 53.34v-14M52.1 39.34c0.6 3.4 5.6 3.8 3 10 1.2-4.4-1.4-7-3-7"></path>
        <use x="50.50" y="53.34" xlink:href="#flam_ghd"></use>
        <path class="flam_stroke" d="m49.5 49.34l9-5"></path>
        <path class="flam_stroke" d="m50.5 58.34c2.9 3 11.6 3 14.5 0M69.5 53.34v-21"></path>
        <use x="66.00" y="53.34" xlink:href="#flam_hd"></use>
        </g>
    </svg>
    </i>
  `
}