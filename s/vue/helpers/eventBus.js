// Create a simple event emitter
const listeners = new Map();

const eventBus = {
    $on(event, callback) {
        if (!listeners.has(event)) {
            listeners.set(event, new Set());
        }
        listeners.get(event).add(callback);

        return () => this.$off(event, callback);
    },

    $off(event, callback) {
        if (listeners.has(event)) {
            if (callback) {
                listeners.get(event).delete(callback);
            } else {
                listeners.delete(event);
            }
        }
    },

    $emit(event, ...args) {
        if (listeners.has(event)) {
            listeners.get(event).forEach(callback => {
                callback(...args);
            });
        }
    }
};

// Make eventBus globally available
window.eventBus = eventBus; 



// addChangeHandler(handler) {
//     this.#changeHandlers.push(handler);
//     return () => this.removeChangeHandler(handler);
// }


// /**
//  * Removes a change event handler
//  * @param {Function} handler - The callback function to remove
//  */
// removeChangeHandler(handler) {
//     const index = this.#changeHandlers.indexOf(handler);
//     if (index !== -1) this.#changeHandlers.splice(index, 1);
// }