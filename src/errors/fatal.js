export class FatalError extends Error {
    constructor(message) {
        super(message);
        this.name = "Fatal Error";
        this.statusCode = 500;
    }
}
