// Decorative outline of Australia (mainland + Tasmania), for the "Proudly Australian" homepage band and the footer.
// Generated from ~150 simplified coastline points (equirectangular, longitude scaled by cos 26°). Not survey-accurate.
// Stroke uses currentColor (or its own plum → crimson gradient with `gradient: true`; pass a unique `id` if two gradients share a page); the line width stays fixed
// at any size (vector-effect). Always aria-hidden: the copy beside it carries the meaning.

const D = 'M266.9 3.0 L275.9 22.0 L278.6 36.0 L285.8 39.0 L292.1 51.0 L297.5 65.0 L301.1 81.0 L311.0 90.0 L323.6 100.0 L328.1 109.0 L336.1 118.0 L341.5 122.0 L342.4 131.0 L348.7 137.0 L356.8 145.0 L362.2 149.0 L361.3 160.0 L365.8 171.0 L366.7 182.0 L364.0 192.0 L362.2 200.0 L360.4 211.0 L356.8 219.0 L350.5 225.0 L346.0 234.0 L342.4 241.0 L340.6 248.0 L336.1 255.0 L334.4 263.0 L333.5 271.0 L325.4 274.0 L316.4 274.5 L311.0 277.0 L303.8 283.0 L301.1 287.0 L294.8 282.0 L289.4 281.0 L285.8 277.5 L280.4 282.0 L275.9 284.5 L266.0 280.0 L258.9 280.0 L249.9 276.5 L242.7 269.0 L240.9 262.0 L237.3 255.0 L231.9 252.0 L227.4 252.5 L231.0 245.0 L230.1 240.0 L226.5 236.0 L223.8 247.0 L217.5 248.5 L216.6 240.0 L222.0 232.0 L224.7 222.0 L219.3 231.0 L212.1 236.0 L207.6 243.5 L202.2 240.0 L201.3 232.0 L193.2 226.0 L187.8 218.0 L175.3 216.0 L164.5 211.0 L151.0 212.0 L136.6 218.0 L121.3 219.0 L107.9 225.0 L98.0 235.0 L82.7 235.0 L67.4 235.5 L57.5 240.0 L45.8 247.0 L34.2 246.0 L25.2 240.0 L19.8 239.0 L19.8 232.0 L25.2 229.0 L26.5 219.0 L26.1 213.0 L22.5 204.0 L19.8 196.0 L19.3 187.0 L16.2 182.0 L11.7 172.0 L6.3 162.0 L7.2 156.0 L5.4 150.0 L8.1 143.0 L5.4 136.0 L8.1 126.0 L9.9 116.0 L12.6 114.0 L16.2 120.0 L24.3 111.0 L35.1 102.0 L44.0 102.5 L52.1 99.0 L61.1 96.0 L73.7 91.0 L80.0 82.0 L84.5 75.0 L85.4 66.0 L91.7 60.0 L97.1 68.0 L98.9 59.0 L104.3 52.0 L110.6 46.0 L117.7 40.0 L124.0 35.0 L131.2 37.0 L137.5 44.0 L140.2 50.0 L146.5 45.0 L151.0 45.0 L152.8 36.0 L157.3 28.0 L156.4 24.0 L161.8 20.0 L167.2 18.0 L176.2 17.0 L178.0 11.0 L183.4 14.0 L190.5 15.0 L197.7 16.0 L204.9 16.0 L213.9 15.0 L217.1 19.0 L213.9 24.0 L208.5 30.0 L207.6 39.0 L203.1 43.0 L204.9 47.0 L212.1 52.0 L218.4 55.0 L227.4 63.0 L236.4 69.0 L243.6 73.0 L251.7 70.0 L256.2 60.0 L258.9 48.0 L258.0 32.0 L259.8 22.0 L261.5 15.0 L264.2 6.0 Z M286.3 303.0 L293.0 304.5 L302.0 307.5 L311.0 305.5 L319.1 305.5 L319.1 315.0 L316.4 323.0 L315.5 328.0 L307.4 331.0 L302.9 332.0 L297.5 329.0 L292.1 320.0 L290.3 313.0 L286.7 308.0 Z';

export function australiaOutline({ className = '', gradient = false, id = 'aus' } = {}) {
  const grad = gradient
    ? `<defs><linearGradient id="${id}-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" style="stop-color: var(--plum-600)"/><stop offset="1" style="stop-color: var(--crimson-500)"/></linearGradient></defs>`
    : '';
  return `<svg class="aus-outline ${className}" viewBox="-4 -4 377 342" aria-hidden="true" focusable="false">${grad}
    <path d="${D}" fill="none" stroke="${gradient ? `url(#${id}-grad)` : 'currentColor'}" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
  </svg>`;
}
