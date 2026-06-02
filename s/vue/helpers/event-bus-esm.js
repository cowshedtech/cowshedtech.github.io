/** ESM shim: classic eventBus.js assigns window.eventBus before the Vite bundle runs. */
export const eventBus = globalThis.eventBus;
