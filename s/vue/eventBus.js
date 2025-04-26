import { ref } from 'vue';

// Create a simple event emitter
const listeners = new Map();

const eventBus = {
    $on(event, callback) {
        if (!listeners.has(event)) {
            listeners.set(event, new Set());
        }
        listeners.get(event).add(callback);
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

export default eventBus; 