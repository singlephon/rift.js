export class RiftError extends Error {
    constructor(message, options = {}) {
        super('[Rift]: ' + message);
        this.name = this.constructor.name;
        this.code = options.code || null;
        this.context = options.context || null;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
