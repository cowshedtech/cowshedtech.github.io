/**
 * Run fn on window "load", or immediately if load already fired.
 * Needed for Vite bundles that may download after the load event (blank page otherwise).
 */
export function onDocumentLoaded(fn) {
  if (document.readyState === 'complete') {
    fn();
  } else {
    window.addEventListener('load', fn);
  }
}
